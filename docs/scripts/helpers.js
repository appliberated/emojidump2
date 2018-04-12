/* eslint-disable require-jsdoc */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */

import * as utils from "/scripts/utils.js";

// [...new Set(emojiList.map(item => item.v))].sort((a, b) => a - b).join(", ")
const unicodeVersions = [1.1, 3.0, 3.2, 4.0, 4.1, 5.1, 5.2, 6.0, 6.1, 7.0, 8.0, 9.0, 10.0, 11.0];

const claOptions = {
    unicode: { option: "u", errorMsg: "Invalid Unicode version", type: "float", check: value => unicodeVersions.includes(value) },
    shuffle: { option: "s", errorMsg: "Invalid shuffle option", type: "boolean" },
    max: { option: "m", errorMsg: "Invalid maximum number of emojis to display", type: "int" },
    join: { option: "j", errorMsg: "Invalid join option", type: "boolean" },
    fontSize: { option: "fs", errorMsg: "Invalid font size", type: "int", check: value => value > 0 },
    lineHeight: { option: "lh", errorMsg: "Invalid line height", type: "int", check: value => value > 0 }
};

export function parseBooleanParam(value) {
    return value === "" ? true : /^(true|false)$/i.test(value) ? value.toLowerCase() === "true" : null;
}

export function parseFloatParam(value) {
    return /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value) ? Number(value) : NaN;
}

export function parseIntParam(value) {
    return /^(\-|\+)?([0-9]+|Infinity)$/.test(value) ? Number(value) : NaN;
}

export function checkOption(params, optionName) {
    let valid, value, error;
    // console.log("check", check);
    const option = claOptions[optionName];
    if (params.has(option.option)) {
        const paramValue = params.get(option.option);

        switch (option.type) {
            case "boolean":
                value = parseBooleanParam(paramValue);
                break;
            case "int":
                value = parseIntParam(paramValue);
                break;
            case "float":
                value = parseFloatParam(paramValue);
                break;
            default:
                value = paramValue;
                break;
        }

        // value = option.type === "boolean" ?
        //     parseBooleanParam(paramValue) :
        //     option.type === "number" ? parseFloatParam(paramValue) : paramValue;

        valid = !((value === null) || Number.isNaN(value) || (option.check && !option.check(value)));
        if (!valid) {
            error = { result: false, msg: `${option.errorMsg}: ${paramValue}` }
        }
    }

    const result = { valid: valid, value: value, error: error };
    console.log(optionName, result);
    return result;
}

export function commandFeedback(len, version, shuffle, max, join, zoom) {
    let msg = "Dumped";
    if (max !== undefined) msg += ` ${Math.min(max, len).toLocaleString()} of`;
    msg += ` ${len.toLocaleString()} Unicode ${version.toFixed(1)} emojis`;
    if (shuffle) msg += ", shuffled";
    msg += `, with ${join ? "no" : "space"} separator`
    if (zoom) msg += `, and a ${zoom}x zoom`;

    return msg + ".";
}