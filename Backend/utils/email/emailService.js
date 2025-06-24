import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configure nodemailer transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials not configured. Add EMAIL_USER and EMAIL_PASSWORD to .env file');
    throw new Error('Email credentials not configured');
  }

  console.log('📧 Creating email transporter for:', process.env.EMAIL_USER);
  
  return nodemailer.createTransport({
    service: 'gmail', // This works for both Gmail and Hotmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // App password for Gmail
    },
    debug: true, // Enable debug logs
    logger: true // Enable detailed logs
  });
};

// Generate a 6-digit verification code
export const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Verification email template
const getVerificationEmailTemplate = (username, code) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your TravelCooker Account</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .email-card {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
                margin: 40px 0;
            }
            .header {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .header-text {
                font-size: 18px;
                opacity: 0.9;
                margin: 0;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .welcome-text {
                font-size: 24px;
                color: #333;
                margin-bottom: 20px;
                font-weight: 600;
            }
            .message {
                font-size: 16px;
                color: #666;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .code-container {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                border-radius: 15px;
                padding: 30px;
                margin: 30px 0;
                display: inline-block;
            }
            .code {
                font-size: 36px;
                font-weight: bold;
                color: white;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
                text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .code-label {
                color: white;
                font-size: 14px;
                margin-bottom: 10px;
                opacity: 0.9;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            .footer-text {
                color: #6c757d;
                font-size: 14px;
                margin: 0;
                line-height: 1.5;
            }
            .expires {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 10px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
                font-size: 14px;
            }
            .plane-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-card">
                <div class="header">
                    <div class="logo">✈️ TravelCooker</div>
                    <p class="header-text">Your Journey Begins Here</p>
                </div>
                <div class="content">
                    <div class="plane-icon">🎉</div>
                    <h1 class="welcome-text">Welcome aboard, ${username}!</h1>
                    <p class="message">
                        Thanks for joining TravelCooker! We're excited to help you plan amazing adventures around the world. 
                        To get started, please verify your email address using the code below:
                    </p>
                    <div class="code-container">
                        <div class="code-label">Verification Code</div>
                        <div class="code">${code}</div>
                    </div>
                    <div class="expires">
                        ⏰ This code will expire in 15 minutes for security reasons.
                    </div>
                    <p class="message">
                        Once verified, you'll be able to save your travel plans, access personalized recommendations, 
                        and start planning your next great adventure!
                    </p>
                </div>
                <div class="footer">
                    <p class="footer-text">
                        If you didn't create this account, please ignore this email.<br>
                        Need help? Contact us at support@travelcooker.com
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Welcome email template (sent after successful verification)
const getWelcomeEmailTemplate = (username) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TravelCooker!</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .email-card {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
                margin: 40px 0;
            }
            .header {
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .header-text {
                font-size: 18px;
                opacity: 0.9;
                margin: 0;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .welcome-text {
                font-size: 28px;
                color: #333;
                margin-bottom: 20px;
                font-weight: 600;
            }
            .message {
                font-size: 16px;
                color: #666;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .features {
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
                margin: 30px 0;
                text-align: left;
            }
            .feature {
                background: #f8f9fa;
                border-radius: 15px;
                padding: 20px;
                border-left: 4px solid #11998e;
            }
            .feature-icon {
                font-size: 24px;
                margin-right: 10px;
            }
            .feature-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 5px;
            }
            .feature-desc {
                color: #666;
                font-size: 14px;
            }
            .cta-button {
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                color: white;
                padding: 15px 30px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                display: inline-block;
                margin: 20px 0;
                box-shadow: 0 4px 15px rgba(17, 153, 142, 0.3);
                transition: transform 0.3s ease;
            }
            .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
            }
            .footer-text {
                color: #6c757d;
                font-size: 14px;
                margin: 0;
                line-height: 1.5;
            }
            .celebration-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-card">
                <div class="header">
                    <div class="logo">✈️ TravelCooker</div>
                    <p class="header-text">Ready to Explore the World</p>
                </div>
                <div class="content">
                    <div class="celebration-icon">🎊</div>
                    <h1 class="welcome-text">You're all set, ${username}!</h1>
                    <p class="message">
                        Congratulations! Your account has been successfully verified and you're now ready to start planning 
                        incredible journeys with TravelCooker.
                    </p>
                    
                    <div class="features">
                        <div class="feature">
                            <div class="feature-icon">🌍</div>
                            <div class="feature-title">Personalized Travel Plans</div>
                            <div class="feature-desc">Get custom itineraries tailored to your preferences and budget</div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">💾</div>
                            <div class="feature-title">Save Your Adventures</div>
                            <div class="feature-desc">Keep all your travel plans organized in one place</div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🤖</div>
                            <div class="feature-title">AI Travel Assistant</div>
                            <div class="feature-desc">Chat with our AI to refine your plans and get recommendations</div>
                        </div>
                    </div>
                    
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="cta-button">
                        Start Planning Your Trip
                    </a>
                    
                    <p class="message">
                        Ready to discover amazing destinations? Start by creating your first travel plan!
                    </p>
                </div>
                <div class="footer">
                    <p class="footer-text">
                        Welcome to the TravelCooker family! 🎉<br>
                        Follow us on social media for travel inspiration and tips.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send verification email
export const sendVerificationEmail = async (email, username, code) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"TravelCooker ✈️" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Verify Your TravelCooker Account - Let\'s Start Planning!',
      html: getVerificationEmailTemplate(username, code)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"TravelCooker ✈️" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🌟 Welcome to TravelCooker - You\'re Ready to Go!',
      html: getWelcomeEmailTemplate(username)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}; 