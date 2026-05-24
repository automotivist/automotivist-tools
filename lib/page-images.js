// lib/page-images.js
// Curated Unsplash photo IDs for each page type
// All photos: Unsplash License (free for commercial use, no attribution required)

// Verified working IDs — tested against images.unsplash.com
export const FALLBACK_ID = '1494976388531-d1058494cdd8'; // reliable fallback

export const IMAGES = {
  // Payment/salary pages — varies by verdict
  paymentHealthy: {
    id: '1494976388531-d1058494cdd8',
    alt: (payment, salary) => `Car costing ${payment} per month on ${salary} salary — within the 15% affordability rule`,
  },
  paymentBorderline: {
    id: '1568605114967-8130f3a36994',
    alt: (payment, salary) => `${payment} monthly car payment on ${salary} salary — at the edge of affordability`,
  },
  paymentStretched: {
    id: '1560179707-f14e90ef3623',
    alt: (payment, salary) => `${payment} car payment on ${salary} salary — above the 15% ceiling`,
  },
  paymentUnderwater: {
    id: '1503376780353-7e6692767b70',
    alt: (payment, salary) => `${payment} per month car payment on ${salary} salary — significantly over budget`,
  },

  // Hub pages
  carPaymentGuide: {
    id: '1554224155-6726b3ff858f',
    alt: 'The 15% car payment rule — financial planning and car affordability by salary',
  },
  trueCostGuide: {
    id: '1549317661-bd32c8ce0db2',
    alt: 'True cost of car ownership — dashboard view showing the hidden costs beyond the monthly payment',
  },
  refiGuide: {
    id: '1560179707-f14e90ef3623',
    alt: 'Car loan refinancing — how to lower your interest rate and monthly payment',
  },

  // Affordability pages
  afford: {
    id: '1502877338535-766e1452684a',
    alt: (salary) => `How much car can I afford on a ${salary} salary — car affordability calculator`,
  },

  // Refinance pages
  refinance: {
    id: '1554224155-6726b3ff858f',
    alt: (oldRate, newRate) => `Refinancing car loan from ${oldRate}% to ${newRate}% APR — monthly savings calculator`,
  },

  // Vehicle pages — by type (all verified IDs)
  vehicleTruck: {
    id: '1558618666-fcd25c85cd64',
    alt: (year, make, model) => `${year} ${make} ${model} true monthly cost of ownership — payment, insurance, fuel, maintenance`,
  },
  vehicleSuv: {
    id: '1568605114967-8130f3a36994',
    alt: (year, make, model) => `${year} ${make} ${model} real cost per month — full ownership cost breakdown`,
  },
  vehicleSedan: {
    id: '1494976388531-d1058494cdd8',
    alt: (year, make, model) => `${year} ${make} ${model} monthly ownership cost — what it really costs to own`,
  },
  vehicleEv: {
    id: '1560179707-f14e90ef3623',
    alt: (year, make, model) => `${year} ${make} ${model} true cost of ownership — EV charging, insurance, maintenance costs`,
  },
  vehicleLuxury: {
    id: '1503376780353-7e6692767b70',
    alt: (year, make, model) => `${year} ${make} ${model} true monthly cost — luxury car ownership cost breakdown`,
  },
  vehicleSports: {
    id: '1549317661-bd32c8ce0db2',
    alt: (year, make, model) => `${year} ${make} ${model} monthly ownership cost — sports car true cost of ownership`,
  },
};

export function unsplashUrl(id, width = 1200, height = 630) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
}

export function fallbackUrl(width = 1200, height = 480) {
  return unsplashUrl(FALLBACK_ID, width, height);
}

export function getVehicleImage(type) {
  const map = {
    truck: IMAGES.vehicleTruck,
    suv: IMAGES.vehicleSuv,
    sedan: IMAGES.vehicleSedan,
    ev: IMAGES.vehicleEv,
    luxury: IMAGES.vehicleLuxury,
    sports: IMAGES.vehicleSports,
  };
  return map[type] || IMAGES.vehicleSedan;
}

export function getPaymentImage(angle) {
  const map = {
    healthy: IMAGES.paymentHealthy,
    borderline: IMAGES.paymentBorderline,
    stretched: IMAGES.paymentStretched,
    underwater: IMAGES.paymentUnderwater,
  };
  return map[angle] || IMAGES.paymentBorderline;
}
