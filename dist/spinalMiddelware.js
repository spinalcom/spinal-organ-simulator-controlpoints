"use strict";
/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
class SpinalAPIMiddleware {
    // singleton class
    static getInstance() {
        if (SpinalAPIMiddleware.instance === null) {
            SpinalAPIMiddleware.instance = new SpinalAPIMiddleware();
        }
        return SpinalAPIMiddleware.instance;
    }
    constructor() {
        this.iteratorGraph = this.geneGraph();
        this.loadedPtr = new Map();
        // connection string to connect to spinalhub
        const protocol = config_1.default.spinalConnector.protocol
            ? config_1.default.spinalConnector.protocol
            : 'http';
        const host = config_1.default.spinalConnector.host +
            (config_1.default.spinalConnector.port ? `:${config_1.default.spinalConnector.port}` : '');
        const login = `${config_1.default.spinalConnector.user}:${config_1.default.spinalConnector.password}`;
        const connect_opt = `${protocol}://${login}@${host}/`;
        console.log(`start connect to hub: ${protocol}://${host}/`);
        // initialize the connection
        this.conn = spinal_core_connectorjs_type_1.spinalCore.connect(connect_opt);
        // get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2
        // callback function.
    }
    geneGraph() {
        return __asyncGenerator(this, arguments, function* geneGraph_1() {
            const init = new Promise((resolve, reject) => {
                spinal_core_connectorjs_type_1.spinalCore.load(this.conn, config_1.default.file.path, (graph) => {
                    spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(graph)
                        .then(() => {
                        resolve(graph);
                    })
                        .catch((e) => {
                        console.error(e);
                        reject();
                    });
                }, () => {
                    console.error(`File does not exist in location ${config_1.default.file.path}`);
                    reject();
                });
            });
            const graph = yield __await(init);
            while (true) {
                yield yield __await(graph);
            }
        });
    }
    // called if connected to the server and if the spinalhub sent us the Model
    getGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            const g = yield this.iteratorGraph.next();
            return g.value;
        });
    }
    load(server_id) {
        if (!server_id) {
            return Promise.reject('Invalid serverId');
        }
        if (typeof spinal_core_connectorjs_type_1.FileSystem._objects[server_id] !== 'undefined') {
            // @ts-ignore
            return Promise.resolve(spinal_core_connectorjs_type_1.FileSystem._objects[server_id]);
        }
        return new Promise((resolve, reject) => {
            this.conn.load_ptr(server_id, (model) => {
                if (!model) {
                    // on error
                    reject('loadptr failed...!');
                }
                else {
                    // on success
                    resolve(model);
                }
            });
        });
    }
    loadPtr(ptr) {
        if (ptr instanceof spinal_core_connectorjs_type_1.spinalCore._def['File'])
            return this.loadPtr(ptr._ptr);
        const server_id = ptr.data.value;
        if (this.loadedPtr.has(server_id)) {
            return this.loadedPtr.get(server_id);
        }
        const prom = new Promise((resolve, reject) => {
            try {
                this.conn.load_ptr(server_id, (model) => {
                    if (!model) {
                        reject(new Error(`LoadedPtr Error server_id: '${server_id}'`));
                    }
                    else {
                        resolve(model);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
        this.loadedPtr.set(server_id, prom);
        return prom;
    }
}
SpinalAPIMiddleware.instance = null;
exports.default = SpinalAPIMiddleware;
//# sourceMappingURL=spinalMiddelware.js.map