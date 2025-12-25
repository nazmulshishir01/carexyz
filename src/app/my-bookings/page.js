'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiDollarSign, 
  FiEye, 
  FiX, 
  FiLoader,
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi';

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/my-bookings');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchBookings();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?email=${session.user.email}`);
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setCancelling(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId,
          status: 'Cancelled'
        })
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        setBookings(bookings.map(b => 
          b._id === bookingId ? { ...b, status: 'Cancelled' } : b
        ));
        setShowModal(false);
        setSelectedBooking(null);
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'badge-pending',
      'Confirmed': 'badge-confirmed',
      'Completed': 'badge-completed',
      'Cancelled': 'badge-cancelled'
    };
    return badges[status] || 'badge-pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container-custom max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            My <span className="gradient-text">Bookings</span>
          </h1>
          <p className="text-gray-600">Track and manage all your service bookings</p>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-teal-600">{bookings.length}</div>
            <div className="text-gray-500 text-sm">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-yellow-500">
              {bookings.filter(b => b.status === 'Pending').length}
            </div>
            <div className="text-gray-500 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-green-500">
              {bookings.filter(b => b.status === 'Confirmed').length}
            </div>
            <div className="text-gray-500 text-sm">Confirmed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="text-2xl font-bold text-blue-500">
              {bookings.filter(b => b.status === 'Completed').length}
            </div>
            <div className="text-gray-500 text-sm">Completed</div>
          </div>
        </div>

        
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Bookings Yet</h2>
            <p className="text-gray-500 mb-6">You haven't made any bookings. Start by exploring our services!</p>
            <Link href="/#services" className="btn-primary inline-flex">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{booking.serviceName}</h3>
                        <span className={getStatusBadge(booking.status)}>{booking.status}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiClock className="text-teal-500" />
                          <span>{booking.duration} {booking.durationType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiMapPin className="text-orange-500" />
                          <span>{booking.location?.area}, {booking.location?.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiDollarSign className="text-green-500" />
                          <span className="font-semibold">৳{booking.totalCost?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiCalendar className="text-blue-500" />
                          <span>{formatDate(booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowModal(true);
                        }}
                        className="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-2"
                      >
                        <FiEye />
                        View
                      </button>
                      {booking.status === 'Pending' && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                          <FiX />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        
        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedBooking(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-mono text-sm">{selectedBooking._id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Service</span>
                    <span className="font-semibold">{selectedBooking.serviceName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Status</span>
                    <span className={getStatusBadge(selectedBooking.status)}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">
                      {selectedBooking.duration} {selectedBooking.durationType}
                    </span>
                  </div>
                  
                  <div className="pb-4 border-b">
                    <span className="text-gray-600 block mb-2">Location</span>
                    <div className="text-right">
                      <div className="font-semibold">{selectedBooking.location?.address}</div>
                      <div className="text-sm text-gray-500">
                        {selectedBooking.location?.area}, {selectedBooking.location?.city}, {selectedBooking.location?.district}, {selectedBooking.location?.division}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">Booked On</span>
                    <span>{formatDate(selectedBooking.createdAt)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold">Total Cost</span>
                    <span className="text-2xl font-bold gradient-text">
                      ৳{selectedBooking.totalCost?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedBooking.status === 'Pending' && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <FiAlertCircle className="text-yellow-500 text-xl flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-800 font-medium">Cancel Booking?</p>
                          <p className="text-yellow-700 text-sm mt-1">
                            This action cannot be undone. Are you sure you want to cancel this booking?
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelBooking(selectedBooking._id)}
                      disabled={cancelling}
                      className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {cancelling ? (
                        <>
                          <FiLoader className="animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <FiX />
                          Cancel Booking
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
