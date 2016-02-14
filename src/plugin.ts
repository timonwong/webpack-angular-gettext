import * as fs from 'fs';
import * as _ from 'lodash';
import {Plugin, Compiler, Compilation} from 'webpack';
import Registry from './registry';
import GettextLoaderContext from './context';

interface PluginOptions {
  /**
   * The name of the output file
   */
  fileName?: string;
}

export class AngularGettextPlugin implements Plugin {
  private options: PluginOptions;
  private compiler: Compiler;
  private compilation: Compilation;
  private registry = new Registry();

  constructor (options: PluginOptions) {
    this.options = _.extend({fileName: 'translations.pot'}, options);
  }

  /**
   * Entry function from webpack that registers the plugin in the required-build-phases
   * @param compiler
   */
  apply(compiler: Compiler): void {
    this.compiler = compiler;

    compiler.plugin('compilation', (compilation: Compilation) => {
      this.compilation = compilation;
      /**
       * Register the plugin to the normal-module-loader and expose the addGettextStrings function in the loaderContext.
       * This way the loader can communicate with the plugin.
       */
      compilation.plugin('normal-module-loader', (loaderContext: GettextLoaderContext) => {
        loaderContext.addGettextStrings = this.addGettextStrings.bind(this);
        loaderContext.pruneGettextStrings = this.registry.pruneGetTextStrings.bind(this.registry);
      });
    });

    compiler.plugin('emit', this.emitResult.bind(this));
  }

  addGettextStrings(strings: angularGettextTools.Strings): void {
    this.registry.addGetTextStrings(strings);
  }

  emitResult(compilation: Compilation, callback: () => void): void {
    let content = this.registry.toString();
    content = `#, fuzzy\n${content}`;
    fs.writeFile(this.options.fileName, content, {encoding: 'utf-8'}, (error) => {
      callback();
    });
  };
}

export default AngularGettextPlugin;
