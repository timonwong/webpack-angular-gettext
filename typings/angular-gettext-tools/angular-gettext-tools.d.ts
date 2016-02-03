declare module angularGettextTools {
  type ContextStrings = { [context: string]: pofile.IPoItem };
  type Strings = { [msgid: string]: ContextStrings };

  interface IExtractor {
    strings: Strings;

    parse(filename: string, content: string): void;
    toString(): string;
  }

  interface IExtractorStatic {
    new(options: {}): IExtractor;
  }
}

declare var angularGettextTools: {
  Extractor: angularGettextTools.IExtractorStatic
};

declare module 'angular-gettext-tools' {
  export = angularGettextTools;
}