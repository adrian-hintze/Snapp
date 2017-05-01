/**
 * Resolution.ts
 *
 * Created on: 2017-04-25
 *     Author: Adrian Hintze @Rydion
 *
 */

'use strict';

export default class Resolution {
    public static fromString(resolution: string) {
        if (resolution.indexOf('x') < 0) {
            throw new Error('');
        }

        const dimensions: Array<string> = resolution.split('x');
        if (dimensions.length !== 2) {
            throw new Error('');
        }
        if (isNaN(Number(dimensions[0])) || isNaN(Number(dimensions[1]))) {
            throw new Error('');
        }

        return new Resolution(parseInt(dimensions[0]), parseInt(dimensions[1]));
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    private constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    private width: number;
    private height: number;
};
