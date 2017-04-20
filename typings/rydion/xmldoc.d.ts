declare module 'xmldoc' {
    class XmlElement {
        public name: string;
        public attr: any;
        public val: string;
        public children: Array<XmlElement>;
        public firstChild: XmlElement | null;
        public lastChild: XmlElement | null;
        public line: number;
        public column: number;
        public position: number;
        public startTagPosition: number;

        public constructor(xml: string);
        public childNamed(name: string): XmlElement;
    }

    export class XmlDocument extends XmlElement {

    }
}
