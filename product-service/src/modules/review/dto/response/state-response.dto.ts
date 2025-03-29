export interface ReviewDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export interface StatsReviewsResponse {
  average: number;
  total: number;
  distribution: ReviewDistribution[];
}

export interface RatingStat {
  _id: number;
  count: number;
  total: number;
}
