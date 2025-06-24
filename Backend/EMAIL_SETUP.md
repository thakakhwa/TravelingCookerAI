# Email Verification & OAuth Setup Guide

This guide walks you through setting up email verification and OAuth authentication for TravelCooker with support for Gmail/Google and Hotmail/Microsoft.

## 📧 Email Service Configuration

### Gmail Setup

1. **Enable 2-Factor Authentication**
   - Go to your [Google Account settings](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification
   - Enable 2-Factor Authentication

2. **Generate App Password**
   - Go to Security → App passwords
   - Select "Mail" as the app
   - Generate a 16-character app password
   - Save this password for your `.env` file

3. **Environment Variables**
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### Hotmail/Outlook Setup

1. **Enable App Passwords**
   - Go to [Microsoft Account Security](https://account.microsoft.com/security)
   - Navigate to Security dashboard → Advanced security options
   - Enable 2-step verification if not already enabled
   - Go to App passwords → Create new app password

2. **Environment Variables**
   ```env
   EMAIL_USER=your-email@hotmail.com
   EMAIL_PASSWORD=your-generated-app-password
   ```

## 🔧 Environment Configuration

Create a `.env` file in the `Backend` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/travelcooker_db"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password-here"

# Frontend URL (for email links)
FRONTEND_URL="http://localhost:3000"

# OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
MICROSOFT_CLIENT_ID="your-microsoft-client-id"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"
SESSION_SECRET="your-super-secret-session-key"
```

## 🔐 OAuth Setup

### Google OAuth Configuration

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API

2. **Create OAuth 2.0 Credentials**
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
   - Copy Client ID and Client Secret

3. **Environment Variables**
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

### Microsoft OAuth Configuration

1. **Register App in Azure**
   - Go to [Azure App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps)
   - Click "New registration"
   - Name: TravelCooker
   - Redirect URI: `http://localhost:3001/api/auth/microsoft/callback`

2. **Configure Permissions**
   - Go to API permissions → Add permission → Microsoft Graph
   - Add "User.Read" permission
   - Grant admin consent

3. **Create Client Secret**
   - Go to Certificates & secrets → New client secret
   - Copy the secret value immediately

4. **Environment Variables**
   ```env
   MICROSOFT_CLIENT_ID=your-microsoft-client-id
   MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
   ```

## 🚀 Features

### OAuth Authentication Flow
1. **Sign in with Google/Microsoft**: One-click authentication
2. **Automatic Account Creation**: No manual registration needed
3. **Auto-verified**: OAuth users are automatically verified
4. **Welcome Email**: Beautiful welcome email for new OAuth users

### Email Verification Flow
1. **Registration**: User creates account → verification email sent
2. **Verification**: User enters 6-digit code → account activated
3. **Welcome Email**: Beautiful welcome email sent after verification

### Email Templates
- **Verification Email**: Modern, responsive design with 6-digit code
- **Welcome Email**: Feature overview and call-to-action
- **Mobile Responsive**: Optimized for all devices
- **Beautiful Themes**: Gradient backgrounds and modern styling

### Security Features
- **Code Expiration**: 15-minute expiry for verification codes
- **Rate Limiting**: Resend protection (1-minute cooldown)
- **Secure Codes**: Cryptographically secure 6-digit codes

## 🎨 Email Template Features

### Verification Email
- Beautiful gradient header with TravelCooker branding
- Large, clear verification code display
- Expiration timer and instructions
- Professional footer with support contact

### Welcome Email
- Celebration theme with animated elements
- Feature highlights (Personalized Plans, Save Adventures, AI Assistant)
- Call-to-action button linking to the app
- Social media encouragement

## 🛠️ Development Testing

For testing in development, you can use:

1. **Gmail Test Account**: Create a dedicated Gmail account for testing
2. **Email Debugging**: Check console logs for email sending status
3. **Frontend Testing**: Use browser dev tools to inspect verification flow

## 📱 Frontend Integration

The email verification includes:
- **Beautiful UI**: Modern verification code input with animations
- **Auto-focus**: Seamless input experience
- **Paste Support**: Users can paste full 6-digit codes
- **Countdown Timer**: Visual feedback for code expiration
- **Resend Functionality**: Easy code resending with cooldown
- **Error Handling**: Clear error messages and validation

## 🔍 Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check if 2FA is enabled
   - Verify app password is correct
   - Ensure EMAIL_USER matches the account that generated the app password

2. **"Connection refused"**
   - Check internet connection
   - Verify firewall settings
   - Try using a different email service temporarily

3. **Emails going to spam**
   - This is normal for development
   - In production, consider using a dedicated email service (SendGrid, AWS SES)
   - Add SPF/DKIM records for your domain

### Production Recommendations

For production deployment:
- Use dedicated email service (SendGrid, AWS SES, Mailgun)
- Set up proper SPF, DKIM, and DMARC records
- Use a custom domain for from address
- Implement email rate limiting and monitoring

## 🎯 Next Steps

1. Set up your email credentials in `.env`
2. Test the registration flow
3. Check email delivery and formatting
4. Customize email templates if needed
5. Configure production email service for deployment

Happy coding! ✈️ 