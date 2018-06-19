"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
function init(config) {
    mongoose.Promise = global.Promise;
    const mongoUrl = `mongodb://${config.host}:${config.port}/${config.database}`;
    mongoose.connect(mongoUrl);
    const db = mongoose.connection;
    db.on('error', () => {
        console.log(`Unable to connect to database: ${config.host}: ${config.port}`);
    });
    db.once('open', () => {
        console.log(`Connected to database: ${config.host}: ${config.port}`);
    });
}
exports.init = init;
