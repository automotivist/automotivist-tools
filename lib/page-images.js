// lib/page-images.js
// ALL photo IDs verified against images.unsplash.com — confirmed 200 status
// All sourced from Unsplash curated Cars collections (automotive content only)
// Unsplash License: free for commercial use, no attribution required

// Verified car photo IDs — extracted from Unsplash curated car collections
// Every ID below confirmed HTTP 200 and sourced from automotive photo collections
const CAR_IDS = {
  // From "Cars" collection (Forest S, 406 photos) — collection/3373312/cars
  carsForest1: '1597687168547-2640e6a1b6ee',
  carsForest2: '1656051442968-8abb719295f9',
  carsForest3: '1656043595490-b6118e18637f',

  // From "Cars" collection (Adam Hart, 665 photos) — collection/3840400/cars
  carsAdam1:   '1536169470159-76dca77c6db0',
  carsAdam2:   '1508519344352-489cf60571cf',
  carsAdam3:   '1553587470-a60eaa8245c3',

  // Confirmed car photo — car headlight/bumper (leandro fregoni, verified)
  carHeadlight: '1709311584410-8da64b3c1318',
};

// Reliable fallback — from Cars collection, confirmed automotive
export const FALLBACK_ID = CAR_IDS.carsAdam1;

export const IMAGES = {
  // Payment/salary pages — varies by verdict
  paymentHealthy: {
    id: CAR_IDS.carsForest1,
    alt: (payment, salary) => `Car costing ${payment} per month on ${salary} salary — within the 15% affordability rule`,
  },
  paymentBorderline: {
    id: CAR_IDS.carsAdam2,
    alt: (payment, salary) => `${payment} monthly car payment on ${salary} salary — at the edge of affordability`,
  },
  paymentStretched: {
    id: CAR_IDS.carsForest2,
    alt: (payment, salary) => `${payment} car payment on ${salary} salary — above the 15% ceiling`,
  },
  paymentUnderwater: {
    id: CAR_IDS.carsForest3,
    alt: (payment, salary) => `${payment} per month car payment on ${salary} salary — significantly over budget`,
  },

  // Hub pages
  carPaymentGuide: {
    id: CAR_IDS.carsAdam3,
    alt: 'The 15% car payment rule — financial planning and car affordability by salary',
  },
  trueCostGuide: {
    id: CAR_IDS.carHeadlight,
    alt: 'True cost of car ownership — the hidden costs beyond the monthly payment',
  },
  refiGuide: {
    id: CAR_IDS.carsForest1,
    alt: 'Car loan refinancing — how to lower your interest rate and monthly payment',
  },

  // Affordability pages
  afford: {
    id: CAR_IDS.carsAdam1,
    alt: (salary) => `How much car can I afford on a ${salary} salary — car affordability calculator`,
  },

  // Refinance pages
  refinance: {
    id: CAR_IDS.carsAdam2,
    alt: (oldRate, newRate) => `Refinancing car loan from ${oldRate}% to ${newRate}% APR — monthly savings calculator`,
  },

  // Vehicle pages — all from car collections
  vehicleTruck: {
    id: CAR_IDS.carsAdam3,
    alt: (year, make, model) => `${year} ${make} ${model} true monthly cost of ownership — payment, insurance, fuel, maintenance`,
  },
  vehicleSuv: {
    id: CAR_IDS.carsForest2,
    alt: (year, make, model) => `${year} ${make} ${model} real cost per month — full ownership cost breakdown`,
  },
  vehicleSedan: {
    id: CAR_IDS.carsForest1,
    alt: (year, make, model) => `${year} ${make} ${model} monthly ownership cost — what it really costs to own`,
  },
  vehicleEv: {
    id: CAR_IDS.carsAdam1,
    alt: (year, make, model) => `${year} ${make} ${model} true cost of ownership — EV total monthly cost`,
  },
  vehicleLuxury: {
    id: CAR_IDS.carHeadlight,
    alt: (year, make, model) => `${year} ${make} ${model} true monthly cost — luxury car ownership cost breakdown`,
  },
  vehicleSports: {
    id: CAR_IDS.carsForest3,
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
    truck:   IMAGES.vehicleTruck,
    suv:     IMAGES.vehicleSuv,
    sedan:   IMAGES.vehicleSedan,
    ev:      IMAGES.vehicleEv,
    luxury:  IMAGES.vehicleLuxury,
    sports:  IMAGES.vehicleSports,
  };
  return map[type] || IMAGES.vehicleSedan;
}

export function getPaymentImage(angle) {
  const map = {
    healthy:    IMAGES.paymentHealthy,
    borderline: IMAGES.paymentBorderline,
    stretched:  IMAGES.paymentStretched,
    underwater: IMAGES.paymentUnderwater,
  };
  return map[angle] || IMAGES.paymentBorderline;
}
