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
const me_1 = require("../models/me");
const router_1 = require("../middlewares/router");
let MeController = class MeController {
    getMeInfo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield me_1.default
                .findOne({})
                .exec()
                .catch(error => {
                ctx.throw(500, '服务器内部错误-个人信息查找错误！');
            });
            if (result === null) {
                const meObj = new me_1.default({
                    content: 'I am IMike'
                });
                const r = yield meObj
                    .save()
                    .catch(error => {
                    ctx.throw(500, '服务器内容错误-个人信息初始化错误！');
                });
                ctx.success({
                    msg: '个人信息初始化成功！',
                    data: r,
                });
            }
            else {
                ctx.success({
                    msg: '个人信息获取成功！',
                    data: result,
                });
            }
        });
    }
    modifyMeInfo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = ctx.request.body.content;
            if (!content) {
                ctx.throw(400, '内容不能为空！');
            }
            let result = yield me_1.default
                .findOneAndUpdate({}, {
                content
            }, {
                new: true
            })
                .exec()
                .catch(error => {
                ctx.throw(500, '更新个人信息错误！');
            });
            ctx.success({
                msg: '个人信息修改成功！',
                data: result,
            });
        });
    }
};
__decorate([
    router_1.Get(),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "getMeInfo", null);
__decorate([
    router_1.Post(),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MeController.prototype, "modifyMeInfo", null);
MeController = __decorate([
    router_1.Controller('me')
], MeController);
exports.default = MeController;
