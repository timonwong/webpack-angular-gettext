declare module pofile {

  interface IPoItem {
    // The message id
    msgid: string;
    // The plural message id
    msgid_plural: string;
    // An array of translated strings. Items that have no plural msgid only have one element in this array
    msgstr: string[];
    // An array of reference strings
    references: string[];
    // An array of string translator comments
    comments: string[];
    // An array of reference strings
    extractedComments: string[];
    // Context of the message, an arbitrary string, can be used for disambiguation
    msgctxt: string;
    // A dictionary of the string flags. Each flag is mapped to a key with value true
    flags: {[key: string]: boolean};
    obsolete: boolean;
  }

  interface IPo {
    // An array of comments (found at the header of the file)
    comments: string[];
    // A dictionary of the headers
    headers: {[name: string]: string};
    // An array of PoItem objects, each of which represents a string from the gettext catalog
    items: IPoItem[];

    save(filename: string, callback: (err: Error) => void): void;
  }

  interface IPoStatic {
    new(): IPo;

    load(filename: string, callback: (err: Error, po: IPo) => void): void;
    parse(content: string): IPo;
  }

}

declare var PO: pofile.IPoStatic;

declare module 'pofile' {
  export = PO;
}
