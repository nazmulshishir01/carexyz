import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServiceById, services } from '@/lib/services';
import {
  FiStar,
  FiClock,
  FiCheck,
  FiCalendar,
  FiArrowLeft,
  FiShield,
} from 'react-icons/fi';

// Generate static params for all services
export async function generateStaticParams() {
  return services.map((service) => ({
    service_id: service.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { service_id } = await params;
  const service = getServiceById(service_id);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.name} - Professional Care Services`,
    description: service.shortDescription,
    openGraph: {
      title: `${service.name} | Care.xyz`,
      description: service.shortDescription,
      images: [{ url: service.image }],
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { service_id } = await params;
  const service = getServiceById(service_id);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-700 transition-colors"
          >
            <FiArrowLeft />
            Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="animate-slide-in-left">
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Rating Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                <FiStar className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{service.rating}</span>
                <span className="text-gray-500">({service.totalBookings}+ bookings)</span>
              </div>

              {/* Service Icon */}
              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl">{service.icon}</span>
                  </div>
                  <div className="text-white">
                    <p className="text-sm opacity-80">Starting from</p>
                    <p className="text-2xl font-bold">৳{service.pricePerHour}/hr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid - Mobile Only */}
            <div className="lg:hidden mt-8 grid grid-cols-2 gap-4">
              {service.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiCheck className="text-teal-700" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="animate-slide-in-right">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {service.availability}
                </span>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Min {service.minBookingHours} hours
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {service.name}
              </h1>
              <p className="text-lg text-gray-600">{service.shortDescription}</p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About This Service</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {service.description}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl shadow-xl p-6 mb-8 text-white">
              <h2 className="text-xl font-bold mb-4">Pricing Options</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <FiClock className="text-2xl mb-2 text-teal-200" />
                  <p className="text-sm text-teal-100">Per Hour</p>
                  <p className="text-2xl font-bold">৳{service.pricePerHour}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <FiCalendar className="text-2xl mb-2 text-teal-200" />
                  <p className="text-sm text-teal-100">Per Day (8hrs)</p>
                  <p className="text-2xl font-bold">৳{service.pricePerDay}</p>
                </div>
              </div>
            </div>

            {/* Features Grid - Desktop Only */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">What's Included</h2>
              <div className="grid grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3 card-hover"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiCheck className="text-teal-700" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 mb-8 bg-green-50 rounded-xl p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiShield className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="font-semibold text-green-800">100% Verified Caregivers</p>
                <p className="text-sm text-green-600">
                  All caregivers undergo thorough background checks
                </p>
              </div>
            </div>

            {/* Book Now Button */}
            <Link
              href={`/booking/${service.id}`}
              className="btn-primary w-full justify-center text-lg py-4"
            >
              Book This Service
              <FiCalendar />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
