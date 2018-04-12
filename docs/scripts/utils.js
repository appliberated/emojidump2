/*
 *  emojidump. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/emojidump/
 */

/**
 * Randomize array element order in-place, using an implementation of the Durstenfeld shuffle, a
 * computer-optimized version of Fisher-Yates shuffle.
 * Credit: {@link https://stackoverflow.com/a/12646864/220039}
 * @param {Array} array The array to shuffle.
 * @returns {void}
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
