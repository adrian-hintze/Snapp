/**
 * Validation.ts
 *
 * Created on: 2016-09-27
 *     Author: Adrian Hintze
 *
 */

interface ValidationError {
    // TODO -normal- Have like validation error codes or something
}

export function validateString(parameter: string, canBeEmpty: boolean, validValues?: Array<string>): ValidationError | undefined {
    if (typeof parameter !== 'string') {
        return { };
    }

    if (!canBeEmpty && !parameter) {
        return { };
    }

    if (validValues) {
        if (canBeEmpty) {
            validValues.push('');
        }
        if (!validValues.some(v => v === parameter)) {
            return { };
        }
    }
}

export function validateBoolean(parameter: boolean): ValidationError | undefined {
    if (typeof parameter !== 'boolean') {
        return { };
    }
}
