import reset from '@scripts/methods/reset';
import replaceProperties from '@scripts/utils/replaceProperties';
import type { Calendar, Options, Reset } from '@src/index';

const set = (self: Calendar, options: Options, resetOptions?: Partial<Reset>) => {
  const defaultReset = { year: true, month: true, dates: true, time: true, locale: true };
  replaceProperties(self, options);
  reset(self, { ...defaultReset, ...resetOptions });
};

export default set;
