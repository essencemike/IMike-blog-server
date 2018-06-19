"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function sureIsArray(arr) {
    return Array.isArray(arr) ? arr : [arr];
}
exports.sureIsArray = sureIsArray;
function isDescriptor(desc) {
    if (!desc || !desc.hasOwnProperty)
        return false;
    for (let key of ['value', 'initializer', 'get', 'set']) {
        if (desc.hasOwnProperty(key))
            return true;
    }
    return false;
}
exports.isDescriptor = isDescriptor;
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
function requireDescriptor(target, name, descriptor, rules) {
    function middleware(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (rules.query) {
                rules.query = sureIsArray(rules.query);
                for (let name of rules.query) {
                    if (!ctx.query[name]) {
                        ctx.throw(412, `GET Request query: ${name} required`);
                    }
                }
            }
            if (rules.params) {
                rules.params = sureIsArray(rules.params);
                for (let name of rules.params) {
                    if (!ctx.params[name]) {
                        ctx.throw(412, `GET Request params: ${name} required`);
                    }
                }
            }
            yield next();
        });
    }
    target[name] = sureIsArray(target[name]);
    target[name].splice(target[name].length - 1, 0, middleware);
    return descriptor;
}
exports.requireDescriptor = requireDescriptor;
function decorate(handleDescriptor, entryArgs) {
    if (isDescriptor(last(entryArgs)))
        return handleDescriptor(entryArgs);
    return function () {
        return handleDescriptor(...Array.from(arguments), ...entryArgs);
    };
}
exports.decorate = decorate;
