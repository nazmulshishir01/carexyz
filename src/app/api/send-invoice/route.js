import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import nodemailer from 'nodemailer';

// Date Formatting Function
const formatDate = (date) => {
  if (!date) {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { booking } = await request.json();

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking data is required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Format date properly
    const bookingDate = formatDate(booking.createdAt);
    const invoiceId = booking._id ? booking._id.toString().slice(-12) : Date.now().toString().slice(-12);

    // Create email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Invoice - Care.xyz</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0fdfa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d9488, #0f766e); border-radius: 16px 16px 0 0; padding: 30px;">
          <tr>
            <td align="center">
              <img src="https://i.ibb.co/W4sLvN4p/logo.png" alt="Care.xyz" width="60" height="60" style="border-radius: 12px; background: white; padding: 5px;">
              <h1 style="color: white; margin: 15px 0 0 0; font-size: 28px;">Care<span style="color: #fb923c;">.xyz</span></h1>
              <p style="color: #ccfbf1; margin: 10px 0 0 0;">Trusted Care Services</p>
            </td>
          </tr>
        </table>
        
        <!-- Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td>
              <!-- Invoice Header -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td>
                    <h2 style="color: #0d9488; margin: 0 0 10px 0;">Booking Confirmation</h2>
                    <p style="color: #6b7280; margin: 0;">Invoice #${invoiceId}</p>
                    <p style="color: #6b7280; margin: 5px 0 0 0;">Date: ${bookingDate}</p>
                  </td>
                  <td align="right">
                    <span style="background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">${booking.status}</span>
                  </td>
                </tr>
              </table>

              <!-- Customer Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f0fdfa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <p style="color: #0f766e; font-weight: 600; margin: 0 0 10px 0;">Customer Details</p>
                    <p style="color: #374151; margin: 0;">Name: ${booking.userName}</p>
                    <p style="color: #374151; margin: 5px 0 0 0;">Email: ${booking.userEmail}</p>
                  </td>
                </tr>
              </table>

              <!-- Service Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                <tr style="background: #f9fafb;">
                  <td style="padding: 15px; font-weight: 600; color: #374151;">Service</td>
                  <td style="padding: 15px; font-weight: 600; color: #374151;">Duration</td>
                  <td style="padding: 15px; font-weight: 600; color: #374151;" align="right">Amount</td>
                </tr>
                <tr>
                  <td style="padding: 15px; color: #374151;">${booking.serviceName}</td>
                  <td style="padding: 15px; color: #374151;">${booking.duration} ${booking.durationType}</td>
                  <td style="padding: 15px; color: #374151;" align="right">৳${booking.totalCost.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Location -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f0fdfa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <p style="color: #0f766e; font-weight: 600; margin: 0 0 10px 0;">Service Location</p>
                    <p style="color: #374151; margin: 0;">${booking.location?.address || booking.address}</p>
                    <p style="color: #6b7280; margin: 5px 0 0 0;">${booking.location?.city || booking.city}, ${booking.location?.district || booking.district}, ${booking.location?.division || booking.division}</p>
                  </td>
                </tr>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d9488, #0f766e); border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <p style="color: #ccfbf1; margin: 0;">Total Amount</p>
                  </td>
                  <td align="right">
                    <p style="color: white; font-size: 24px; font-weight: 700; margin: 0;">৳${booking.totalCost.toLocaleString()}</p>
                  </td>
                </tr>
              </table>

              <!-- Footer Note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">Thank you for choosing Care.xyz!</p>
                    <p style="color: #6b7280; font-size: 14px; margin: 10px 0 0 0;">Our team will contact you shortly to confirm your booking.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
          <tr>
            <td align="center">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Care.xyz. All rights reserved.</p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">Dhaka, Bangladesh | support@care.xyz</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Care.xyz" <${process.env.EMAIL_SERVER_USER}>`,
      to: session.user.email,
      subject: `Booking Confirmation - ${booking.serviceName} | Care.xyz`,
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice. Please check email configuration.' },
      { status: 500 }
    );
  }
}
