import { ServiceInfo } from '../types';
import { calculatePrice } from '../pricing';

export interface LeadScore {
  score: number;
  reasons: string[];
  recommendedService?: ServiceInfo;
  estimatedValue?: number;
}

export function qualifyLead(
  squareFootage: number,
  frequency: string,
  propertyType: 'residential' | 'commercial',
  urgency: 'high' | 'medium' | 'low'
): LeadScore {
  const score: LeadScore = {
    score: 0,
    reasons: [],
  };

  // Basic qualification
  if (squareFootage < 500) {
    score.reasons.push('Space is below minimum requirements');
    return score;
  }

  // Score based on property size
  if (squareFootage > 2000) {
    score.score += 30;
    score.reasons.push('Large property size');
  } else if (squareFootage > 1000) {
    score.score += 20;
    score.reasons.push('Medium property size');
  } else {
    score.score += 10;
    score.reasons.push('Standard property size');
  }

  // Score based on frequency
  if (frequency === 'weekly') {
    score.score += 30;
    score.reasons.push('Weekly service commitment');
  } else if (frequency === 'bi-weekly') {
    score.score += 20;
    score.reasons.push('Bi-weekly service commitment');
  }

  // Score based on urgency
  if (urgency === 'high') {
    score.score += 20;
    score.reasons.push('High urgency request');
  }

  // Recommend service
  const recommendedService = services.find(s => 
    propertyType === 'commercial' ? s.id === 'commercial' : s.id === 'residential'
  );

  if (recommendedService) {
    score.recommendedService = recommendedService;
    score.estimatedValue = calculatePrice(recommendedService, squareFootage, frequency);
  }

  return score;
}