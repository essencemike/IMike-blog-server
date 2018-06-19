"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const user_1 = require("../models/user");
const auth_1 = require("../lib/auth");
const router_1 = require("../middlewares/router");
let UserController = class UserController {
    getUser(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.success({
                data: {
                    userId: 'IMike',
                    userName: 'IMike',
                },
                msg: '获取 user 信息成功！',
            });
        });
    }
    login(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = ctx.request.body;
            if (!username) {
                ctx.throw(400, '用户名不能为空！');
            }
            if (!password) {
                ctx.throw(400, '密码不能为空！');
            }
            let result = yield user_1.default
                .findOne({
                username
            })
                .exec()
                .catch(error => {
                ctx.throw(500, '服务器内部错误-findUser错误！');
            });
            if (result) {
                if (result.password === md5(password)) {
                    let token = auth_1.signToken(result._id);
                    return ctx.success({
                        msg: '登录成功！',
                        data: {
                            uid: result._id,
                            name: result.name,
                            username: result.username,
                            createTime: result.createTime,
                            token,
                        },
                        success: true
                    });
                }
                else {
                    return ctx.success({
                        msg: '密码错误！',
                        success: false
                    });
                }
            }
            else {
                return ctx.success({
                    msg: '用户名不存在！',
                    success: false
                });
            }
        });
    }
    logout(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.success({
                msg: '退出成功！',
                success: true
            });
        });
    }
    updateUserMes(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.success({
                msg: '通过！'
            });
        });
    }
    resetPwd(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = ctx.request.body.id;
            const password = md5(ctx.request.body.password);
            yield user_1.default
                .findByIdAndUpdate(uid, {
                password
            })
                .exec()
                .catch(error => {
                ctx.throw(500, '服务器内部错误-modifyPwd错误！');
            });
            ctx.success({
                msg: '更新管理员密码成功！',
                success: true
            });
        });
    }
};
__decorate([
    router_1.Get(':id'),
    router_1.required({ params: 'id' }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    router_1.Post('login'),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    router_1.Get('logout'),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    router_1.Put(':id'),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserMes", null);
__decorate([
    router_1.Put(':id'),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPwd", null);
UserController = __decorate([
    router_1.Controller('user')
], UserController);
exports.default = UserController;
