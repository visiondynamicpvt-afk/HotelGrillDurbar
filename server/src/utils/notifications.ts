import nodemailer from 'nodemailer';
import { format } from 'date-fns';

type BookingLike = {
  _id?: string;
  id?: string;
  bookingId: string;
  guestName: string;
  phoneNumber: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfRooms: number;
  numberOfGuests: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentProof?: string;
  specialRequests?: string;
  createdAt?: any;
};

const getBookingId = (booking: BookingLike) => booking.id || booking._id || booking.bookingId || '';

const getCreatedAtDate = (value: any) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  if (value.toDate && typeof value.toDate === 'function') return value.toDate();
  return new Date();
};

const getPaymentProofLink = (paymentProof?: string) => {
  if (!paymentProof) return 'Not available';
  if (paymentProof.startsWith('data:')) return 'Uploaded (base64)';

  // Keep absolute URLs (e.g., Cloudinary) unchanged.
  if (/^https?:\/\//i.test(paymentProof)) return paymentProof;

  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:8080').replace(/\/+$/, '');
  const normalizedPath = paymentProof.startsWith('/') ? paymentProof : `/${paymentProof}`;
  return `${frontendUrl}${normalizedPath}`;
};

// Email transporter with enhanced SMTP configuration
const createEmailTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const secure = port === 465; // Port 465 uses SSL, 587 uses TLS
  
  const transporterConfig: any = {
    host: process.env.EMAIL_HOST,
    port: port,
    secure: secure, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  // Add TLS configuration for non-SSL ports (587, 25, etc.)
  if (!secure) {
    transporterConfig.requireTLS = true;
    transporterConfig.tls = {
      // Do not fail on invalid certificates
      rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false',
    };
  }

  // Support for custom SMTP service (like Mailgun, SendGrid, etc.)
  if (process.env.EMAIL_SERVICE) {
    transporterConfig.service = process.env.EMAIL_SERVICE;
  }

  return nodemailer.createTransport(transporterConfig);
};

// Send email notification
export const sendEmailNotification = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ Email not configured, skipping email notification');
      return false;
    }

    const transporter = createEmailTransporter();
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Hotel Grill Durbar <noreply@grilldurbar.com>',
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

// Send WhatsApp notification using Callmebot API
export const sendWhatsAppNotification = async (
  phoneNumber: string,
  message: string
): Promise<boolean> => {
  try {
    const apiKey = process.env.CALLMEBOT_API_KEY;
    
    if (!apiKey) {
      console.log('⚠️ Callmebot API key not configured, skipping WhatsApp notification');
      return false;
    }

    // Remove + and spaces from phone number, ensure it's in international format
    const cleanPhone = phoneNumber.replace(/[+\s-]/g, '');
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Callmebot API URL
    const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedMessage}&apikey=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Callmebot API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.text();
    
    // Check if message was sent successfully
    // Callmebot returns different responses, check for success indicators
    if (result.includes('Message queued') || result.includes('sent') || result.includes('OK') || response.ok) {
      console.log(`✅ WhatsApp sent to ${cleanPhone}`);
      return true;
    } else {
      console.error('❌ WhatsApp sending failed:', result);
      return false;
    }
  } catch (error: any) {
    console.error('❌ WhatsApp sending failed:', error.message || error);
    return false;
  }
};

