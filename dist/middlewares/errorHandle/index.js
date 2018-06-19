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
const tracer = require("tracer");
const fs = require("fs");
const logger = tracer.colorConsole({
    level: 'error',
    format: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
    dateformat: 'HH:MM:ss.L',
    transport: function (data) {
        fs.appendFile('./error.log', data.output + '\n', { encoding: 'utf8' }, (err) => {
            if (err) {
                throw err;
            }
        });
    },
});
exports.default = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (error) {
        logger.error(error.stack);
        throw (error);
    }
});
