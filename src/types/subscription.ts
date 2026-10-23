export interface SubscriptionPlan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  currency: string;
  durationMonths: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  termsVersion?: number;
  vipTerms?: string[];
  updatedAt?: number;
  updatedBy?: number;
}