// Notify admin about new booking with payment
export const notifyAdminNewBooking = async (booking: BookingLike, hasPaymentProof: boolean = false): Promise<void> => {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@grilldurbar.com';
  const adminPanelLink = `${process.env.FRONTEND_URL}/admin/dashboard/bookings/${getBookingId(booking)}`;
  const paymentProofLink = getPaymentProofLink(booking.paymentProof);

  // Calculate nights
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const whatsappMessage = `🏨 *NEW BOOKING - Hotel Grill Durbar*

📋 *Booking Details:*
Booking ID: ${booking.bookingId}
Status: ${booking.bookingStatus}
Payment Status: ${booking.paymentStatus}

👤 *Guest Information:*
Name: ${booking.guestName}
Phone: ${booking.phoneNumber}
Email: ${booking.email || 'Not provided'}

📅 *Stay Details:*
Check-in: ${format(checkIn, 'dd MMM yyyy')} at 12:30 PM
Check-out: ${format(checkOut, 'dd MMM yyyy')} at 12:00 PM
Nights: ${nights} night(s)

🛏️ *Room Details:*
Rooms: ${booking.numberOfRooms}
Guests: ${booking.numberOfGuests}

💰 *Payment:*
Total Amount: NPR ${booking.totalAmount.toLocaleString()}
Payment Proof: ${hasPaymentProof ? '✅ Uploaded' : '❌ Not uploaded'}
${hasPaymentProof && booking.paymentProof && !booking.paymentProof.startsWith('data:') ? `Proof Link: ${paymentProofLink}` : ''}

${booking.specialRequests ? `📝 Special Requests:\n${booking.specialRequests}\n` : ''}
🔗 View in Admin Panel:
${adminPanelLink}

⏰ Booking Time: ${format(getCreatedAtDate(booking.createdAt), 'dd MMM yyyy, hh:mm a')}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px; }
        .section-title { font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 10px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-submitted { background: #d1ecf1; color: #0c5460; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏨 New Booking Received</h1>
          <p>Hotel Grill Durbar</p>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">📋 Booking Information</div>
            <div class="info-row">
              <span class="info-label">Booking ID:</span>
              <span class="info-value"><strong>${booking.bookingId}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">
                <span class="status-badge ${booking.bookingStatus === 'Pending' ? 'status-pending' : 'status-submitted'}">
                  ${booking.bookingStatus}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="info-value">${booking.paymentStatus}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Booking Time:</span>
              <span class="info-value">${format(new Date(booking.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">👤 Guest Information</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${booking.guestName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${booking.phoneNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${booking.email || 'Not provided'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📅 Stay Details</div>
            <div class="info-row">
              <span class="info-label">Check-in:</span>
              <span class="info-value">${format(checkIn, 'dd MMM yyyy')} at 12:30 PM</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-out:</span>
              <span class="info-value">${format(checkOut, 'dd MMM yyyy')} at 12:00 PM</span>
            </div>
            <div class="info-row">
              <span class="info-label">Duration:</span>
              <span class="info-value">${nights} night(s)</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">🛏️ Room Details</div>
            <div class="info-row">
              <span class="info-label">Number of Rooms:</span>
              <span class="info-value">${booking.numberOfRooms}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of Guests:</span>
              <span class="info-value">${booking.numberOfGuests}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">💰 Payment Information</div>
            <div class="info-row">
              <span class="info-label">Total Amount:</span>
              <span class="info-value"><strong>NPR ${booking.totalAmount.toLocaleString()}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Proof:</span>
              <span class="info-value">${hasPaymentProof ? '✅ Uploaded' : '❌ Not uploaded'}</span>
            </div>
            ${hasPaymentProof && booking.paymentProof && !booking.paymentProof.startsWith('data:') ? `
            <div class="info-row">
              <span class="info-label">Proof Link:</span>
              <span class="info-value"><a href="${paymentProofLink}" target="_blank">View Payment Proof</a></span>
            </div>
            ` : ''}
          </div>

          ${booking.specialRequests ? `
          <div class="section">
            <div class="section-title">📝 Special Requests</div>
            <p>${booking.specialRequests}</p>
          </div>
          ` : ''}

          <div style="text-align: center;">
            <a href="${adminPanelLink}" class="button">View in Admin Panel</a>
          </div>
        </div>
        <div class="footer">
          <p><strong>Hotel Grill Durbar</strong></p>
          <p>Sauraha, Chitwan, Nepal</p>
          <p>Phone: 056-494295</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send WhatsApp notification
  if (adminNumber) {
    await sendWhatsAppNotification(adminNumber, whatsappMessage);
  }
  
  // Send Email notification
  await sendEmailNotification(adminEmail, 'New Booking Received - Hotel Grill Durbar', emailHtml);
};

// Notify admin about payment submission (when payment uploaded separately)
export const notifyAdminPaymentSubmitted = async (booking: BookingLike): Promise<void> => {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@grilldurbar.com';
  const adminPanelLink = `${process.env.FRONTEND_URL}/admin/dashboard/bookings/${getBookingId(booking)}`;
  const paymentProofLink = getPaymentProofLink(booking.paymentProof);

  const whatsappMessage = `💳 *PAYMENT PROOF UPLOADED*

📋 Booking ID: ${booking.bookingId}
👤 Guest: ${booking.guestName}
📞 Phone: ${booking.phoneNumber}
💰 Amount: NPR ${booking.totalAmount.toLocaleString()}
📄 Payment Proof: ✅ Uploaded

🔗 View Payment Proof:
${paymentProofLink}

🔗 Review in Admin Panel:
${adminPanelLink}

⚠️ Please verify the payment and update booking status.`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .info { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💳 Payment Proof Uploaded</h1>
        </div>
        <div class="content">
          <div class="info">
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Guest Name:</strong> ${booking.guestName}</p>
            <p><strong>Phone:</strong> ${booking.phoneNumber}</p>
            <p><strong>Total Amount:</strong> NPR ${booking.totalAmount.toLocaleString()}</p>
            <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
          </div>
          <p>Payment proof has been uploaded. Please verify the payment and update the booking status.</p>
          <div style="text-align: center;">
            ${booking.paymentProof && !booking.paymentProof.startsWith('data:') ? `<a href="${paymentProofLink}" class="button">View Payment Proof</a>` : ''}
            <a href="${adminPanelLink}" class="button">Review in Admin Panel</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  if (adminNumber) {
    await sendWhatsAppNotification(adminNumber, whatsappMessage);
  }
  
  await sendEmailNotification(adminEmail, 'Payment Proof Uploaded - Hotel Grill Durbar', emailHtml);
};

// Notify guest about booking creation
export const notifyGuestBookingCreated = async (booking: BookingLike): Promise<void> => {
  if (!booking.email) return;

  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
  const bookingLink = `${frontendUrl}/booking/${booking.bookingId}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px; }
        .section-title { font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 10px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #fff3cd; color: #856404; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏨 Booking Received!</h1>
          <p>Hotel Grill Durbar</p>
        </div>
        <div class="content">
          <p>Dear ${booking.guestName},</p>
          <p>Thank you for your booking! We have received your reservation request.</p>

          <div class="section">
            <div class="section-title">📋 Booking Details</div>
            <div class="info-row">
              <span class="info-label">Booking ID:</span>
              <span class="info-value"><strong>${booking.bookingId}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="info-value"><span class="status-badge">${booking.bookingStatus}</span></span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="info-value">${booking.paymentStatus}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📅 Stay Information</div>
            <div class="info-row">
              <span class="info-label">Check-in:</span>
              <span class="info-value">${format(checkIn, 'dd MMM yyyy')} at 12:30 PM</span>
            </div>
            <div class="info-row">
              <span class="info-label">Check-out:</span>
              <span class="info-value">${format(checkOut, 'dd MMM yyyy')} at 12:00 PM</span>
            </div>
            <div class="info-row">
              <span class="info-label">Duration:</span>
              <span class="info-value">${nights} night(s)</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">🛏️ Room Details</div>
            <div class="info-row">
              <span class="info-label">Number of Rooms:</span>
              <span class="info-value">${booking.numberOfRooms}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Number of Guests:</span>
              <span class="info-value">${booking.numberOfGuests}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">💰 Payment Information</div>
            <div class="info-row">
              <span class="info-label">Total Amount:</span>
              <span class="info-value"><strong>NPR ${booking.totalAmount.toLocaleString()}</strong></span>
            </div>
            ${booking.paymentProof ? `
            <div class="info-row">
              <span class="info-label">Payment Proof:</span>
              <span class="info-value">✅ Uploaded</span>
            </div>
            ` : `
            <p style="color: #856404; font-size: 14px; margin-top: 10px;">
              ⚠️ <strong>Important:</strong> Please upload your payment proof to complete the booking process.
            </p>
            `}
          </div>

          ${booking.specialRequests ? `
          <div class="section">
            <div class="section-title">📝 Special Requests</div>
            <p>${booking.specialRequests}</p>
          </div>
          ` : ''}

          <div style="text-align: center;">
            <a href="${bookingLink}" class="button">View Booking Details</a>
          </div>

          <p style="margin-top: 30px; padding: 15px; background: #e7f3ff; border-radius: 5px; border-left: 4px solid #2196F3;">
            <strong>📧 What's Next?</strong><br>
            ${booking.paymentProof 
              ? 'Your payment proof has been received. We will verify it and confirm your booking shortly. You will receive another email once your booking is confirmed.'
              : 'Please upload your payment proof using the link above. Once verified, your booking will be confirmed.'}
          </p>

          <p>If you have any questions, please contact us at:</p>
          <p>
            📞 Phone: 056-494295<br>
            📧 Email: info@grilldurbar.com<br>
            📍 Location: Sauraha, Chitwan, Nepal
          </p>
        </div>
        <div class="footer">
          <p><strong>Hotel Grill Durbar</strong></p>
          <p>We look forward to hosting you!</p>
          <p>© ${new Date().getFullYear()} Hotel Grill Durbar. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmailNotification(
    booking.email,
    'Booking Received - Hotel Grill Durbar',
    emailHtml
  );
};

