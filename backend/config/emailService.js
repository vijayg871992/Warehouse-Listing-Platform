const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.EMAIL_USER || 'admin@vijayg.dev',
        pass: process.env.EMAIL_PASS || 'VijjuProMax@871992'
      }
    });

    // Verify connection on startup
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
    } catch (error) {
      console.error('❌ Email service connection failed:', error.message);
    }
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: `"Warehouse Listing Platform" <${process.env.EMAIL_USER || 'admin@vijayg.dev'}>`,
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, '') // Strip HTML if no text provided
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, firstName) {
    const subject = 'Welcome to Warehouse Listing Platform!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Warehouse Listing Platform</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏢 Welcome to Warehouse Listing Platform!</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Thank you for joining our Warehouse Listing Platform! We're excited to have you as part of our community.</p>
            
            <p>With your account, you can:</p>
            <ul>
              <li>🏗️ List your warehouses for rent</li>
              <li>📊 Track warehouse analytics and performance</li>
              <li>💼 Manage warehouse inquiries and bookings</li>
              <li>📈 Access detailed reports and insights</li>
            </ul>
            
            <p>Ready to get started?</p>
            <a href="https://vijayg.dev/warehouse-listing" class="button">Access Your Dashboard</a>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The Warehouse Listing Platform Team</p>
          </div>
          <div class="footer">
            <p>This email was sent from Warehouse Listing Platform.<br>
            <a href="https://vijayg.dev/warehouse-listing">Visit Platform</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(email, firstName, resetToken) {
    const resetUrl = `https://vijayg.dev/warehouse-listing/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request - Warehouse Listing Platform';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your password for your Warehouse Listing Platform account.</p>
            
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset My Password</a>
            
            <div class="warning">
              <p><strong>Security Notice:</strong></p>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Your password will remain unchanged if you don't click the link</li>
              </ul>
            </div>
            
            <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; font-family: monospace; background: #e9ecef; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            
            <p>Best regards,<br>The Warehouse Listing Platform Team</p>
          </div>
          <div class="footer">
            <p>This email was sent from Warehouse Listing Platform.<br>
            <a href="https://vijayg.dev/warehouse-listing">Visit Platform</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendOTPEmail(email, firstName, otp, purpose = 'verification') {
    const subject = `Your OTP for Warehouse Listing Platform - ${otp}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your OTP Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #28a745; text-align: center; letter-spacing: 8px; padding: 20px; background: white; border: 2px dashed #28a745; border-radius: 10px; margin: 20px 0; }
          .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Your OTP Code</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Your One-Time Password (OTP) for ${purpose} is:</p>
            
            <div class="otp-code">${otp}</div>
            
            <div class="warning">
              <p><strong>Important:</strong></p>
              <ul>
                <li>This OTP is valid for 10 minutes only</li>
                <li>Don't share this code with anyone</li>
                <li>If you didn't request this OTP, please contact support</li>
              </ul>
            </div>
            
            <p>Enter this code on the verification page to complete your ${purpose}.</p>
            
            <p>Best regards,<br>The Warehouse Listing Platform Team</p>
          </div>
          <div class="footer">
            <p>This email was sent from Warehouse Listing Platform.<br>
            <a href="https://vijayg.dev/warehouse-listing">Visit Platform</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendInquiryNotification(email, firstName, warehouseName, inquiryDetails) {
    const subject = `New Inquiry for ${warehouseName} - Warehouse Listing Platform`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Warehouse Inquiry</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #17a2b8; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .inquiry-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #17a2b8; }
          .button { display: inline-block; padding: 12px 30px; background: #17a2b8; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 New Warehouse Inquiry!</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>You have received a new inquiry for your warehouse <strong>${warehouseName}</strong>.</p>
            
            <div class="inquiry-box">
              <h3>Inquiry Details:</h3>
              <p><strong>Contact:</strong> ${inquiryDetails.contactName}</p>
              <p><strong>Email:</strong> ${inquiryDetails.contactEmail}</p>
              <p><strong>Phone:</strong> ${inquiryDetails.contactPhone}</p>
              <p><strong>Message:</strong></p>
              <p>${inquiryDetails.message}</p>
            </div>
            
            <p>Please respond to this inquiry as soon as possible to maintain good customer relations.</p>
            
            <a href="https://vijayg.dev/warehouse-listing/dashboard/inquiries" class="button">View All Inquiries</a>
            
            <p>Best regards,<br>The Warehouse Listing Platform Team</p>
          </div>
          <div class="footer">
            <p>This email was sent from Warehouse Listing Platform.<br>
            <a href="https://vijayg.dev/warehouse-listing">Visit Platform</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, subject, html);
  }
}

module.exports = new EmailService();