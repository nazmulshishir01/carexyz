'use client';

import Link from 'next/link';
import { FiArrowRight, FiStar, FiClock } from 'react-icons/fi';
import { services } from '@/lib/services';

export default function Services() {
  return (
    <section id="services" className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-teal-600 rounded-full" />
            <span className="text-sm font-semibold text-teal-700">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Comprehensive <span className="gradient-text">Care Services</span>
            <br />
            For Every Need
          </h2>
          <p className="text-gray-600">
            From infant care to elderly assistance, we provide professional caregiving
            services tailored to your family's unique requirements.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group bg-white rounded-3xl overflow-hidden shadow-lg card-hover animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">{service.icon}</span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <FiStar className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold">{service.rating}</span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2">
                  <p className="text-xs text-gray-500">Starting from</p>
                  <p className="text-lg font-bold text-teal-700">৳{service.pricePerHour}/hr</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-700 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.shortDescription}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiClock className="text-teal-600" />
                    <span>{service.availability}</span>
                  </div>
                  <Link
                    href={`/service/${service.id}`}
                    className="flex items-center gap-2 text-teal-700 font-semibold hover:gap-3 transition-all"
                  >
                    View Details
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 animate-fade-in-up delay-400">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? We offer customized care solutions.
          </p>
          <Link
            href="/service/baby-care"
            className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:gap-3 transition-all"
          >
            Contact us for custom services
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
