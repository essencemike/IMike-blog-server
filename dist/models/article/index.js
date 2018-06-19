"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
moment.locale('zh-cn');
const articleSchema = new Schema({
    title: String,
    content: String,
    abstract: String,
    publish: {
        type: Boolean,
        default: false,
    },
    createTime: {
        type: Date,
        default: Date.now,
    },
    lastEditTime: {
        type: Date,
        default: Date.now,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'tag' }],
});
articleSchema.set('toJSON', { getters: true, virtuals: true });
articleSchema.set('toObject', { getters: true, virtuals: true });
articleSchema.path('createTime').get((v) => moment(v).format('YYYY-MM-DD HH:mm:ss'));
articleSchema.path('lastEditTime').get((v) => moment(v).format('YYYY-MM-DD HH:mm:ss'));
exports.default = mongoose.model('article', articleSchema);
