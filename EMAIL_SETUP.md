# Email Integration Setup - SMTP Configuration

## 📧 Overview

The booking system uses **SMTP** (Simple Mail Transfer Protocol) to send email notifications via **Nodemailer**. Emails are sent when:
- A new booking is created (to admin and guest)
- Payment proof is uploaded (to admin)
- Booking status changes (to guest)

## 🔧 Setup Instructions

### Step 1: Choose Your Email Provider

You can use any SMTP provider. Here are popular options:

#### Option 1: Gmail (Free)
- **Host**: `smtp.gmail.com`
- **Port**: `587` (TLS) or `465` (SSL)
- **Requires**: App Password (not regular password)

#### Option 2: Outlook/Hotmail (Free)
- **Host**: `smtp-mail.outlook.com`
- **Port**: `587` (TLS)
- **Requires**: Your Microsoft account credentials

#### Option 3: Custom SMTP Server
- Use your hosting provider's SMTP server
- Check your hosting provider's documentation for SMTP settings

#### Option 4: Professional Email Services
- **SendGrid**: `smtp.sendgrid.net` (Port: 587)
- **Mailgun**: `smtp.mailgun.org` (Port: 587)
- **Amazon SES**: Check AWS documentation
- **Zoho Mail**: `smtp.zoho.com` (Port: 587)

### Step 2: Get SMTP Credentials

#### For Gmail:
1. Go to your Google Account settings
2. Enable **2-Step Verification**
3. Go to **App Passwords**: https://myaccount.google.com/apppasswords
4. Generate an app password for "Mail"
5. Use this app password (not your regular Gmail password)

#### For Outlook:
1. Use your regular Microsoft account email and password
2. If you have 2FA enabled, you may need an app password

#### For Custom SMTP:
- Contact your hosting provider or email service for SMTP credentials

### Step 3: Configure Environment Variables

Add these variables to your `server/.env` file:

```env
# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-or-password
EMAIL_FROM=Hotel Grill Durbar <noreply@grilldurbar.com>
ADMIN_EMAIL=admin@grilldurbar.com

# Optional: For custom email services
# EMAIL_SERVICE=gmail  # For Gmail, Outlook, etc.
# EMAIL_REJECT_UNAUTHORIZED=false  # Set to false to allow self-signed certificates
```

### Step 4: SMTP Configuration Examples

#### Gmail Configuration:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=Hotel Grill Durbar <yourname@gmail.com>
ADMIN_EMAIL=admin@gmail.com
```

#### Outlook Configuration:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=yourname@outlook.com
EMAIL_PASS=your-password
EMAIL_FROM=Hotel Grill Durbar <yourname@outlook.com>
ADMIN_EMAIL=admin@outlook.com
```

#### SendGrid Configuration:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=Hotel Grill Durbar <noreply@grilldurbar.com>
ADMIN_EMAIL=admin@grilldurbar.com
```

#### Custom SMTP (Example):
```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-email-password
EMAIL_FROM=Hotel Grill Durbar <noreply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com
```

### Step 5: Test the Integration

1. Start your server:
   ```bash
   cd server
   npm run dev
   ```

2. Create a test booking from the frontend
3. Check your email inbox (and spam folder) for notifications

## 📨 Email Notification Flow

### When Booking is Created:
1. ✅ Admin receives email with all booking details
2. ✅ Admin receives WhatsApp notification
3. ✅ Guest receives email confirmation (if email provided)

### When Payment Proof is Uploaded:
1. ✅ Admin receives email about payment submission
2. ✅ Admin receives WhatsApp notification
3. ✅ Admin receives comprehensive booking notification with payment proof link

### When Booking is Confirmed:
1. ✅ Guest receives confirmation email

## 🔍 Troubleshooting

### Emails Not Sending?

1. **Check Environment Variables**: Verify all email variables are set in `.env`
2. **Check SMTP Credentials**: Ensure username and password are correct
3. **Check Port Configuration**: 
   - Port `587` = TLS (most common)
   - Port `465` = SSL
   - Port `25` = Usually blocked by ISPs
4. **Check Firewall**: Ensure your server can access SMTP ports
5. **Check Server Logs**: Look for error messages in console

### Common Errors:

#### "Invalid login" or "Authentication failed"
- **Gmail**: Make sure you're using an App Password, not your regular password
- **Outlook**: Verify your credentials are correct
- **Custom SMTP**: Check with your provider

#### "Connection timeout"
- Check if port 587/465 is blocked by firewall
- Verify EMAIL_HOST is correct
- Try different port (587 vs 465)

#### "Self-signed certificate"
- Add `EMAIL_REJECT_UNAUTHORIZED=false` to `.env` (only for development)

#### "Message queued" but not received
- Check spam/junk folder
- Verify recipient email address
- Check email provider's sending limits

### Gmail-Specific Issues:

1. **"Less secure app access"**: Gmail no longer supports this. Use App Passwords instead.
2. **"Access blocked"**: Enable 2-Step Verification first, then create App Password
3. **Daily limits**: Gmail free accounts have sending limits (~500 emails/day)

### Testing SMTP Connection:

You can test your SMTP configuration by creating a test booking. The server will log:
- ✅ `Email sent to [email]` - Success
- ❌ `Email sending failed: [error]` - Check the error message

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use App Passwords** for Gmail instead of regular passwords
3. **Use environment-specific credentials** (dev vs production)
4. **Rotate passwords** regularly
5. **Use dedicated email accounts** for sending (not personal accounts)

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Outlook SMTP Settings](https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353)

## ✅ Testing Checklist

- [ ] SMTP host configured
- [ ] SMTP port configured (587 or 465)
- [ ] Email username configured
- [ ] Email password/app password configured
- [ ] FROM email address configured
- [ ] Admin email address configured
- [ ] Test booking created successfully
- [ ] Admin received email notification
- [ ] Guest received email confirmation (if email provided)
- [ ] Payment proof upload triggers email notifications

## 💡 Quick Start Example

For a quick test with Gmail:

1. Enable 2-Step Verification on your Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `server/.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   EMAIL_FROM=Hotel Grill Durbar <yourname@gmail.com>
   ADMIN_EMAIL=yourname@gmail.com
   ```
4. Restart server and test!
