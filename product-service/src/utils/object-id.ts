import { Types } from 'mongoose';

export const ObjectId = (_id: string) => new Types.ObjectId(_id);
