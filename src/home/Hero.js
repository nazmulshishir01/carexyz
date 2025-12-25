'use client';

import Link from 'next/link';
import { FiArrowRight, FiPlay, FiShield, FiHeart, FiClock } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                Trusted by 10,000+ Families
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-800">Caring for</span>
              <br />
              <span className="gradient-text">Your Loved Ones</span>
              <br />
              <span className="text-gray-800">Like Family</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Professional caregivers for babies, elderly, and those who need special care.
              Experience peace of mind with our trusted, verified, and compassionate care
              services available 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/service/baby-care" className="btn-primary group">
                Book a Caregiver
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="flex items-center gap-3 px-6 py-3 rounded-full border-2 border-teal-600 text-teal-700 font-semibold hover:bg-teal-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <FiPlay className="text-teal-700 ml-1" />
                </div>
                Watch How It Works
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                  <FiShield className="text-teal-700 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Verified</p>
                  <p className="text-sm text-gray-500">Background Checked</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <FiHeart className="text-orange-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Caring</p>
                  <p className="text-sm text-gray-500">Compassionate Staff</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiClock className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">24/7</p>
                  <p className="text-sm text-gray-500">Always Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side will be added in next commit */}
          <div />
        </div>
      </div>
    </section>
  );
}
