import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from '../../configs/cloudinary.config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config(CloudinaryConfig);
  },
};
