"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    createTime: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose.model('user', userSchema);