// Notify guest about booking confirmation (when admin approves)
export const notifyGuestBookingConfirmed = async (booking: BookingLike): Promise<void> => {
  if (!booking.email) return;

  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
  const bookingLink = `${frontendUrl}/booking/${booking.bookingId}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success-badge { display: inline-block; padding: 10px 20px; background: #28a745; color: white; border-radius: 20px; font-size: 16px; font-weight: bold; margin: 20px 0; }
        .section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Booking Confirmed!</h1>
          <p>Hotel Grill Durbar</p>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <span class="success-badge">✓ CONFIRMED</span>
          </div>
          <p>Dear ${booking.guestName},</p>
          <p><strong>Great news! Your booking has been confirmed!</strong></p>

          <div class="section">
            <h3>📋 Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Check-in:</strong> ${format(checkIn, 'dd MMM yyyy')} at 12:30 PM</p>
            <p><strong>Check-out:</strong> ${format(checkOut, 'dd MMM yyyy')} at 12:00 PM</p>
            <p><strong>Duration:</strong> ${nights} night(s)</p>
            <p><strong>Rooms:</strong> ${booking.numberOfRooms}</p>
            <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
            <p><strong>Total Amount:</strong> NPR ${booking.totalAmount.toLocaleString()}</p>
          </div>

          <div style="text-align: center;">
            <a href="${bookingLink}" class="button">View Booking Details</a>
          </div>

          <p style="margin-top: 30px; padding: 15px; background: #d4edda; border-radius: 5px; border-left: 4px solid #28a745;">
            <strong>🎉 We look forward to hosting you!</strong><br>
            If you have any questions or special requests, please don't hesitate to contact us.
          </p>

          <p>
            📞 Phone: 056-494295<br>
            📧 Email: info@grilldurbar.com<br>
            📍 Location: Sauraha, Chitwan, Nepal
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmailNotification(
    booking.email,
    'Booking Confirmed - Hotel Grill Durbar',
    emailHtml
  );
};
