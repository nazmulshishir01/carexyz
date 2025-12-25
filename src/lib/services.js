export const services = [
  {
    id: 'baby-care',
    name: 'Baby Care',
    shortDescription: 'Professional babysitting services for your little ones',
    description: `Our Baby Care service provides professional, loving care for infants and toddlers. Our certified caregivers are trained in child development, safety protocols, and first aid. Whether you need full-time care, part-time assistance, or occasional babysitting, we have the perfect caregiver for your family.

Our baby care services include:
• Feeding and meal preparation
• Diaper changing and hygiene care
• Nap time supervision
• Age-appropriate play and activities
• Light housekeeping related to child care
• Educational activities and early learning stimulation

All our caregivers undergo thorough background checks, reference verification, and continuous training to ensure your child receives the highest quality care in a safe and nurturing environment.`,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
    icon: '👶',
    pricePerHour: 500,
    pricePerDay: 3500,
    features: [
      'Certified caregivers',
      'Background verified',
      'First aid trained',
      'Age-appropriate activities',
      'Meal preparation',
      'Daily reports',
    ],
    availability: '24/7',
    minBookingHours: 4,
    rating: 4.9,
    totalBookings: 2450,
  },
  {
    id: 'elderly-care',
    name: 'Elderly Care',
    shortDescription: 'Compassionate care for senior family members',
    description: `Our Elderly Care service offers compassionate and professional assistance for senior family members. Our trained caregivers provide personalized care that promotes dignity, independence, and quality of life for elderly individuals.

Our elderly care services include:
• Personal hygiene assistance
• Medication reminders
• Mobility assistance
• Meal preparation and feeding
• Companionship and conversation
• Light housekeeping
• Transportation to appointments
• Exercise and physical activity support

We understand that each senior has unique needs, and our caregivers are trained to provide individualized care plans that respect personal preferences and promote overall well-being.`,
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop',
    icon: '👴',
    pricePerHour: 600,
    pricePerDay: 4200,
    features: [
      'Experienced caregivers',
      'Medical training',
      'Compassionate care',
      'Mobility assistance',
      'Medication management',
      'Companionship',
    ],
    availability: '24/7',
    minBookingHours: 4,
    rating: 4.8,
    totalBookings: 1890,
  },
  {
    id: 'sick-care',
    name: 'Sick People Care',
    shortDescription: 'Specialized care for ill or recovering patients',
    description: `Our Sick People Care service provides specialized assistance for individuals recovering from illness, surgery, or managing chronic conditions. Our caregivers are trained to handle various medical situations while providing comfort and support.

Our sick care services include:
• Post-surgery care and monitoring
• Chronic illness management support
• Medication administration
• Vital signs monitoring
• Wound care assistance
• Physical therapy support
• Nutritional meal preparation
• Emotional support and companionship

Our caregivers work closely with healthcare providers to ensure continuity of care and proper recovery protocols are followed. We prioritize patient comfort while maintaining the highest standards of medical care.`,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop',
    icon: '🏥',
    pricePerHour: 700,
    pricePerDay: 5000,
    features: [
      'Medical background',
      'Health monitoring',
      'Medication support',
      'Recovery assistance',
      'Emergency trained',
      'Comfort care',
    ],
    availability: '24/7',
    minBookingHours: 4,
    rating: 4.9,
    totalBookings: 1230,
  },
];

export const getServiceById = (id) => {
  return services.find((service) => service.id === id);
};

export const getAllServices = () => {
  return services;
};
