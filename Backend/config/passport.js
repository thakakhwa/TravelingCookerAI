import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        isVerified: true,
        createdAt: true
      }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      
      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (user) {
        // User exists, update Google ID if not set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { 
              googleId,
              isVerified: true // OAuth users are automatically verified
            },
            select: {
              id: true,
              email: true,
              username: true,
              isVerified: true,
              createdAt: true
            }
          });
        }
        return done(null, user);
      }

      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          username: profile.displayName || `user_${Date.now()}`,
          password: '', // No password for OAuth users
          googleId,
          isVerified: true, // OAuth users are automatically verified
          provider: 'google'
        },
        select: {
          id: true,
          email: true,
          username: true,
          isVerified: true,
          createdAt: true
        }
      });

      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
} else {
  console.log('⚠️  Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET missing');
}

// Microsoft OAuth Strategy (only if credentials are provided)
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "/api/auth/microsoft/callback",
    scope: ['user.read']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const microsoftId = profile.id;
      
      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (user) {
        // User exists, update Microsoft ID if not set
        if (!user.microsoftId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { 
              microsoftId,
              isVerified: true // OAuth users are automatically verified
            },
            select: {
              id: true,
              email: true,
              username: true,
              isVerified: true,
              createdAt: true
            }
          });
        }
        return done(null, user);
      }

      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          username: profile.displayName || `user_${Date.now()}`,
          password: '', // No password for OAuth users
          microsoftId,
          isVerified: true, // OAuth users are automatically verified
          provider: 'microsoft'
        },
        select: {
          id: true,
          email: true,
          username: true,
          isVerified: true,
          createdAt: true
        }
      });

      return done(null, user);
    } catch (error) {
      console.error('Microsoft OAuth error:', error);
      return done(error, null);
    }
  }));
} else {
  console.log('⚠️  Microsoft OAuth not configured - MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET missing');
}

export default passport; 