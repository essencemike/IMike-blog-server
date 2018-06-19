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
const tag_1 = require("../models/tag");
const router_1 = require("../middlewares/router");
let TagController = class TagController {
    createTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = ctx.request.body.name;
            if (!name) {
                ctx.throw(400, '标签类型不能为空！');
            }
            let isOldTag = yield tag_1.default
                .findOne({ name })
                .exec()
                .catch(error => {
                ctx.throw(500, '服务器内部错误-findOneTag错误！');
            });
            if (isOldTag !== null) {
                return ctx.success({
                    msg: '这是已经存在的标签！',
                    data: isOldTag
                });
            }
            let tag = new tag_1.default({
                name
            });
            let result = yield tag
                .save()
                .catch(error => {
                ctx.throw(500, '服务器内部错误-createTag错误！');
            });
            ctx.success({
                msg: '添加标签成功！',
                data: result
            });
        });
    }
    getAllTags(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield tag_1.default.find().catch(error => {
                ctx.throw(500, '服务器内部错误-获取所有标签错误！');
            });
            ctx.success({
                msg: '获取所有标签成功！',
                data: result
            });
        });
    }
    modifyTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = ctx.params.id;
            let name = ctx.request.body.name;
            if (!name) {
                ctx.throw(400, '标签类型不能为空！');
            }
            let result = yield tag_1.default
                .findByIdAndUpdate(id, {
                name
            }, {
                new: true
            })
                .exec()
                .catch(error => {
                ctx.throw(500, '服务器内部错误-modifyTag错误！');
            });
            ctx.success({
                msg: '修改标签成功！',
                data: result
            });
        });
    }
    deleteTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            let result = yield tag_1.default
                .findByIdAndRemove(id)
                .exec()
                .catch(error => {
                ctx.throw(500, '服务器内部错误-deleteTag错误！');
            });
            ctx.success({
                msg: '删除标签成功！',
                data: result
            });
        });
    }
};
__decorate([
    router_1.Post(),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "createTag", null);
__decorate([
    router_1.Get(),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "getAllTags", null);
__decorate([
    router_1.Put(':id'),
    router_1.required({ params: 'id' }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "modifyTag", null);
__decorate([
    router_1.Delete(':id'),
    router_1.required({ params: 'id' }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "deleteTag", null);
TagController = __decorate([
    router_1.Controller('tags')
], TagController);
exports.default = TagController;
