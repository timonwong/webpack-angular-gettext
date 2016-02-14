import * as _ from 'lodash';
import * as Po from 'pofile';

function referenceMatches(oldRef: string, newRef: string): boolean {
  return _(oldRef).split(':').first() === _(newRef).split(':').first();
}

function mergeReferences(oldRefs: string[], newRefs: string[]): string[] {
  return _(oldRefs)
    .concat(newRefs)
    .uniq()
    .sort()
    .value();
}

export class Registry {
  private strings: angularGettextTools.Strings = {};
  private msgidsByResource: { [resource: string]: string[] } = {};

  pruneGetTextStrings(resource: string): void {
    const msgids = this.msgidsByResource[resource] || [];

    for (let msgid of msgids) {
      const contextObject = this.strings[msgid];
      const contexts = Object.keys(contextObject);

      for (let context of contexts) {
        const item = contextObject[context];

        for (let ref of item.references) {
          if (referenceMatches(ref, resource)) {
            item.references.splice(item.references.indexOf(ref), 1);

            if (item.references.length === 0) {
              delete contextObject[context];
            }
            break;
          }
        }
      }
    }

    delete this.msgidsByResource[resource];
  }

  addGetTextStrings(strings: angularGettextTools.Strings): void {
    _.forIn(strings, (contextObject, msgid) => {
      if (!this.strings[msgid]) {
        this.strings[msgid] = {};
      }

      _.forIn(contextObject, (item, context) => {
        // Keep track of current references, so we can tidy them when re-compiling
        for (let ref of item.references) {
          const resource = _(ref).split(':').first();
          const msgids = this.msgidsByResource[resource] = this.msgidsByResource[resource] || [];
          msgids.push(item.msgid);
        }

        const existing = this.strings[msgid][context];

        if (!existing) {
          this.strings[msgid][context] = item;
        } else {
          existing.comments = _.uniq(existing.comments.concat(item.comments)).sort();
          existing.references = mergeReferences(existing.references, item.references);
        }
      });
    });
  }

  toString(): string {
    const catalog = new Po();
    catalog.headers = {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Content-Transfer-Encoding': '8bit',
      'Project-Id-Version': ''
    };

    _.forIn(this.strings, (msg, msgid) => {
      const contexts = _.keys(msg).sort();
      _.forEach(contexts, (context) => {
        catalog.items.push(msg[context]);
      });
    });

    catalog.items.sort((a: any, b: any) => {
      return a.msgid.localeCompare(b.msgid);
    });

    return catalog.toString();
  }
}

export default Registry;
