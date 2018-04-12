/*
 *  emojidump. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/emojidump/
 */

/* eslint max-statements: ["error", 20],  */

import * as helpers from "/scripts/helpers.js";
import * as utils from "/scripts/utils.js";

/**
 * Get references to the required DOM elements.
 */
const dumpEl = document.getElementById("dump");

/**
 * Returns a summary message of the command.
 * @param {Object} opt The current command options.
 * @param {Number} count The emoji count.
 * @returns {string} The summary of the command.
 */
function getSummary(opt, count) {
    const maxStr = opt.max ? `${Math.min(opt.max, count).toLocaleString()} of ` : "";
    const unicodeStr = opt.unicode ? ` Unicode ${opt.unicode.toFixed(1)}` : "";
    const shuffleStr = opt.shuffle ? " shuffled" : "";
    return `${maxStr}${count.toLocaleString()}${unicodeStr}${shuffleStr} emojis`;
}

/**
 * Performs the actual emojidump command.
 * @param {Array} emojis The source emoji array.
 * @param {Object} params The URL query parameters.
 * @returns {void}
 */
function execCommand(emojis, params) {

    const opt = helpers.parseOptions(params);
    console.log("URL Query Parameters\n", opt);

    // Filter emojis by Unicode version, if the unicode option is set; by default display all emojis
    let curEmojis = opt.unicode ? emojis.filter(el => el.v <= opt.unicode) : emojis.slice(0);
    const count = curEmojis.length;

    // Shuffle emojis if the shuffle option is on
    if (opt.shuffle) utils.shuffleArray(curEmojis);

    // Slice the emoji array, if the maximum option is present and has a valid value
    if (opt.max && opt.max < curEmojis.length) {
        curEmojis = opt.max > 0 ? curEmojis.slice(0, opt.max) : curEmojis.slice(opt.max);
    }

    // Dump the emojis, with no separator if the join option is on
    dumpEl.innerText = curEmojis.map(emoji => emoji.e).join(opt.join ? "" : " ");

    // Update the emoji font size, if the font size option is set
    if (opt.fontSize) dumpEl.style.fontSize = `${opt.fontSize}px`;

    // Update the emoji letter spacing, if the letter spacing option is set
    if (opt.letterSpacing) dumpEl.style.letterSpacing = `${opt.letterSpacing}px`;

    // Update the emoji line height, if the line height option is set
    if (opt.lineHeight) dumpEl.style.lineHeight = `${opt.lineHeight}px`;

    // Update the document title with a command summary message
    document.title = getSummary(opt, count);
}

/**
 * Shows an error message to the user.
 * @param {string} category The error category name.
 * @param {Object} error The error object.
 * @returns {void}
 */
function showError(category, error) {
    dumpEl.innerText = `${category}: ${error.message}`;
    dumpEl.classList.add("dump--error");
    console.error(error);
}

/**
 * Initializes the app.
 * @returns {void}
 */
function initApp() {
    console.log("%cemojidump", "background-color: #FFCC22; font-weight: bold; padding: 0.5rem 1rem; ");

    // Fetch the emoji JSON file; on success execute the emojidump command, on failure show error message
    fetch("/scripts/emoji.json")
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(response => {
            try {
                const params = new URLSearchParams(location.search);
                execCommand(response, params);
            } catch (error) {
                showError("Command Error", error);
            }
        })
        .catch(error => showError("Emoji Load Error", error));
}

initApp();
