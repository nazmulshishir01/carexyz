'use client';

import { FiStar } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Reviews data from Zapshift Resources
const reviews = [
  {
    "id": "5f47ac10b4f1c03e8c123456",
    "userName": "John Doe",
    "ratings": 4.5,
    "review": "Smooth delivery and polite staff. The caregiver was very professional and took excellent care of my elderly mother.",
    "user_photoURL": "https://randomuser.me/api/portraits/men/10.jpg",
    "date": "2024-05-08T14:30:00.000Z"
  },
  {
    "id": "5f47ac10b4f1c03e8c234567",
    "userName": "Jane Smith",
    "ratings": 3.8,
    "review": "Took a bit longer than expected, but okay overall. The service quality was good and the caregiver was friendly.",
    "user_photoURL": "https://randomuser.me/api/portraits/women/25.jpg",
    "date": "2024-06-10T10:15:00.000Z"
  },
  {
    "id": "5f47ac10b4f1c03e8c345678",
    "userName": "Alex Brown",
    "ratings": 5.0,
    "review": "Excellent service! Fast and secure. The baby caregiver was amazing with my kids. Highly recommend Care.xyz!",
    "user_photoURL": "https://randomuser.me/api/portraits/men/34.jpg",
    "date": "2024-07-01T08:50:00.000Z"
  },
  {
    "id": "5f47ac10b4f1c03e8c456789",
    "userName": "Lisa White",
    "ratings": 4.2,
    "review": "Very responsive and professional. The elderly care service exceeded our expectations. Great communication!",
    "user_photoURL": "https://randomuser.me/api/portraits/women/12.jpg",
    "date": "2024-07-15T09:10:00.000Z"
  },
  {
    "id": "5f47ac10b4f1c03e8c567890",
    "userName": "David Lee",
    "ratings": 4.0,
    "review": "Good service overall. The caregiver arrived on time and was very helpful with my father's daily needs.",
    "user_photoURL": "https://randomuser.me/api/portraits/men/19.jpg",
    "date": "2024-08-02T16:45:00.000Z"
  },
  {
    "id": "5f47ac10b4f1c03e8c678901",
    "userName": "Nina Khan",
    "ratings": 4.9,
    "review": "Superb experience! Highly recommended. The sick care service was exceptional and the nurse was very caring.",
    "user_photoURL": "https://randomuser.me/api/portraits/women/8.jpg",
    "date": "2024-08-10T12:00:00.000Z"
  },
  {
    "id": "5f47ac10b4f1c03e8c789012",
    "userName": "Michael Jordan",
    "ratings": 4.3,
    "review": "Decent service. The caregiver was attentive and professional. Would use again for elderly care.",
    "user_photoURL": "https://randomuser.me/api/portraits/men/22.jpg",
    "date": "2024-08-14T18:20:00.000Z"
  },
  {
    "id": "5f47ac10b4f1c03e8c890123",
    "userName": "Emma Watson",
    "ratings": 4.7,
    "review": "Fast, safe, and friendly care service. The babysitter was wonderful with my children. Thank you Care.xyz!",
    "user_photoURL": "https://randomuser.me/api/portraits/women/5.jpg",
    "date": "2024-08-20T07:30:00.000Z"
  }
];

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <FiStar key={i} className="text-yellow-400 fill-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <FiStar key={i} className="text-yellow-400 fill-yellow-400 opacity-50" />
      );
    } else {
      stars.push(
        <FiStar key={i} className="text-gray-300" />
      );
    }
  }
  return stars;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function Testimonials() {
  return (
    <section className="section-padding bg-white" id="testimonials">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            What Our <span className="gradient-text">Customers Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what families across Bangladesh 
            are saying about their experience with Care.xyz
          </p>
        </div>

        {/* Testimonials Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-14"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                {/* Quote Icon */}
                <div className="text-6xl text-teal-200 font-serif leading-none mb-4">"</div>
                
                {/* Review Text */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {review.review}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {renderStars(review.ratings)}
                  <span className="ml-2 text-gray-500 text-sm">({review.ratings})</span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <img 
                    src={review.user_photoURL} 
                    alt={review.userName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-teal-200"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.userName}</h4>
                    <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">4.8</div>
            <div className="text-gray-500 text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">10,000+</div>
            <div className="text-gray-500 text-sm">Happy Families</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">500+</div>
            <div className="text-gray-500 text-sm">Verified Caregivers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">8</div>
            <div className="text-gray-500 text-sm">Divisions Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
}
