'use client';

import { FiCheckCircle, FiUsers, FiAward, FiHeart } from 'react-icons/fi';

export default function About() {
  const features = [
    {
      icon: FiUsers,
      title: 'Verified Caregivers',
      description: 'All our caregivers undergo thorough background checks and verification.',
    },
    {
      icon: FiAward,
      title: 'Professional Training',
      description: 'Continuous training ensures highest standards of care and safety.',
    },
    {
      icon: FiHeart,
      title: 'Compassionate Care',
      description: 'We treat your loved ones with the same care as our own family.',
    },
  ];

  const highlights = [
    'Background verified caregivers',
    '24/7 customer support',
    'Flexible booking options',
    'Transparent pricing',
    'Regular health monitoring',
    'Emergency response ready',
  ];

  return (
    <section id="about" className="section-padding bg-white/50">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative animate-slide-in-left">
            <div className="relative">
              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop"
                  alt="Baby care service"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Secondary Image */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300&auto=format&fit=crop"
                  alt="Medical care"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Experience Badge */}
              <div className="absolute -top-6 -left-6 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-2xl p-6 shadow-xl">
                <p className="text-4xl font-bold">10+</p>
                <p className="text-sm opacity-90">Years of Experience</p>
              </div>
            </div>

            {/* Decorative Dots */}
            <div className="absolute -z-10 top-1/2 left-0 w-24 h-24 bg-orange-200/50 rounded-full blur-xl" />
          </div>

          {/* Content Side */}
          <div className="space-y-8 animate-slide-in-right">
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-teal-600 rounded-full" />
              <span className="text-sm font-semibold text-teal-700">About Us</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              We Provide the Best
              <span className="gradient-text block">Care Services</span>
              For Your Family
            </h2>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              At Care.xyz, we understand that entrusting the care of your loved ones to
              someone else is a significant decision. That's why we've built a platform
              that prioritizes safety, reliability, and compassion above all else.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to make quality caregiving accessible to every family,
              connecting you with verified professionals who treat your loved ones like
              their own.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow card-hover"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="text-white text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FiCheckCircle className="text-teal-600 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
