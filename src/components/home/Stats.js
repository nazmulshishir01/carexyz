'use client';

import { useEffect, useState, useRef } from 'react';
import { FiUsers, FiHeart, FiStar, FiMapPin } from 'react-icons/fi';

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      icon: FiUsers,
      value: 10000,
      suffix: '+',
      label: 'Happy Families',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: FiHeart,
      value: 5000,
      suffix: '+',
      label: 'Verified Caregivers',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: FiStar,
      value: 4.9,
      suffix: '/5',
      label: 'Average Rating',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: FiMapPin,
      value: 64,
      suffix: '',
      label: 'Districts Covered',
      color: 'from-blue-500 to-blue-600',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-teal-800 via-teal-900 to-teal-800 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-700/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMCAtMiAwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-50" />

      <div className="container-custom relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="text-white text-2xl" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                  decimals={stat.value < 10 ? 1 : 0}
                />
              </div>
              <p className="text-teal-200 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({ end, suffix, isVisible, decimals = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, end]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  );
}
