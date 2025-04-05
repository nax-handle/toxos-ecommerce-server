import { PipelineStage } from 'mongoose';
import { FilterBuilder } from './builder.interface';

export class ProductFilterBuilder implements FilterBuilder {
  private match: {
    [key: string]:
      | { $gte?: number; $lte?: number }
      | { $regex?: string; $options?: string };
  } = {};
  private pipeline: PipelineStage[] = [];

  withName(title: string): ProductFilterBuilder {
    if (title) {
      this.match.title = { $regex: title, $options: 'i' };
    }
    return this;
  }

  withPriceGreaterThan(price: number): ProductFilterBuilder {
    if (!isNaN(price)) {
      this.match.price = { ...this.match.price, $gte: price };
    }
    return this;
  }

  withPriceLessThan(price: number): ProductFilterBuilder {
    if (!isNaN(price)) {
      this.match.price = { ...this.match.price, $lte: price };
    }
    return this;
  }

  withRatingGreaterThan(rating: number): ProductFilterBuilder {
    if (!isNaN(rating)) {
      this.match.rating = { $gte: rating };
    }
    return this;
  }

  withSortBySoldCount(): ProductFilterBuilder {
    this.pipeline.push({ $sort: { soldCount: -1 } });
    return this;
  }
  withSortByPrice(sort?: string): ProductFilterBuilder {
    if (sort === 'desc' || sort === 'asc') {
      const by = sort === 'desc' ? -1 : 1;
      this.pipeline.push({ $sort: { price: by } });
    }
    return this;
  }

  withPaginate(page: number, size: number): ProductFilterBuilder {
    this.pipeline.push({ $skip: (page - 1) * size }, { $limit: size });
    return this;
  }

  build(): PipelineStage[] {
    const pipeline = [...this.pipeline];
    if (Object.keys(this.match).length) {
      pipeline.unshift({ $match: this.match });
    }
    return pipeline;
  }
}
