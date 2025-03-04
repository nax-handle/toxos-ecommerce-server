import slugify from 'slugify';

export const slug = (string: string) => {
  return slugify(string, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'vi',
    trim: true,
  });
};
