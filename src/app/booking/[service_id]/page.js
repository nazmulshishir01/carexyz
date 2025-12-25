'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiClock, FiMapPin, FiDollarSign, FiCheck, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { services } from '@/lib/services';
import { divisions, getDistricts, getCities, getAreas } from '@/lib/locations';

export default function BookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const serviceId = params.service_id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form data
  const [durationType, setDurationType] = useState('hours');
  const [duration, setDuration] = useState(1);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [address, setAddress] = useState('');

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/booking/${serviceId}`);
    }
  }, [status, router, serviceId]);

  useEffect(() => {
    const foundService = services.find(s => s.id === serviceId);
    if (foundService) {
      setService(foundService);
    }
    setLoading(false);
  }, [serviceId]);

  // Handle Division change
  useEffect(() => {
    if (selectedDivision) {
      const divisionDistricts = getDistricts(selectedDivision);
      setDistricts(divisionDistricts);
      setSelectedDistrict('');
      setSelectedCity('');
      setSelectedArea('');
      setCities([]);
      setAreas([]);
    }
  }, [selectedDivision]);

  // Handle District change
  useEffect(() => {
    if (selectedDistrict) {
      const districtCities = getCities(selectedDivision, selectedDistrict);
      setCities(districtCities);
      setSelectedCity('');
      setSelectedArea('');
      setAreas([]);
    }
  }, [selectedDistrict, selectedDivision]);

  // Handle City change
  useEffect(() => {
    if (selectedCity) {
      const cityAreas = getAreas(selectedDivision, selectedDistrict, selectedCity);
      setAreas(cityAreas);
      setSelectedArea('');
    }
  }, [selectedCity, selectedDivision, selectedDistrict]);

  const calculateTotalCost = () => {
    if (!service) return 0;
    const rate = service.pricePerHour;
    if (durationType === 'hours') {
      return rate * duration;
    } else {
      return rate * duration * 8; // 8 hours per day
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDivision || !selectedDistrict || !selectedCity || !selectedArea || !address) {
      toast.error('Please fill in all location fields');
      return;
    }

    setSubmitting(true);

    const bookingData = {
      serviceId: service.id,
      serviceName: service.name,
      durationType,
      duration,
      location: {
        division: selectedDivision,
        district: selectedDistrict,
        city: selectedCity,
        area: selectedArea,
        address
      },
      totalCost: calculateTotalCost(),
      status: 'Pending',
      userId: session.user.id || session.user.email,
      userEmail: session.user.email,
      userName: session.user.name
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        // Send email invoice
        try {
          await fetch('/api/send-invoice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: session.user.email,
              booking: { ...bookingData, _id: data.bookingId }
            })
          });
        } catch (emailError) {
          console.log('Email sending failed:', emailError);
        }

        toast.success('Booking created successfully!');
        router.push('/my-bookings');
      } else {
        toast.error(data.error || 'Failed to create booking');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  const totalCost = calculateTotalCost();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container-custom max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href={`/service/${serviceId}`}
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 transition-colors"
        >
          <FiArrowLeft />
          Back to Service
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Book <span className="gradient-text">{service.name}</span>
          </h1>
          <p className="text-gray-600">Complete the form below to book this service</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= step 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step ? <FiCheck /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Step 1: Duration */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <FiClock className="text-2xl text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Select Duration</h2>
                    <p className="text-gray-500 text-sm">How long do you need the service?</p>
                  </div>
                </div>

                {/* Duration Type */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">Duration Type</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setDurationType('hours')}
                      className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all ${
                        durationType === 'hours'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">Hourly</div>
                      <div className="text-sm text-gray-500">৳{service.pricePerHour}/hour</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationType('days')}
                      className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all ${
                        durationType === 'days'
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">Daily</div>
                      <div className="text-sm text-gray-500">৳{service.pricePerDay}/day (8hrs)</div>
                    </button>
                  </div>
                </div>

                {/* Duration Amount */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">
                    Number of {durationType === 'hours' ? 'Hours' : 'Days'}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setDuration(Math.max(1, duration - 1))}
                      className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-semibold transition-colors"
                    >
                      -
                    </button>
                    <div className="w-24 text-center">
                      <span className="text-3xl font-bold text-gray-800">{duration}</span>
                      <span className="text-gray-500 ml-2">{durationType === 'hours' ? 'hr(s)' : 'day(s)'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDuration(duration + 1)}
                      className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl font-semibold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Cost Preview */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="text-2xl font-bold gradient-text">৳{totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn-primary"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FiMapPin className="text-2xl text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Select Location</h2>
                    <p className="text-gray-500 text-sm">Where do you need the service?</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Division */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Division</label>
                    <select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select Division</option>
                      {divisions.map((division) => (
                        <option key={division} value={division}>{division}</option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">District</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="input-field"
                      disabled={!selectedDivision}
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="input-field"
                      disabled={!selectedDistrict}
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Area */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Area</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="input-field"
                      disabled={!selectedCity}
                      required
                    >
                      <option value="">Select Area</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  {/* Detailed Address */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Detailed Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House No, Road No, Landmark..."
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border-2 border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedDivision && selectedDistrict && selectedCity && selectedArea && address) {
                        setCurrentStep(3);
                      } else {
                        toast.error('Please fill in all location fields');
                      }
                    }}
                    className="btn-primary"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FiDollarSign className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Confirm Booking</h2>
                    <p className="text-gray-500 text-sm">Review your booking details</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold text-gray-800">{service.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-semibold text-gray-800">
                        {duration} {durationType === 'hours' ? 'Hour(s)' : 'Day(s)'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Rate</span>
                      <span className="font-semibold text-gray-800">
                        ৳{service.pricePerHour}/{durationType === 'hours' ? 'hr' : 'day'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Location</span>
                      <span className="font-semibold text-gray-800 text-right">
                        {selectedArea}, {selectedCity}, {selectedDistrict}, {selectedDivision}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-600">Address</span>
                      <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                        {address}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-gray-800">Total Cost</span>
                      <span className="text-2xl font-bold gradient-text">৳{totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> Your booking will be set to "Pending" status. Our team will confirm your booking within 24 hours. An email invoice will be sent to <strong>{session.user.email}</strong>.
                  </p>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border-2 border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
