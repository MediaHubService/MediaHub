# Google Authentication Setup Guide

## Overview
MediaHub now uses **Google OAuth 2.0** for authentication - providing a secure, seamless single sign-on experience.

## Files Created/Updated

### Authentication Pages
- **`login.html`** - Login page with Google authentication
- **`signup.html`** - Registration page with Google authentication  
- **`dashboard.html`** - Updated to display Google user profile data

## Setup Instructions

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"New Project"** or select an existing project
3. Enable the **Google+ API**

### Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services > OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - App name: `MediaHub`
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (during development)

### Step 3: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services > Credentials**
2. Click **"Create Credentials" > "OAuth client ID"**
3. Application type: **Web application**
4. Name: `MediaHub Web Client`
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:8080
   https://yourdomain.com
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:3000
   http://localhost:8080
   https://yourdomain.com
   ```
7. Click **Create**
8. Copy your **Client ID**

### Step 4: Update Code

Replace `YOUR_GOOGLE_CLIENT_ID` in both files:

**In `login.html` (line ~270):**
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

**In `signup.html` (line ~310):**
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

### Step 5: Test Authentication

1. Open `login.html` in your browser
2. Click **"Continue with Google"**
3. Select your Google account
4. You'll be redirected to `dashboard.html`

## Features

### ✅ What's Implemented

1. **Google Sign-In Button**
   - Modern, branded Google button
   - Hover animations
   - Loading states

2. **One Tap Sign-In**
   - Google's automatic prompt
   - Seamless UX
   - Auto-select for returning users

3. **User Profile Sync**
   - Profile picture from Google
   - User name from Google
   - Email from Google
   - Automatic dashboard updates

4. **Session Management**
   - localStorage for persistence
   - Token-based authentication
   - Automatic redirects

5. **Demo Mode**
   - Works without real Google credentials
   - Perfect for testing UI/UX
   - Simulated 2-second login

### 🎨 Design Features

- **Login Page**: Purple gradient background
- **Signup Page**: Pink gradient background
- **Animated backgrounds**: Floating circles
- **Smooth transitions**: Fade and slide effects
- **Loading spinners**: Professional feedback
- **Toast notifications**: Success/error messages

## Security Notes

### For Production

1. **Never expose your Client Secret**
2. **Use HTTPS in production**
3. **Verify tokens on your backend**
4. **Implement token refresh logic**
5. **Add CSRF protection**
6. **Set proper CORS headers**

### Backend Integration (Recommended)

```javascript
// Send token to your backend
async function verifyTokenOnBackend(token) {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  return response.json();
}
```

## Current Demo Mode

The authentication currently works in **demo mode**:
- Clicking Google button simulates login
- Creates mock user data
- Stores in localStorage
- Redirects to dashboard
- **No real Google credentials needed**

This allows you to:
- ✅ Test the UI/UX immediately
- ✅ See the full user flow
- ✅ Customize design before going live
- ✅ Show stakeholders the experience

## User Data Structure

```javascript
{
  id: "google-sub-id",
  name: "John Doe",
  email: "john@gmail.com",
  picture: "https://lh3.googleusercontent.com/...",
  token: "google-oauth-token",
  loginTime: "2026-05-25T10:30:00.000Z",
  isNewUser: false
}
```

## Testing Checklist

- [ ] Login page displays correctly
- [ ] Signup page displays correctly
- [ ] Google button hover effects work
- [ ] Loading spinner shows on click
- [ ] Toast notifications appear
- [ ] Redirect to dashboard works
- [ ] Dashboard shows user profile
- [ ] Logout functionality works
- [ ] Session persists on refresh

## Troubleshooting

### "Google prompt not showing"
- Check if popup blocker is enabled
- Verify Client ID is correct
- Check browser console for errors

### "Redirect URI mismatch"
- Ensure redirect URIs match exactly in Google Console
- Include trailing slashes if needed

### "Invalid Client ID"
- Double-check Client ID format
- Ensure OAuth API is enabled
- Wait 5 minutes after creating credentials

## Next Steps

1. **Get real Google credentials**
2. **Replace Client ID in code**
3. **Test with real Google accounts**
4. **Add backend token verification**
5. **Deploy to production with HTTPS**

## Support

For Google OAuth issues:
- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [Google Cloud Support](https://cloud.google.com/support)

---

**Status**: ✅ Demo mode working | ⏳ Awaiting real Google Client ID for production
