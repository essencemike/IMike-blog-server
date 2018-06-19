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
const article_1 = require("../models/article");
const router_1 = require("../middlewares/router");
let ArticleController = class ArticleController {
    createArticle(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, publish, tags, abstract } = ctx.request.body;
            const createTime = new Date();
            const lastEditTime = new Date();
            if (!title) {
                ctx.throw(400, '标题不能为空！');
            }
            if (!content) {
                ctx.throw(400, '内容不能为空！');
            }
            if (!abstract) {
                ctx.throw(400, '摘要不能为空！');
            }
            const article = new article_1.default({
                title,
                content,
                abstract,
                publish,
                createTime,
                lastEditTime,
                tags
            });
            let result = yield article.save().catch(error => {
                ctx.throw(500, '服务器内部错误-数据存储错误！');
            });
            yield article.populate('tags').execPopulate().catch(() => {
                ctx.throw(500, '服务器内部错误-数据populate错误！');
            });
            ctx.success({
                msg: '文章创建成功！',
                data: result
            });
        });
    }
    getArticleById(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            let result = yield article_1.default.findById(id).catch(error => {
                ctx.throw(500, '服务器内部错误-数据查找错误！');
            });
            ctx.success({
                msg: '查询成功！',
                data: result
            });
        });
    }
    ifPublishArticle(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            const publish = ctx.request.body.publish;
            if (publish !== true && publish !== false) {
                ctx.throw(400, 'publish字段不能为除true和false之外的值！');
            }
            let result = yield article_1.default.findByIdAndUpdate(id, {
                publish
            }, {
                new: true
            }).exec().catch(error => {
                ctx.throw(500, '服务器内部错误-updatePublish错误！');
            });
            ctx.success({
                msg: '更新publish成功！',
                data: result
            });
        });
    }
    deleteArticleById(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = ctx.params.id;
            let result = yield article_1.default.findByIdAndRemove(id).exec().catch(error => {
                ctx.throw(500, '服务器内部错误-findByIdAndRemove错误！');
            });
            ctx.success({
                msg: '删除文章成功！',
                data: result
            });
        });
    }
    modifyArticle(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, content, tags, abstract } = ctx.request.body;
            if (!title) {
                ctx.throw(400, '标题不能为空！');
            }
            if (!content) {
                ctx.throw(400, '内容不能为空！');
            }
            if (!abstract) {
                ctx.throw(400, '摘要不能为空！');
            }
            const lastEditTime = new Date();
            const id = ctx.params.id;
            let result = yield article_1.default.findByIdAndUpdate(id, {
                title,
                content,
                abstract,
                tags,
                lastEditTime,
            }, { new: true }).populate('tags').exec().catch(error => {
                ctx.throw(500, '服务器内部错误-findByIdAndUpdate错误！');
            });
            ctx.success({
                msg: '修改成功！',
                data: result
            });
        });
    }
    getAllArticles(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let tagId = ctx.query.tag;
            let page = +ctx.query.page;
            let limit = +ctx.query.limit || 5;
            if (page <= 0) {
                page = 1;
            }
            let result, total;
            if (tagId) {
                result = yield article_1.default.find({
                    tags: tagId
                }).populate('tags').exec().catch(error => {
                    ctx.throw(500, '内部服务器错误-根据标签查询文档错误！');
                });
            }
            else if (page && limit) {
                result = yield article_1.default
                    .find()
                    .sort({ 'createTime': -1 })
                    .skip(limit * (page - 1))
                    .limit(limit)
                    .populate('tags')
                    .exec()
                    .catch(error => {
                    ctx.throw(500, '服务器内部错误-分页查找错误！');
                });
                total = yield article_1.default
                    .count({})
                    .exec()
                    .catch(() => {
                    ctx.throw(500, '服务器内部错误-总数查询错误！');
                });
            }
            else {
                result = yield article_1.default
                    .find()
                    .sort({ 'createTime': -1 })
                    .populate('tags')
                    .exec()
                    .catch(error => {
                    ctx.throw(500, '服务器内部错误-查找所有文章错误！');
                });
            }
            ctx.success({
                msg: '查询文章成功！',
                data: result,
                total
            });
        });
    }
    getAllPublishedArticles(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let tagId = ctx.query.tag;
            let page = +ctx.query.page;
            let limit = +ctx.query.limit || 5;
            if (page <= 0) {
                page = 1;
            }
            let result, total;
            if (tagId) {
                result = yield article_1.default
                    .find({
                    tags: tagId,
                    publish: true
                })
                    .populate('tags')
                    .exec()
                    .catch(err => {
                    ctx.throw(500, '服务器内部错误-根据标签查询文档错误!');
                });
            }
            else if (page && limit) {
                result = yield article_1.default
                    .find({
                    publish: true
                })
                    .sort({ 'createTime': -1 })
                    .skip(limit * (page - 1))
                    .limit(limit)
                    .populate('tags')
                    .exec()
                    .catch(err => {
                    ctx.throw(500, '服务器内部错误-分页查找错误!');
                });
                total = yield article_1.default
                    .count({})
                    .exec()
                    .catch(err => {
                    ctx.throw(500, '服务器内部错误-总数查询错误!');
                });
            }
            else {
                result = yield article_1.default
                    .find({
                    publish: true
                })
                    .sort({ 'createTime': -1 })
                    .populate('tags')
                    .exec()
                    .catch(err => {
                    ctx.throw(500, '服务器内部错误-查找所有文章错误!');
                });
            }
            ctx.success({
                msg: '查询发布的文章成功！',
                data: result,
                total
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
], ArticleController.prototype, "createArticle", null);
__decorate([
    router_1.Get(':id'),
    router_1.required({ params: 'id' }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getArticleById", null);
__decorate([
    router_1.Put(':id'),
    router_1.required({ params: 'id' }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "ifPublishArticle", null);
__decorate([
    router_1.Delete(':id'),
    router_1.required({ params: 'id' }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "deleteArticleById", null);
__decorate([
    router_1.Put(':id'),
    router_1.required({ params: 'id' }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "modifyArticle", null);
__decorate([
    router_1.Get(),
    router_1.required({ query: ['tag', 'page', 'limit'] }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getAllArticles", null);
__decorate([
    router_1.Get('published'),
    router_1.required({ query: ['tag', 'page', 'limit'] }),
    router_1.log,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getAllPublishedArticles", null);
ArticleController = __decorate([
    router_1.Controller('articles')
], ArticleController);
exports.default = ArticleController;
