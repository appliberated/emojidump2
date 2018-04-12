/*
 *  emojidump. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/emojidump/
 */

/* eslint-disable no-console, max-statements */

import * as helpers from "/scripts/helpers.js";
import * as utils from "/scripts/utils.js";


let sourceEmojis, curEmojis;

/**
 * Get references to the required DOM elements.
 */
const dumpEl = document.getElementById("dump");
const feedbackEl = document.getElementById("feedback");

/**
 * Performs the actual emojidump command.
 * @param {string} argString The command line arguments.
 * @returns {void}
 */
function execCommandInternal(urlParams) {

    for (let p of urlParams) {
        console.log(p);
    }

    let value, valid, error, version, shuffle, max, join;

    // Filter the emoji array by Unicode version, if the unicode option is present and has a valid value
    ({ valid, value: version, error } = helpers.checkOption(urlParams, "unicode"));
    if (valid === false) return error;
    // By default display all emojis
    curEmojis = valid ? sourceEmojis.filter(el => el.v <= version) : sourceEmojis.slice(0);
    const len = curEmojis.length;

    // Shuffle the emoji array if the shuffle option is on
    ({ valid, value: shuffle, error } = helpers.checkOption(urlParams, "shuffle"));
    if (valid === false) return error;
    if (valid && shuffle) utils.shuffleArray(curEmojis);

    // Slice the emoji array, if the maximum option is present and has a valid value
    ({ valid, value: max, error } = helpers.checkOption(urlParams, "max"));
    if (valid === false) return error;
    if (valid && max < curEmojis.length) curEmojis = max > 0 ? curEmojis.slice(0, max) : curEmojis.slice(max);

    // Check if the join option is present and has a valid value
    ({ valid, value: join, error } = helpers.checkOption(urlParams, "join"));
    if (valid === false) return error;

    // Dump the emojis, with no separator if the join option was passed
    dumpEl.innerText = curEmojis.map(emoji => emoji.e).join(join ? "" : " ");

    // Update the emoji font size, if the font size option is present and has a valid value
    ({ valid, value, error } = helpers.checkOption(urlParams, "fontSize"));
    if (valid === false) return error;
    if (valid) dumpEl.style.fontSize = `${value}px`;

    // Update the emoji line height, if the line height option is present and has a valid value
    ({ valid, value, error } = helpers.checkOption(urlParams, "lineHeight"));
    if (valid === false) return error;
    if (valid) dumpEl.style.lineHeight = `${value}px`;

    {   
        // Update the emoji line height, if the line height option is present and has a valid value
        const { valid, size, error } = helpers.checkOption(urlParams, "lineHeight");
        if (valid === false) return error;
        if (valid) dumpEl.style.lineHeight = `${size}px`;
    }

    // Return success and a command summary message
    // return { result: true, msg: helpers.commandFeedback(len, version, shuffle, max, join) };
    return { result: true, msg: "" };
}

/**
 * Executes the emojidump command with the current command line arguments.
 * @returns {void}
 */
function execCommand() {
    const { result, msg } = execCommandInternal(new URLSearchParams(location.search));

    // On success: show the emoji dump, on failure show the help screen; update the message
    dumpEl.classList.toggle("hidden", !result);
    feedbackEl.innerText = msg;
    feedbackEl.classList.toggle("feedback--error", !result);
}

/**
 * Shows an app error message to the user.
 * @param {Object} error The error object.
 * @returns {void}
 */
function showAppError(error) {
    feedbackEl.innerText = `Cannot load emojis! ${error}`;
    console.error(error);
}

/**
 * Initializes the app.
 * @returns {void}
 */
function initApp() {
    // Fetch the emoji JSON file; on success execute the emojidump command, on failure show error message
    fetch("/scripts/emoji.json")
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(response => {
            sourceEmojis = response;
            execCommand();
        })
        .catch(error => showAppError(error));
}

initApp();
