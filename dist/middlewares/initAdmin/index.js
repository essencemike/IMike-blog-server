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
const md5 = require("md5");
const chalk_1 = require("chalk");
const config_1 = require("../../config");
const user_1 = require("../../models/user");
exports.default = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const username = config_1.default.admin.username;
    const password = md5(config_1.default.admin.password);
    const name = config_1.default.admin.name;
    let result = yield user_1.default
        .find()
        .exec()
        .catch(() => ctx.throw(500, '服务器内部错误-查找admin错误！'));
    if (result.length === 0) {
        let user = new user_1.default({
            name,
            username,
            password,
        });
        yield user.save().catch(() => ctx.throw(500, '服务器内部错误-存储admin错误！'));
        console.log(`${chalk_1.default.green('[app]')} ${chalk_1.default.cyan('初始化admin账号密码完成！')}`);
    }
    yield next();
});
