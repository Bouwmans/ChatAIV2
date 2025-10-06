export const cn = (...values: Array<string | boolean | undefined | null>) =>
  values.filter(Boolean).join(' ');
