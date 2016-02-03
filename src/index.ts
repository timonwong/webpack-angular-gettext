/// <reference path="../typings/tsd.d.ts" />

export {default as Plugin} from './plugin';

export function Loader(before: string, options: any): string {
  const loader = require.resolve('./loader');
  options = options ? `?${JSON.stringify(options)}` : '';
  if (before) {
    return `${loader}!${before}${options}`;
  }
  return loader + options;
}
