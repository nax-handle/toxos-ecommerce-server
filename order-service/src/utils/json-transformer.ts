import { ValueTransformer } from 'typeorm';

export const jsonTransformer: ValueTransformer = {
  to: (value: any) => (value ? JSON.stringify(value) : null),
  from: (value: string) => (value ? JSON.parse(value) : null),
};
