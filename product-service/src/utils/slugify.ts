import slugify from 'slugify';

export const getSlug = (string: string) =>
  slugify(string, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'vi',
    trim: true,
  });
