"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tagSchema = new Schema({
    name: {
        type: String,
        default: '',
    },
});
exports.default = mongoose.model('tag', tagSchema);
