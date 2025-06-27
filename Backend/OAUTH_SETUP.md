# OAuth Setup Guide

This guide will help you set up Google and Microsoft OAuth authentication for your TravelCooker application.

## Current Issue

You're seeing the error "Google OAuth not configured" because the OAuth environment variables are not set up. The application requires these credentials to authenticate users with Google and Microsoft.

## Quick Fix

1. Create a `.env` file in the `Backend` directory with the following content:

```env
# Environment Configuration
NODE_ENV=development
PORT=3001

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production

# Session Secret (change this to a secure random string)
SESSION_SECRET=your-super-secure-session-secret-change-this-in-production

# Email Configuration (optional)
EMAIL_FROM=noreply@travelcooker.com
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASS=your-app-password

# Google OAuth (required for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth (required for Microsoft sign-in)
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

2. Then follow the steps below to get your OAuth credentials.

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "TravelCooker")
4. Click "Create"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" API

### Step 3: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in app name: "TravelCooker"
   - Add your email as support email
   - Add authorized domains: `localhost`
4. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "TravelCooker Web Client"
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`

### Step 4: Get Your Credentials

1. Copy the Client ID and Client Secret
2. Add them to your `.env` file:
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id-here
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   ```

## Microsoft OAuth Setup

### Step 1: Register App in Azure

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Fill in:
   - Name: "TravelCooker"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: "Web" → `http://localhost:3001/api/auth/microsoft/callback`

### Step 2: Get Application Details

1. After creating, note the "Application (client) ID"
2. Go to "Certificates & secrets"
3. Click "New client secret"
4. Add description: "TravelCooker Client Secret"
5. Choose expiration (recommend 24 months)
6. Copy the secret value immediately (it won't be shown again)

### Step 3: Configure Permissions

1. Go to "API permissions"
2. Add a permission → "Microsoft Graph" → "Delegated permissions"
3. Add "User.Read" permission
4. Click "Grant admin consent" if prompted

### Step 4: Add to Environment

```env
MICROSOFT_CLIENT_ID=your-actual-application-id-here
MICROSOFT_CLIENT_SECRET=your-actual-client-secret-here
```

## Testing the Setup

1. Save your `.env` file
2. Restart your backend server:
   ```bash
   cd Backend
   npm start
   ```
3. Look for these messages in the console:
   - ✅ If configured: No error messages about OAuth
   - ❌ If not configured: "Google OAuth not configured" or "Microsoft OAuth not configured"

4. Test the OAuth flow:
   - Go to your frontend (http://localhost:5173)
   - Click "Sign in with Google" or "Sign in with Microsoft"
   - You should be redirected to the OAuth provider's login page

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Make sure your redirect URIs in Google/Microsoft console exactly match:
   - Google: `http://localhost:3001/api/auth/google/callback`
   - Microsoft: `http://localhost:3001/api/auth/microsoft/callback`

2. **"invalid_client" error**
   - Double-check your Client ID and Client Secret
   - Make sure there are no extra spaces or characters

3. **CORS errors**
   - Ensure your frontend URL is correct in the `.env` file
   - Check that origins are properly configured in OAuth providers

4. **"Google OAuth not configured" persists**
   - Restart your backend server after adding credentials
   - Check that your `.env` file is in the correct location (`Backend/.env`)

### Test Your Environment Variables

Add this temporary test endpoint to check if your environment variables are loaded:

```javascript
// Add to Backend/routes/auth.js for testing
router.get('/test-oauth-config', (req, res) => {
  res.json({
    googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    microsoftConfigured: !!(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
    frontendUrl: process.env.FRONTEND_URL
  });
});
```

Visit `http://localhost:3001/api/auth/test-oauth-config` to see if your environment variables are loaded.

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique secrets for production
- Consider using Azure Key Vault or similar for production secrets
- Regularly rotate your OAuth client secrets

## Production Considerations

For production deployment, you'll need to:

1. Update redirect URIs to your production domain
2. Add your production domain to OAuth provider authorized origins
3. Use environment variables or secure secret management
4. Enable HTTPS for all OAuth flows 