import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

// Admin emails - add your admin emails here
const adminEmails = ['nazmulshishir28@gmail.com', 'admin@care.xyz'];

// Email Transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
};

// Status Update Email Template
const generateStatusEmailTemplate = (booking, newStatus) => {
  const statusColors = {
    Pending: { bg: '#fef3c7', text: '#d97706' },
    Confirmed: { bg: '#d1fae5', text: '#059669' },
    Completed: { bg: '#dbeafe', text: '#2563eb' },
    Cancelled: { bg: '#fee2e2', text: '#dc2626' },
  };

  const color = statusColors[newStatus] || statusColors.Pending;
  const statusMessages = {
    Confirmed: 'Our caregiver will arrive at your location as scheduled.',
    Completed: 'Thank you for using Care.xyz! We hope you had a great experience.',
    Cancelled: 'Your booking has been cancelled. If you have any questions, please contact us.',
    Pending: 'Your booking is being processed. We will update you soon.',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Status Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 30px 40px; text-align: center;">
                  <img src="https://i.ibb.co/W4sLvN4p/logo.png" alt="Care.xyz" width="50" height="50" style="border-radius: 12px; background: white; padding: 5px;">
                  <h1 style="color: #ffffff; margin: 15px 0 0 0; font-size: 24px;">
                    Care<span style="color: #fb923c;">.xyz</span>
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; text-align: center;">Booking Status Updated</h2>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; background-color: ${color.bg}; color: ${color.text}; padding: 12px 30px; border-radius: 30px; font-size: 18px; font-weight: 600;">
                      ${newStatus}
                    </span>
                  </div>

                  <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                    <table width="100%">
                      <tr>
                        <td style="color: #6b7280; padding: 8px 0;">Service:</td>
                        <td style="color: #1f2937; font-weight: 600; text-align: right;">${booking.serviceName || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 8px 0;">Duration:</td>
                        <td style="color: #1f2937; text-align: right;">${booking.duration || 1} ${booking.durationType || 'days'}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; padding: 8px 0;">Amount:</td>
                        <td style="color: #0d9488; font-weight: 600; text-align: right;">৳${(booking.totalCost || 0).toLocaleString()}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="color: #6b7280; text-align: center; margin: 20px 0 0 0;">
                    ${statusMessages[newStatus] || ''}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Care.xyz. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// GET - Fetch all bookings (Admin only)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const bookingsCollection = await getCollection('bookings');
    const bookings = await bookingsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      _id: booking._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
    });

  } catch (error) {
    console.error('Admin Bookings Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// PATCH - Update booking status (Admin only)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { bookingId, status } = await request.json();

    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const bookingsCollection = await getCollection('bookings');

    // Update booking
    const result = await bookingsCollection.findOneAndUpdate(
      { _id: new ObjectId(bookingId) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Send status update email
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from: `"Care.xyz" <${process.env.EMAIL_SERVER_USER}>`,
        to: result.userEmail,
        subject: `Booking ${status} - ${result.serviceName} | Care.xyz`,
        html: generateStatusEmailTemplate(result, status),
      });
    } catch (emailError) {
      console.error('Email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: {
        ...result,
        _id: result._id.toString(),
      },
    });

  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
