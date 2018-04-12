/* eslint-disable require-jsdoc */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-statements */

// [...new Set(emojiList.map(item => item.v))].sort((a, b) => a - b).join(", ")
const unicodeVersions = [1.1, 3.0, 3.2, 4.0, 4.1, 5.1, 5.2, 6.0, 6.1, 7.0, 8.0, 9.0, 10.0, 11.0];

const appOptions = {
    unicode: { paramNames: ["u", "unicode"], errorMsg: "Invalid Unicode version", type: "float", check: value => unicodeVersions.includes(value) },
    shuffle: { paramNames: ["s", "shuffle"], errorMsg: "Invalid shuffle option", type: "boolean" },
    max: { paramNames: ["m", "max"], errorMsg: "Invalid maximum number of emojis to display", type: "int" },
    join: { paramNames: ["j", "join"], errorMsg: "Invalid join option", type: "boolean" },
    fontSize: { paramNames: ["fs", "fontsize"], errorMsg: "Invalid font size", type: "int", check: value => value > 0 },
    letterSpacing: { paramNames: ["ls", "letterspacing"], errorMsg: "Invalid letter spacing", type: "int" },
    lineHeight: { paramNames: ["lh", "lineheight"], errorMsg: "Invalid line height", type: "int", check: value => value > 0 },
    blendIn: { paramNames: ["bi", "blendin"], errorMsg: "Invalid blend in option", type: "boolean" }
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
    const result = {};
    const optionKeys = Object.keys(appOptions);

    for (const param of params) {
        const curKey = optionKeys.find(option => appOptions[option].paramNames.includes(param[0]));
        if (curKey) result[curKey] = getOptionValue(appOptions[curKey], param[1]);
    }

    return result;
}
