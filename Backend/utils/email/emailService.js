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
        <title>Verify Your TravelingCookerAI Account</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', 'Montserrat', 'Roboto', Arial, sans-serif;
                background: #000000;
                min-height: 100vh;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .email-card {
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(40px) saturate(180%);
                border: 1px solid rgba(0, 87, 255, 0.2);
                border-radius: 20px;
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(0, 87, 255, 0.1),
                    0 0 40px rgba(0, 87, 255, 0.1);
                overflow: hidden;
                margin: 40px 0;
            }
            .header {
                background: linear-gradient(135deg, #0057ff 0%, #0070f3 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
                border-bottom: 1px solid rgba(0, 87, 255, 0.2);
            }
            .logo {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                letter-spacing: -0.025em;
            }
            .logo .travel-text {
                color: #FFFFFF;
            }
            .logo .ai-text {
                color: #B0D9FF;
                font-weight: 300;
            }
            .header-text {
                font-size: 16px;
                opacity: 0.9;
                margin: 0;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
                background: rgba(0, 0, 0, 0.98);
            }

            .welcome-text {
                font-size: 28px;
                color: #FFFFFF;
                margin-bottom: 20px;
                font-weight: 600;
                letter-spacing: -0.025em;
                background: linear-gradient(135deg, #0057ff 0%, #0070f3 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .message {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.6;
                margin-bottom: 32px;
                font-weight: 300;
            }
            .code-container {
                background: linear-gradient(135deg, #0057ff 0%, #0070f3 100%);
                border-radius: 16px;
                padding: 32px;
                margin: 32px 0;
                display: inline-block;
                border: 1px solid rgba(0, 87, 255, 0.3);
                box-shadow: 
                    0 8px 32px rgba(0, 87, 255, 0.3),
                    0 0 0 1px rgba(0, 87, 255, 0.1);
            }
            .code-label {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                margin-bottom: 12px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .code {
                font-size: 42px;
                font-weight: 700;
                color: white;
                letter-spacing: 8px;
                font-family: 'Inter', 'Courier New', monospace;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                background: rgba(255, 255, 255, 0.1);
                padding: 16px 24px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .expires {
                background: rgba(255, 193, 7, 0.1);
                border: 1px solid rgba(255, 193, 7, 0.3);
                border-radius: 12px;
                padding: 16px 20px;
                margin: 24px 0;
                color: #FFD700;
                font-size: 14px;
                font-weight: 500;
                backdrop-filter: blur(10px);
            }
            .footer {
                background: rgba(0, 0, 0, 0.98);
                padding: 32px 30px;
                text-align: center;
                border-top: 1px solid rgba(0, 87, 255, 0.1);
            }
            .footer-text {
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
                margin: 0;
                line-height: 1.6;
                font-weight: 300;
            }
            .footer-logo {
                color: rgba(255, 255, 255, 0.8);
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 12px;
                letter-spacing: -0.025em;
            }
            .footer-logo .ai-text {
                color: #B0D9FF;
                font-weight: 300;
            }
            
            /* Responsive Design */
            @media (max-width: 640px) {
                .container {
                    padding: 16px;
                }
                .email-card {
                    margin: 20px 0;
                    border-radius: 16px;
                }
                .header {
                    padding: 32px 24px;
                }
                .content {
                    padding: 32px 24px;
                }
                .logo {
                    font-size: 28px;
                }
                .welcome-text {
                    font-size: 24px;
                }
                .code {
                    font-size: 36px;
                    letter-spacing: 6px;
                    padding: 12px 16px;
                }
                .code-container {
                    padding: 24px;
                }
                .footer {
                    padding: 24px 20px;
                }
            }
            
            /* Dark mode email client support */
            @media (prefers-color-scheme: dark) {
                .email-card {
                    background: rgba(0, 0, 0, 0.98) !important;
                }
                .content {
                    background: rgba(0, 0, 0, 0.98) !important;
                }
                .footer {
                    background: rgba(0, 0, 0, 0.98) !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-card">
                <div class="header">
                    <div class="logo">
                        <span class="travel-text">Traveling</span><span class="ai-text">CookerAI</span>
                    </div>
                    <p class="header-text">AI-Powered Travel Planning</p>
                </div>
                <div class="content">
                    <h1 class="welcome-text">Welcome aboard, ${username}!</h1>
                    <p class="message">
                        Thanks for joining TravelingCookerAI! We're excited to help you plan amazing adventures around the world with our AI-powered travel planning. 
                        To get started, please verify your email address using the code below:
                    </p>
                    <div class="code-container">
                        <div class="code-label">Verification Code</div>
                        <div class="code">${code}</div>
                    </div>
                    <div class="expires">
                        This code expires in 15 minutes for your security
                    </div>
                    <p class="message">
                        Once verified, you'll unlock access to personalized travel recommendations, 
                        the ability to save and manage your travel plans, and our intelligent chat assistant!
                    </p>
                </div>
                <div class="footer">
                    <div class="footer-logo">
                        Traveling<span class="ai-text">CookerAI</span>
                    </div>
                    <p class="footer-text">
                        If you didn't create this account, please ignore this email.<br>
                        Need help? Contact us at support@travelingcookerai.com
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
        <title>Welcome to TravelingCookerAI!</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', 'Montserrat', 'Roboto', Arial, sans-serif;
                background: #000000;
                min-height: 100vh;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .email-card {
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(40px) saturate(180%);
                border: 1px solid rgba(34, 197, 94, 0.2);
                border-radius: 20px;
                box-shadow: 
                    0 20px 60px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(34, 197, 94, 0.1),
                    0 0 40px rgba(34, 197, 94, 0.1);
                overflow: hidden;
                margin: 40px 0;
            }
            .header {
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
                border-bottom: 1px solid rgba(34, 197, 94, 0.2);
            }
            .logo {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                letter-spacing: -0.025em;
            }
            .logo .travel-text {
                color: #FFFFFF;
            }
            .logo .ai-text {
                color: rgba(255, 255, 255, 0.8);
                font-weight: 300;
            }
            .header-text {
                font-size: 16px;
                opacity: 0.9;
                margin: 0;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 300;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
                background: rgba(0, 0, 0, 0.98);
            }

            .welcome-text {
                font-size: 28px;
                color: #FFFFFF;
                margin-bottom: 20px;
                font-weight: 600;
                letter-spacing: -0.025em;
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .message {
                font-size: 16px;
                color: rgba(255, 255, 255, 0.85);
                line-height: 1.6;
                margin-bottom: 32px;
                font-weight: 300;
            }
            .features {
                display: grid;
                grid-template-columns: 1fr;
                gap: 16px;
                margin: 32px 0;
                text-align: left;
            }
            .feature {
                background: rgba(0, 87, 255, 0.05);
                border: 1px solid rgba(0, 87, 255, 0.2);
                border-radius: 16px;
                padding: 24px;
                border-left: 4px solid #0057ff;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }
            .feature:hover {
                background: rgba(0, 87, 255, 0.08);
                border-color: rgba(0, 87, 255, 0.3);
                transform: translateY(-2px);
            }
            .feature-header {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }

            .feature-title {
                font-weight: 600;
                color: #FFFFFF;
                font-size: 18px;
                letter-spacing: -0.025em;
            }
            .feature-desc {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                line-height: 1.5;
                margin-left: 36px;
                font-weight: 300;
            }
            .cta-button {
                background: linear-gradient(135deg, #0057ff 0%, #0070f3 100%);
                color: white;
                padding: 18px 36px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 600;
                display: inline-block;
                margin: 24px 0;
                box-shadow: 
                    0 8px 32px rgba(0, 87, 255, 0.3),
                    0 0 0 1px rgba(0, 87, 255, 0.1);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: 'Inter', sans-serif;
                letter-spacing: -0.025em;
            }
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 
                    0 12px 40px rgba(0, 87, 255, 0.4),
                    0 0 0 1px rgba(0, 87, 255, 0.2);
            }
            .footer {
                background: rgba(0, 0, 0, 0.98);
                padding: 32px 30px;
                text-align: center;
                border-top: 1px solid rgba(34, 197, 94, 0.1);
            }
            .footer-logo {
                color: rgba(255, 255, 255, 0.8);
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 12px;
                letter-spacing: -0.025em;
            }
            .footer-logo .ai-text {
                color: #B0D9FF;
                font-weight: 300;
            }
            .footer-text {
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
                margin: 0;
                line-height: 1.6;
                font-weight: 300;
            }
            
            /* Responsive Design */
            @media (max-width: 640px) {
                .container {
                    padding: 16px;
                }
                .email-card {
                    margin: 20px 0;
                    border-radius: 16px;
                }
                .header {
                    padding: 32px 24px;
                }
                .content {
                    padding: 32px 24px;
                }
                .logo {
                    font-size: 28px;
                }
                .welcome-text {
                    font-size: 24px;
                }

                .cta-button {
                    padding: 16px 28px;
                }
                .footer {
                    padding: 24px 20px;
                }
                .feature {
                    padding: 20px;
                }

            }
            
            /* Dark mode email client support */
            @media (prefers-color-scheme: dark) {
                .email-card {
                    background: rgba(0, 0, 0, 0.98) !important;
                }
                .content {
                    background: rgba(0, 0, 0, 0.98) !important;
                }
                .footer {
                    background: rgba(0, 0, 0, 0.98) !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-card">
                <div class="header">
                    <div class="logo">
                        <span class="travel-text">Traveling</span><span class="ai-text">CookerAI</span>
                    </div>
                    <p class="header-text">Ready to Explore the World</p>
                </div>
                <div class="content">
                    <h1 class="welcome-text">You're all set, ${username}!</h1>
                    <p class="message">
                        Congratulations! Your account has been successfully verified and you're now ready to start planning 
                        incredible journeys with our AI-powered travel assistant.
                    </p>
                    
                    <div class="features">
                        <div class="feature">
                            <div class="feature-header">
                                <div class="feature-title">AI Travel Plans</div>
                            </div>
                            <div class="feature-desc">Get intelligent itineraries tailored to your preferences, budget, and travel style</div>
                        </div>
                        <div class="feature">
                            <div class="feature-header">
                                <div class="feature-title">Save & Organize</div>
                            </div>
                            <div class="feature-desc">Keep all your travel plans organized and accessible from anywhere</div>
                        </div>
                        <div class="feature">
                            <div class="feature-header">
                                <div class="feature-title">Smart Chat Assistant</div>
                            </div>
                            <div class="feature-desc">Chat with our AI to refine plans, discover hidden gems, and get real-time recommendations</div>
                        </div>
                    </div>
                    
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="cta-button">
                        Start Planning Your Adventure
                    </a>
                    
                    <p class="message">
                        Ready to discover amazing destinations? Your AI travel companion is waiting to help you plan the perfect trip!
                    </p>
                </div>
                <div class="footer">
                    <div class="footer-logo">
                        Traveling<span class="ai-text">CookerAI</span>
                    </div>
                    <p class="footer-text">
                        Welcome to the TravelingCookerAI family!<br>
                        Your AI-powered journey begins now. Happy travels!
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
      from: `"TravelingCookerAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your TravelingCookerAI Account - Let\'s Start Planning!',
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
      from: `"TravelingCookerAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to TravelingCookerAI - You\'re Ready to Go!',
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