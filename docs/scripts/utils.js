/*
 *  emojidump. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/emojidump/
 */

/* eslint-disable require-jsdoc */
/* eslint-disable no-nested-ternary */


export function isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0
}

export function isIntegerBetween(n, a, b) {
    return Number.isInteger(n) && (n - a) * (n - b) <= 0
}

/**
 * Randomize array element order in-place, using an implementation of the Durstenfeld shuffle, a
 * computer-optimized version of Fisher-Yates shuffle.
 * Credit: {@link https://stackoverflow.com/a/12646864/220039}
 * @param {Array} array The array to shuffle.
 * @returns {void}
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function parseBoolNumber(value) {
    return value === undefined ? true : /^(true|false)$/i.test(value) ? value.toLowerCase() === "true" : /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value) ? Number(value) : value;

}

