declare var loaderUtils: loaderUtils.ILoaderUtils;

declare module loaderUtils {
  interface ILoaderUtils {
    parseQuery(query: any): string;
  }
}

declare module 'loader-utils' {
  export = loaderUtils;
}
