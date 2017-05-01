/**
 * Xml.ts
 *
 * Created on: 2016-09-26
 *     Author: Adrian Hintze @Rydion
 *
 */

'use strict';

import { parser as createSaxParser, SAXParser, Tag, QualifiedTag } from 'sax';

export default class SaxParser {
    public constructor() {
        const useStrict = true;
        this.parser = createSaxParser(useStrict, { });
    }

    public onTag(callback: (tag: Tag | QualifiedTag) => void) {
        this.parser.onopentag = callback;
    }

    public onError(callback: (e: Error) => void) {
        this.parser.onerror = callback;
    }

    public onEnd(callback: () => void) {
        this.parser.onend = callback;
    }

    public parse(xml: string) {
        try {
            this.parser.write(xml).close();
        }
        catch (error) { }
    }

    private parser: SAXParser;
}
