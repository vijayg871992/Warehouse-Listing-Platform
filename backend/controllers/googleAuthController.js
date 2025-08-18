const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class GoogleAuthController {
  constructor() {
    // Initialize OAuth2Client with environment variables
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.redirectUri = process.env.GOOGLE_CALLBACK_URL || 'https://vijayg.dev/warehouse-listing/auth/google/callback';
    
    this.client = new OAuth2Client(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );
    
    console.log('Google OAuth initialized with redirect URI:', this.redirectUri);
  }

  // Generate JWT tokens
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'warehouse_listing_jwt_secret_2024',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'warehouse_listing_refresh_secret_2024',
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
    
    return { accessToken, refreshToken };
  }

  /**
   * Generate Google OAuth authorization URL
   */
  async getAuthURL(req, res) {
    try {
      // Create state token for CSRF protection
      const state = crypto.randomBytes(32).toString('hex');
      
      // Generate the authorization URL with proper configuration
      const authUrl = this.client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'consent',
        state: state,
        redirect_uri: this.redirectUri // Explicitly set redirect URI
      });

      console.log('Generated auth URL with redirect URI:', this.redirectUri);
      console.log('Full auth URL:', authUrl);

      res.json({
        success: true,
        data: {
          authUrl: authUrl
        }
      });
    } catch (error) {
      console.error('Failed to generate Google auth URL:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate Google auth URL',
        error: error.message
      });
    }
  }

  /**
   * Handle Google OAuth callback
   */
  async handleCallback(req, res) {
    try {
      const { code, state, error } = req.query;

      // Handle OAuth errors
      if (error) {
        console.error('OAuth error:', error);
        const clientUrl = this.getClientUrl();
        return res.redirect(`${clientUrl}?error=${error}`);
      }

      if (!code) {
        const clientUrl = this.getClientUrl();
        return res.redirect(`${clientUrl}?error=authorization_code_not_provided`);
      }

      console.log('Received callback with code, exchanging for tokens...');
      console.log('Using redirect URI:', this.redirectUri);

      // Exchange authorization code for tokens
      const { tokens } = await this.client.getToken({
        code: code,
        redirect_uri: this.redirectUri // Explicitly set redirect URI
      });
      
      this.client.setCredentials(tokens);

      // Verify the ID token
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.clientId
      });

      const payload = ticket.getPayload();
      const {
        sub: googleId,
        email,
        given_name: firstName,
        family_name: lastName,
        picture: profilePhoto,
        email_verified: emailVerified
      } = payload;

      console.log('Google user authenticated:', email);

      // Find or create user
      let user = await User.findOne({
        where: { googleId: googleId }
      });

      if (user) {
        // Existing Google user
        if (!user.isActive) {
          return res.redirect(`${this.getClientUrl()}?error=account_deactivated`);
        }

        console.log(`Existing Google user login: ${email}`);
      } else {
        // Check if user exists with this email
        user = await User.findOne({
          where: { email: email.toLowerCase() }
        });

        if (user) {
          // Link existing account with Google
          user.googleId = googleId;
          if (!user.profilePhoto && profilePhoto) {
            user.profilePhoto = profilePhoto;
          }
          if (!user.emailVerified && emailVerified) {
            user.emailVerified = true;
          }
          await user.save();
          
          console.log(`Linked existing account with Google: ${email}`);
        } else {
          // Create new user
          user = await User.create({
            firstName: firstName || 'User',
            lastName: lastName || '',
            email: email.toLowerCase(),
            password: this.generateRandomPassword(),
            googleId: googleId,
            profilePhoto: profilePhoto,
            emailVerified: emailVerified || false,
            role: 'user',
            isActive: true
          });
          
          console.log(`New user created via Google OAuth: ${email}`);
        }
      }

      // Generate JWT tokens
      const jwtTokens = this.generateTokens(user.id);

      // Prepare user data for client
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        profilePhoto: user.profilePhoto
      };

      // Redirect to client with tokens
      const clientUrl = this.getClientUrl();
      const redirectUrl = `${clientUrl}/oauth-handler.html?token=${jwtTokens.accessToken}&refresh=${jwtTokens.refreshToken}&user=${encodeURIComponent(JSON.stringify(userData))}`;
      
      console.log('Redirecting to:', redirectUrl);
      return res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      console.error('Error details:', error.response?.data || error.message);
      const clientUrl = this.getClientUrl();
      return res.redirect(`${clientUrl}?error=oauth_authentication_failed`);
    }
  }

  /**
   * Verify Google ID token for direct authentication (one-tap sign-in)
   */
  async verifyGoogleToken(req, res) {
    try {
      const { idToken, credential } = req.body;
      const tokenToVerify = idToken || credential;

      if (!tokenToVerify) {
        return res.status(400).json({
          success: false,
          message: 'Google ID token is required'
        });
      }

      console.log('Verifying Google ID token...');

      // Verify the token
      const ticket = await this.client.verifyIdToken({
        idToken: tokenToVerify,
        audience: this.clientId
      });

      const payload = ticket.getPayload();
      const {
        sub: googleId,
        email,
        given_name: firstName,
        family_name: lastName,
        picture: profilePhoto,
        email_verified: emailVerified
      } = payload;

      console.log('Token verified for user:', email);

      // Find or create user
      let user = await User.findOne({
        where: { googleId: googleId }
      });

      if (user) {
        if (!user.isActive) {
          return res.status(403).json({
            success: false,
            message: 'Account has been deactivated'
          });
        }

        console.log(`Google token login: ${email}`);
      } else {
        // Check if user exists with email
        user = await User.findOne({
          where: { email: email.toLowerCase() }
        });

        if (user) {
          // Link Google account
          user.googleId = googleId;
          if (!user.profilePhoto && profilePhoto) {
            user.profilePhoto = profilePhoto;
          }
          if (!user.emailVerified && emailVerified) {
            user.emailVerified = true;
          }
          await user.save();
          
          console.log(`Linked existing account with Google: ${email}`);
        } else {
          // Create new user
          user = await User.create({
            firstName: firstName || 'User',
            lastName: lastName || '',
            email: email.toLowerCase(),
            password: this.generateRandomPassword(),
            googleId: googleId,
            profilePhoto: profilePhoto,
            emailVerified: emailVerified || false,
            role: 'user',
            isActive: true
          });
          
          console.log(`New user created via Google token: ${email}`);
        }
      }

      // Generate JWT tokens
      const tokens = this.generateTokens(user.id);

      return res.json({
        success: true,
        message: 'Authentication successful',
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            profilePhoto: user.profilePhoto,
            emailVerified: user.emailVerified
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      });
    } catch (error) {
      console.error('Google token verification error:', error);
      res.status(400).json({
        success: false,
        message: 'Invalid Google token',
        error: error.message
      });
    }
  }

  /**
   * Generate secure random password for Google OAuth users
   */
  generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&';
    let password = '';
    
    // Ensure password meets requirements
    password += 'A'; // uppercase
    password += 'a'; // lowercase
    password += '1'; // number
    password += '@'; // special char
    
    // Add random characters
    for (let i = 4; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Get client URL
   */
  getClientUrl() {
    return process.env.CLIENT_URL || 'https://vijayg.dev/warehouse-listing';
  }
}

module.exports = new GoogleAuthController();