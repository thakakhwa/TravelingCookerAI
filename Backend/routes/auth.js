import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { generateVerificationCode, sendVerificationEmail, sendWelcomeEmail } from '../utils/email/emailService.js';
import passport from '../config/passport.js';

const router = express.Router();
const prisma = new PrismaClient();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).trim(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, username, password } = req.body;

    // Check if verified user already exists
    const existingVerifiedUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email, isVerified: true },
          { username: username, isVerified: true }
        ]
      }
    });

    if (existingVerifiedUser) {
      return res.status(400).json({ 
        error: existingVerifiedUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Check if unverified user exists with this email
    const existingUnverifiedUser = await prisma.user.findFirst({
      where: {
        email: email,
        isVerified: false
      }
    });

    // If unverified user exists, update their info and resend verification
    if (existingUnverifiedUser) {
      // Check if username is taken by another verified user
      const usernameConflict = await prisma.user.findFirst({
        where: {
          username: username,
          isVerified: true,
          id: { not: existingUnverifiedUser.id }
        }
      });

      if (usernameConflict) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Hash the new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate new verification code and expiry
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Update existing unverified user
      const updatedUser = await prisma.user.update({
        where: { id: existingUnverifiedUser.id },
        data: {
          username,
          password: hashedPassword,
          verificationCode,
          verificationCodeExpires
        },
        select: {
          id: true,
          email: true,
          username: true,
          isVerified: true,
          createdAt: true
        }
      });

      // Send verification email
      try {
        await sendVerificationEmail(email, username, verificationCode);
        console.log('✅ Verification email sent successfully to existing unverified user:', email);
      } catch (emailError) {
        console.error('❌ Failed to send verification email:', emailError.message);
        
        if (emailError.message === 'Email credentials not configured') {
          return res.status(201).json({
            message: 'Account updated! However, email verification is not configured. Please contact admin.',
            user: updatedUser,
            requiresVerification: true,
            emailError: 'Email service not configured'
          });
        }
      }

      return res.status(201).json({
        message: 'Account already exists but not verified. We\'ve sent a new verification code to your email.',
        user: updatedUser,
        requiresVerification: true
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification code and expiry
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user (unverified)
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        isVerified: false,
        verificationCode,
        verificationCodeExpires
      },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, username, verificationCode);
      console.log('✅ Verification email sent successfully to:', email);
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError.message);
      
      // If email is not configured, provide helpful message
      if (emailError.message === 'Email credentials not configured') {
        return res.status(201).json({
          message: 'Account created! However, email verification is not configured. Please contact admin.',
          user,
          requiresVerification: true,
          emailError: 'Email service not configured'
        });
      }
      
      // Don't fail the registration if email fails for other reasons
      console.log('⚠️ Account created but email failed. User can request resend later.');
    }

    res.status(201).json({
      message: 'Account created successfully! Please check your email for verification code.',
      user,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify email with code
router.post('/verify-email', [
  body('email').isEmail().normalizeEmail(),
  body('code').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, code } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Check if code matches and hasn't expired
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Update user to verified
    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpires: null
      },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(email, user.username);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if email fails
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Email verified successfully! Welcome to TravelCooker!',
      user: verifiedUser,
      token
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend verification code
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with new code
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationCodeExpires
      }
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, user.username, verificationCode);
      res.json({ message: 'Verification code sent successfully' });
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in',
        requiresVerification: true,
        email: user.email
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data without password
    const { password: _, verificationCode, verificationCodeExpires, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token and get user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
});

// Logout (client-side token removal, but we can track logout for analytics)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Google OAuth routes (only if configured)
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({ error: 'Google OAuth not configured' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/auth/error` }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = generateToken(req.user.id);
      
      // Send welcome email for new OAuth users
      const isNewUser = req.user.createdAt && 
        (new Date() - new Date(req.user.createdAt)) < 60000; // Created within last minute
      
      if (isNewUser) {
        try {
          await sendWelcomeEmail(req.user.email, req.user.username);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
        }
      }
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
  }
);

// Microsoft OAuth routes (only if configured)
router.get('/microsoft', (req, res, next) => {
  if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET) {
    return res.status(400).json({ error: 'Microsoft OAuth not configured' });
  }
  passport.authenticate('microsoft', { scope: ['user.read'] })(req, res, next);
});

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: `${process.env.FRONTEND_URL}/auth/error` }),
  async (req, res) => {
    try {
      // Generate JWT token for the authenticated user
      const token = generateToken(req.user.id);
      
      // Send welcome email for new OAuth users
      const isNewUser = req.user.createdAt && 
        (new Date() - new Date(req.user.createdAt)) < 60000; // Created within last minute
      
      if (isNewUser) {
        try {
          await sendWelcomeEmail(req.user.email, req.user.username);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
        }
      }
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    } catch (error) {
      console.error('Microsoft OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
  }
);

// Test endpoint to check OAuth configuration
router.get('/test-oauth-config', (req, res) => {
  res.json({
    googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    microsoftConfigured: !!(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
    frontendUrl: process.env.FRONTEND_URL,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    envVariablesFound: {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      MICROSOFT_CLIENT_ID: !!process.env.MICROSOFT_CLIENT_ID,
      MICROSOFT_CLIENT_SECRET: !!process.env.MICROSOFT_CLIENT_SECRET,
      JWT_SECRET: !!process.env.JWT_SECRET,
      SESSION_SECRET: !!process.env.SESSION_SECRET
    }
  });
});

export default router; 