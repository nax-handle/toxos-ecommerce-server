export interface ICache {
  getOrSet<T>(
    key: string,
    fetchData: () => Promise<T>,
    ttl: number,
  ): Promise<T>;
  deleteCache(key: string): Promise<void>;
}
