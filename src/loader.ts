import * as path from 'path';
import * as loaderUtils from 'loader-utils';
import * as _ from 'lodash';
import {Extractor} from 'angular-gettext-tools';
import {GettextLoaderContext} from './context';

function extractLoader(source: string, sourceMaps: any): void {
  const loader: GettextLoaderContext = this;

  if (!loader.addGettextStrings) {
    return this.callback(new Error("The WebpackAngularGettext plugin is missing, Add the plugin to your webpack configurations 'plugins' selection."), source, sourceMaps);
  }

  if (loader.cacheable) {
    loader.cacheable();
  }

  extractTranslations.call(this, loader, source, sourceMaps);
}

function findRoot(context: string, entries: string | string[]): string {
  if (_.isString(entries)) {
    return path.dirname(path.join(context, entries));
  } else {
    return _.reduce(entries, (memo, entry) => {
      if (!_.isString(entry)) {
        return memo;
      }
      const dir = path.dirname(path.join(context, entry));

      if (memo) {
        const memoTokens = memo.split(path.sep);
        const dirTokens = dir.split(path.sep);
        const result: string[] = [];

        // find the minimum matching route
        for (let i = 0; i < memo.length; i++) {
          if (memoTokens[i] === dirTokens[i]) {
            result.push(memoTokens[i]);
          } else {
            return result.join(path.sep);
          }
        }
      } else {
        return dir;
      }
    }, '');
  }
}

function extractTranslations(loader: GettextLoaderContext, source: string, sourceMaps: any): void {
  const options = loaderUtils.parseQuery(this.query);

  const extractor = new Extractor(options);

  const root = findRoot(this.options.context, this.options.entry);
  const filename = path.relative(root, this.resourcePath);

  extractor.parse(filename, source);

  loader.addGettextStrings(_.clone(extractor.strings));
  loader.callback(null, source, sourceMaps);
}

export = extractLoader;
