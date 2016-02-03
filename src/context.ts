import LoaderContext = webpack.LoaderContext;

export interface GettextLoaderContext extends LoaderContext {

    addGettextStrings?: (strings: angularGettextTools.Strings) => void;

}

export default GettextLoaderContext;
