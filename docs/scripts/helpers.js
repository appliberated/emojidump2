/* eslint-disable require-jsdoc */
/* eslint-disable no-nested-ternary */

// [...new Set(emojiList.map(item => item.v))].sort((a, b) => a - b).join(", ")
const unicodeVersions = [1.1, 3.0, 3.2, 4.0, 4.1, 5.1, 5.2, 6.0, 6.1, 7.0, 8.0, 9.0, 10.0, 11.0];

const Options = {
    unicode: { option: "u", errorMsg: "Invalid Unicode version", type: "float", check: value => unicodeVersions.includes(value) },
    shuffle: { option: "s", errorMsg: "Invalid shuffle option", type: "boolean" },
    max: { option: "m", errorMsg: "Invalid maximum number of emojis to display", type: "int" },
    join: { option: "j", errorMsg: "Invalid join option", type: "boolean" },
    fontSize: { option: "fs", errorMsg: "Invalid font size", type: "int", check: value => value > 0 },
    letterSpacing: { option: "ls", errorMsg: "Invalid letter spacing", type: "int" },
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

export function getOptionValue(option, paramValue) {
    let value;
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

    if ((value === null) || Number.isNaN(value) || (option.check && !option.check(value))) {
        throw Error(`${option.errorMsg}: ${paramValue}`);
    }

    return value;

}


export function parseOptions(params) {
    let result = {};
    for (const key in Options) {
        const option = Options[key];
        if (params.has(option.option)) {
            result[key] = getOptionValue(option, params.get(option.option));
        }
    }

    return result;
}