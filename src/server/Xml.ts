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
        const strict = true;
        this.parser = createSaxParser(strict, {});
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

/*


'use strict';

import { XmlDocument } from 'xmldoc';
import { createStream, SAXStream } from 'sax';

export class Xml {
    static isValidString(xml: string): boolean {
        try {
            new XmlDocument(xml);
            return true;
        }
        catch (error) {
            return false;
        }
    }

    static fromString(xml: string): Xml {
        return new Xml(new XmlDocument(xml));
    }


    public hasChild(name: string): boolean {
        return !!this.xml.childNamed(name);
    }

    public hasProperty(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.xml.attr, name);
    }

    public getChild(name: string): Xml {
        return new Xml(this.xml.childNamed(name));
    }

    public getProperty(name: string): any {
        return this.xml.attr.name;
    }


    private xml: XmlDocument;

    private constructor(xml: XmlDocument) {
        this.xml = xml;
    }
}


export class SaxParser {
    public constructor() {
        const strict = true;
        this.parser = createStream(strict, {});
    }

    public onEnd(callback: () => void) {
        this.parser.on('end', callback);
    }

    public parse(filePath: string) {
        const fs = require('fs');
        fs.createReadStream(filePath).pipe(this.parser);
    }

    private parser: SAXStream;
}


*/