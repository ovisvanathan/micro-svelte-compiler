"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.converter = void 0;
var types_1 = require("@babel/types");
var isValidJsonValue = function (node) {
    if ((0, types_1.isNumericLiteral)(node) ||
        (0, types_1.isStringLiteral)(node) ||
        (0, types_1.isBooleanLiteral)(node) ||
        (0, types_1.isNullLiteral)(node) ||
        (0, types_1.isArrayExpression)(node) ||
        (0, types_1.isObjectExpression)(node)) {
        return true;
    }
    return false;
};
/**
 * Check whether given ObjectExpression consists of only `ObjectProperty`s as its properties.
 */
var isObjectExpressionWithOnlyObjectProperties = function (node) {
    return node.properties.every(function (property) { return (0, types_1.isObjectProperty)(property); });
};
var isConvertibleObjectProperty = function (properties) {
    return properties.every(function (node) { return !node.computed; });
};
var createSafeStringForJsonParse = function (value) {
    if (/\\/.test(value)) {
        value = value.replace(/\\/g, '\\\\');
    }
    if (/"/.test(value)) {
        value = value.replace(/"/g, '\\"');
    }
    if (/[\t\f\r\n\b]/g.test(value)) {
        var codes = ['\f', '\r', '\n', '\t', '\b'];
        var replaceCodes = ['\\f', '\\r', '\\n', '\\t', '\\b'];
        for (var i = 0; i < codes.length; i++) {
            value = value.replace(new RegExp(codes[i], 'g'), replaceCodes[i]);
        }
    }
    return value;
};
function converter(node) {
    // for negative number, ex) -10
    if ((0, types_1.isUnaryExpression)(node)) {
        var operator = node.operator, argument = node.argument;
        if (operator === '-' && (0, types_1.isNumericLiteral)(argument)) {
            return -argument.value;
        }
    }
    if (!isValidJsonValue(node)) {
        throw new Error('Invalid value is included.');
    }
    if ((0, types_1.isStringLiteral)(node)) {
        var value = node.value;
        var safeValue = createSafeStringForJsonParse(value);
        return safeValue;
    }
    if ((0, types_1.isNullLiteral)(node)) {
        return null;
    }
    if ((0, types_1.isArrayExpression)(node)) {
        var elements = node.elements;
        return elements.map(function (node) { return converter(node); });
    }
    if ((0, types_1.isObjectExpression)(node)) {
        if (!isObjectExpressionWithOnlyObjectProperties(node)) {
            throw new Error('Invalid syntax is included.');
        }
        var properties = node.properties;
        if (!isConvertibleObjectProperty(properties)) {
            throw new Error('Invalid syntax is included.');
        }
        return properties.reduce(function (acc, cur) {
            var _a;
            var key = '';
            if ((0, types_1.isIdentifier)(cur.key)) {
                key = createSafeStringForJsonParse(cur.key.name);
            }
            else if ((0, types_1.isStringLiteral)(cur.key)) {
                key = createSafeStringForJsonParse(cur.key.value);
            }
            else if ((0, types_1.isNumericLiteral)(cur.key)) {
                // see issues#10
                if (!Number.isSafeInteger(cur.key.value)) {
                    throw new Error('Invalid syntax is included.');
                }
                key = cur.key.value.toString();
            }
            else {
                throw new Error('Invalid syntax is included.');
            }
            var value = converter(cur.value);
            return __assign(__assign({}, acc), (_a = {}, _a[key] = value, _a));
        }, {});
    }
    return node.value;
}
exports.converter = converter;
