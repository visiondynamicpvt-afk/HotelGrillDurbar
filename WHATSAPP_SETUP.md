# WhatsApp Integration Setup - Callmebot API

## 📱 Overview

The booking system uses **Callmebot API** to send WhatsApp notifications to the admin when:
- A new booking is created
- Payment proof is uploaded
- Booking status changes

## 🔧 Setup Instructions

### Step 1: Get Callmebot API Key

1. Visit [Callmebot.com](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
2. Follow the instructions to get your API key
3. You can also use the free tier which allows limited messages per day

### Step 2: Configure Environment Variables

Add these variables to your `server/.env` file:

```env
# WhatsApp Configuration (Callmebot API)
CALLMEBOT_API_KEY=your-callmebot-api-key-here
ADMIN_WHATSAPP_NUMBER=9779841234567
```

**Important Notes:**
- `ADMIN_WHATSAPP_NUMBER`: Your WhatsApp number in international format **without** the `+` sign
- Example: For Nepal number `+977-9841234567`, use `9779841234567`
- Example: For India number `+91-9876543210`, use `919876543210`

### Step 3: Test the Integration

1. Start your server
2. Create a test booking
3. Check your WhatsApp for the notification

## 📨 Notification Flow

### When Booking is Created:
1. ✅ Admin receives WhatsApp message with all booking details
2. ✅ Admin receives Email notification
3. ✅ Guest receives Email confirmation (if email provided)

### When Payment Proof is Uploaded:
1. ✅ Admin receives WhatsApp message about payment submission
2. ✅ Admin receives Email notification
3. ✅ Admin receives comprehensive booking notification with payment proof link

## 📋 WhatsApp Message Format

The WhatsApp messages include:
- 🏨 Booking ID
- 👤 Guest information (name, phone, email)
- 📅 Check-in and check-out dates
- 🛏️ Room and guest details
- 💰 Payment information
- 📝 Special requests (if any)
- 🔗 Admin panel link

## 🔍 Troubleshooting

### Messages Not Sending?

1. **Check API Key**: Verify your Callmebot API key is correct
2. **Check Phone Number**: Ensure phone number is in correct format (no +, no spaces)
3. **Check API Limits**: Free tier has daily limits
4. **Check Server Logs**: Look for error messages in console

### Common Errors:

- `Callmebot API key not configured`: Add `CALLMEBOT_API_KEY` to `.env`
- `WhatsApp sending failed`: Check API key validity and phone number format
- `Message queued` but not received: Wait a few minutes, check spam

## 📚 Callmebot API Documentation

For more information, visit:
- [Callmebot WhatsApp API](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
- [API Documentation](https://www.callmebot.com/api/)

## 💡 Alternative: Twilio (Paid)

If you prefer using Twilio (paid service), you can modify `server/src/utils/notifications.ts` to use Twilio instead of Callmebot.

## ✅ Testing Checklist

- [ ] Callmebot API key configured
- [ ] Admin WhatsApp number configured (correct format)
- [ ] Test booking created successfully
- [ ] Admin received WhatsApp notification
- [ ] Admin received Email notification
- [ ] Guest received Email confirmation (if email provided)
- [ ] Payment proof upload triggers notifications
