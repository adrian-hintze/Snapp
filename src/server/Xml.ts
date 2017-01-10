/**
 * Xml.ts
 *
 * Created on: 2016-09-26
 *     Author: Adrian Hintze @Rydion
 *
 */

'use strict';

import { XmlDocument } from 'xmldoc';

export default class Xml {
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
