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
const chalk_1 = require("chalk");
const lib_1 = require("../../lib");
const request_method_enum_1 = require("../../types/enums/request-method.enum");
const Route_1 = require("./Route");
let requestID = 0;
function required(args) {
    return (target, name, descriptor) => {
        return lib_1.requireDescriptor(target, name, descriptor, args);
    };
}
exports.required = required;
function Controller(prefix = '/') {
    return (target) => {
        target.prototype[Route_1.symbolRoutePrefix] = prefix;
    };
}
exports.Controller = Controller;
function Router(path = '', config) {
    return (target, name) => {
        Route_1.Route.__DecoratedRouters.set({
            target,
            path,
            method: config.method,
            unless: config.unless,
        }, target[name]);
    };
}
exports.Router = Router;
const createMappingDecorator = (method) => (path, config) => {
    const mergeConfig = Object.assign({}, config, { method });
    return Router(path, mergeConfig);
};
exports.Get = createMappingDecorator(request_method_enum_1.RequestMethod.GET);
exports.Post = createMappingDecorator(request_method_enum_1.RequestMethod.POST);
exports.Put = createMappingDecorator(request_method_enum_1.RequestMethod.PUT);
exports.Delete = createMappingDecorator(request_method_enum_1.RequestMethod.DELETE);
exports.Patch = createMappingDecorator(request_method_enum_1.RequestMethod.PATCH);
function convert(middleware) {
    return lib_1.decorate((target, name, descriptor, middleware) => {
        target[name] = lib_1.sureIsArray(target[name]);
        target[name].splice(target[name].length - 1, 0, middleware);
        return descriptor;
    }, lib_1.sureIsArray(middleware));
}
exports.convert = convert;
function log(target, name, value) {
    function Logger(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentRequestID = requestID++;
            const startTime = process.hrtime();
            if ((ctx.method).toLowerCase() === 'post') {
                console.log(`${chalk_1.default.green('→')} (ID: ${currentRequestID}) ${chalk_1.default.blue(`${ctx.method}`)} ${JSON.stringify(ctx.request.body)}`);
            }
            else {
                console.log(`${chalk_1.default.green('→')} (ID: ${currentRequestID}) ${chalk_1.default.blue(`${ctx.method}`)} ${ctx.url}`);
            }
            yield next();
            const endTime = process.hrtime();
            const timespan = (endTime[0] - startTime[0]) * 1000 + (endTime[1] - startTime[1]) / 1000000;
            console.log(`${chalk_1.default.green('←')} (ID: ${currentRequestID}) ${chalk_1.default.blue(`${ctx.method}`)} ${ctx.url}, Status: ${ctx.status} Time: ${timespan.toFixed(0)} ms`);
        });
    }
    target[name] = lib_1.sureIsArray(target[name]);
    target[name].splice(target[name].length - 1, 0, Logger);
    return value;
}
exports.log = log;
