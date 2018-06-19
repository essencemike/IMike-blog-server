"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const http = require("http");
const bodyParser = require("koa-bodyparser");
const kcors = require("kcors");
const chalk_1 = require("chalk");
const moment = require("moment");
const Route_1 = require("./middlewares/router/Route");
const errorHandle_1 = require("./middlewares/errorHandle");
const response_1 = require("./middlewares/response");
const initAdmin_1 = require("./middlewares/initAdmin");
const Database = require("./lib/db");
const app = new Koa();
const router = new Route_1.Route(app);
class Server {
    constructor(config) {
        this.app = app;
        this.server = http.createServer(this.app.callback());
        this.config = config;
        this.router = router;
        this.init();
    }
    init() {
        Database.init(this.config.mongo);
        this.app.use(bodyParser());
        this.app.use(kcors());
        this.app.use(response_1.default);
        this.app.use(errorHandle_1.default);
        this.app.use(initAdmin_1.default);
        this.router.registerRouters(`${__dirname}/controllers`, { secret: this.config.jwt.secret, key: this.config.jwt.key });
    }
    start() {
        this.server.listen(this.config.port, () => {
            console.log(`[${chalk_1.default.grey(moment().format('HH:mm:ss'))}] ${chalk_1.default.blue('Mock Server is running on port:')} ${chalk_1.default.cyan(`${this.config.port}`)}`);
        });
    }
}
exports.Server = Server;
