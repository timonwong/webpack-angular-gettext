import * as _ from 'lodash';
import * as Po from 'pofile';

function referenceMatches(oldRef: string, newRef: string): boolean {
  return _(oldRef).split(':').first() === _(newRef).split(':').first();
}

function mergeReferences(oldRefs: string[], newRefs: string[]): string[] {
const _newRefs = _(newRefs);

return _(oldRefs)
  .reject((oldRef) => {
    return _newRefs.some((newRef: string) => referenceMatches(oldRef, newRef));
  })
  .concat(newRefs)
  .uniq()
  .sort()
  .value();
}

export class Registry {
  private stringsList: angularGettextTools.Strings[] = [];
  private strings: angularGettextTools.Strings;

  addGetTextStrings(strings: angularGettextTools.Strings): void {
    this.stringsList.push(strings);
  }

  // Merge two po strings, please note that this function will modify the target instance
  private merge(target: angularGettextTools.Strings, from: angularGettextTools.Strings) {
    _.forIn(from, (contextObject, msgid) => {
      if (!target[msgid]) {
        target[msgid] = {};
      }

      _.forIn(contextObject, (item, context) => {
        const existing = target[msgid][context];
        if (!existing) {
          target[msgid][context] = item;
        } else {
          existing.comments = _.uniq(existing.comments.concat(item.comments)).sort();
          existing.references = mergeReferences(item.references, existing.references);
        }
      });
    });
  }

  toString(): string {
    if (this.stringsList.length) {
      this.strings = this.stringsList[0];

      for (let i = 1; i < this.stringsList.length; i++) {
        this.merge(this.strings, this.stringsList[i]);
      }

      // Clear
      this.stringsList.length = 0;
    }

    const catalog = new Po();
    catalog.headers = {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Content-Transfer-Encoding': '8bit',
      'Project-Id-Version': ''
    };

    if (this.strings) {
      _.forIn(this.strings, (msg, msgid) => {
        const contexts = _.keys(msg).sort();
        _.forEach(contexts, (context) => {
          catalog.items.push(msg[context]);
        });
      });
    }

    catalog.items.sort((a: any, b: any) => {
      return a.msgid.localeCompare(b.msgid);
    });

    return catalog.toString();
  }
}

export default Registry;
