"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const glob = require("glob");
const path = require("path");
const jwt = require("koa-jwt");
const auth_1 = require("../../lib/auth");
const config_1 = require("../../config");
const router = new Router({
    prefix: config_1.default.app.routerBase,
});
exports.symbolRoutePrefix = Symbol('routePrefix');
class Route {
    constructor(app) {
        this.app = app;
        this.router = router;
    }
    registerRouters(controllerDir, jwtOpts) {
        glob.sync(path.join(controllerDir, './**/*')).forEach(item => require(item));
        let unlessPath = [];
        Route.__DecoratedRouters.forEach((controller, config) => {
            let controllers = Array.isArray(controller) ? controller : [controller];
            let prefixPath = config.target[exports.symbolRoutePrefix];
            let path = config.path;
            if (prefixPath && (!prefixPath.startsWith('/'))) {
                prefixPath = `/${prefixPath}`;
            }
            if (path && !path.startsWith('/')) {
                path = `/${path}`;
            }
            let routerPath = prefixPath + path;
            if (config.unless) {
                unlessPath.push(routerPath);
            }
            controllers.forEach((controller) => this.router[config.method](routerPath, controller));
        });
        this.app.use(jwt({ secret: jwtOpts.secret, key: jwtOpts.key, isRevoked: auth_1.verifyToken, debug: true, passthrough: true }).unless({ path: unlessPath }));
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    }
}
Route.__DecoratedRouters = new Map();
exports.Route = Route;
