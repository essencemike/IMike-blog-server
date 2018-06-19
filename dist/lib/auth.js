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
const jwt = require("jsonwebtoken");
const config_1 = require("../config");
function signToken(userId) {
    const jwtConfig = config_1.default.jwt;
    const token = jwt.sign({ userId }, jwtConfig.secret, { expiresIn: jwtConfig.time });
    return token;
}
exports.signToken = signToken;
function verifyToken(ctx, decodedToken, token) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(decodedToken, token);
        const authorization = ctx.get('authorization');
        if (authorization) {
            let token = authorization.split(' ')[1];
            try {
                jwt.verify(token, config_1.default.jwt.secret);
                return Promise.resolve(false);
            }
            catch (err) {
                ctx.throw(401, 'expired token');
                return Promise.resolve(true);
            }
        }
        else {
            ctx.throw(401, 'no token detected in http header Authorization');
            return Promise.resolve(true);
        }
    });
}
exports.verifyToken = verifyToken;
