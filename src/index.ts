/// <reference path="../typings/tsd.d.ts" />
import * as _ from 'lodash';

export {default as Plugin} from './plugin';

export function loader(options: {}, before: string): string {
  let loader = require.resolve('./loader');
  options = options ? `?${JSON.stringify(options)}` : '';

  loader = `${loader}${options}`;

  if (before) {
    loader = `${loader}!${before}`;
  }

  return loader;
}
