import { Types } from 'mongoose';

export const ObjectId = (_id: string) => new Types.ObjectId(_id);
export const arrayObjectIdToString = (any: { _id: Types.ObjectId }[]) =>
  any.map((p) => {
    return {
      ...p,
      _id: p._id.toString(),
    };
  });
