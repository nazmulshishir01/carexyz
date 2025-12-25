import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch user bookings
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingsCollection = await getCollection('bookings');
    const bookings = await bookingsCollection
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingData = await request.json();

    // Validation - check for location object or individual fields
    const hasLocation = bookingData.location && 
      bookingData.location.division && 
      bookingData.location.district && 
      bookingData.location.city && 
      bookingData.location.address;

    const hasDirectFields = bookingData.division && 
      bookingData.district && 
      bookingData.city && 
      bookingData.address;

    if (
      !bookingData.serviceId ||
      !bookingData.serviceName ||
      !bookingData.duration ||
      !bookingData.durationType ||
      (!hasLocation && !hasDirectFields) ||
      !bookingData.totalCost
    ) {
      return NextResponse.json(
        { error: 'All booking fields are required' },
        { status: 400 }
      );
    }

    const bookingsCollection = await getCollection('bookings');

    const booking = {
      ...bookingData,
      userId: session.user.id || session.user.email,
      userEmail: session.user.email,
      userName: session.user.name,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(booking);

    return NextResponse.json(
      {
        message: 'Booking created successfully',
        bookingId: result.insertedId,
        booking: { ...booking, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Booking ID and status are required' },
        { status: 400 }
      );
    }

    const bookingsCollection = await getCollection('bookings');

    // Verify the booking belongs to the user
    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(bookingId),
      userEmail: session.user.email,
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking
    await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const bookingsCollection = await getCollection('bookings');

    // Verify the booking belongs to the user
    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(bookingId),
      userEmail: session.user.email,
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update status to Cancelled instead of deleting
    await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status: 'Cancelled', updatedAt: new Date() } }
    );

    return NextResponse.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
