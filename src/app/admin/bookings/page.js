'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  FiCalendar, 
  FiUser, 
  FiMapPin, 
  FiClock,
  FiCheck,
  FiX,
  FiLoader,
  FiRefreshCw,
  FiMail,
  FiPhone
} from 'react-icons/fi';

export default function AdminBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('All');

  // Admin emails - add your admin emails here
  const adminEmails = ['nazmulshishir28@gmail.com', 'admin@care.xyz'];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      if (!adminEmails.includes(session?.user?.email)) {
        router.push('/');
      } else {
        fetchAllBookings();
      }
    }
  }, [status, session]);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      setUpdating(bookingId);
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setBookings(bookings.map(b => 
          b._id === bookingId ? { ...b, status: newStatus } : b
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="animate-spin text-5xl text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || !adminEmails.includes(session?.user?.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiX className="text-5xl text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Access Denied. Admin only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage all customer bookings</p>
          </div>
          <button
            onClick={fetchAllBookings}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> 
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((stat) => (
            <button
              key={stat}
              onClick={() => setFilter(stat)}
              className={`p-5 rounded-2xl text-center transition-all duration-300 ${
                filter === stat
                  ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-600/30 scale-105'
                  : 'bg-white text-gray-700 hover:shadow-lg hover:scale-102'
              }`}
            >
              <p className="text-3xl font-bold">
                {stat === 'All' 
                  ? bookings.length 
                  : bookings.filter(b => b.status === stat).length
                }
              </p>
              <p className="text-sm mt-1 opacity-80">{stat}</p>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Service</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Location</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr 
                    key={booking._id} 
                    className={`border-b hover:bg-teal-50/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                          {booking.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.userName}</p>
                          <p className="text-sm text-gray-500">{booking.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{booking.serviceName}</p>
                      <p className="text-sm text-gray-500">{booking.duration} {booking.durationType || 'days'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">
                        {booking.location?.area || booking.area || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {booking.location?.city || booking.city || ''}, {booking.location?.district || booking.district || ''}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-teal-600 text-lg">
                        ৳{(booking.totalCost || 0).toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">
                        {formatDate(booking.createdAt)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {updating === booking._id ? (
                        <FiLoader className="animate-spin text-teal-600 text-xl" />
                      ) : (
                        <div className="flex gap-2">
                          {booking.status === 'Pending' && (
                            <button
                              onClick={() => updateStatus(booking._id, 'Confirmed')}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Confirm Booking"
                            >
                              <FiCheck />
                            </button>
                          )}
                          {booking.status === 'Confirmed' && (
                            <button
                              onClick={() => updateStatus(booking._id, 'Completed')}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="Mark as Completed"
                            >
                              <FiCheck />
                            </button>
                          )}
                          {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                            <button
                              onClick={() => updateStatus(booking._id, 'Cancelled')}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Cancel Booking"
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                      {booking.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.userName}</p>
                      <p className="text-xs text-gray-500">{booking.userEmail}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Service</p>
                    <p className="font-medium">{booking.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-bold text-teal-600">৳{(booking.totalCost || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">{booking.duration} {booking.durationType || 'days'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-xs">{formatDate(booking.createdAt)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  {updating === booking._id ? (
                    <FiLoader className="animate-spin text-teal-600" />
                  ) : (
                    <>
                      {booking.status === 'Pending' && (
                        <button
                          onClick={() => updateStatus(booking._id, 'Confirmed')}
                          className="flex-1 py-2 bg-green-100 text-green-600 rounded-lg text-sm font-medium"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={() => updateStatus(booking._id, 'Completed')}
                          className="flex-1 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium"
                        >
                          Complete
                        </button>
                      )}
                      {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                        <button
                          onClick={() => updateStatus(booking._id, 'Cancelled')}
                          className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-16">
              <FiCalendar className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings found</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter !== 'All' ? `No ${filter.toLowerCase()} bookings` : 'Bookings will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
