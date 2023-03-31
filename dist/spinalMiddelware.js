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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var config_1 = require("./config");
var spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
var SpinalAPIMiddleware = /** @class */ (function () {
    function SpinalAPIMiddleware() {
        this.iteratorGraph = this.geneGraph();
        this.loadedPtr = new Map();
        // connection string to connect to spinalhub
        var protocol = config_1.default.spinalConnector.protocol
            ? config_1.default.spinalConnector.protocol
            : 'http';
        var host = config_1.default.spinalConnector.host +
            (config_1.default.spinalConnector.port ? ":".concat(config_1.default.spinalConnector.port) : '');
        var login = "".concat(config_1.default.spinalConnector.user, ":").concat(config_1.default.spinalConnector.password);
        var connect_opt = "".concat(protocol, "://").concat(login, "@").concat(host, "/");
        console.log("start connect to hub: ".concat(protocol, "://").concat(host, "/"));
        // initialize the connection
        this.conn = spinal_core_connectorjs_type_1.spinalCore.connect(connect_opt);
        // get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2
        // callback function.
    }
    // singleton class
    SpinalAPIMiddleware.getInstance = function () {
        if (SpinalAPIMiddleware.instance === null) {
            SpinalAPIMiddleware.instance = new SpinalAPIMiddleware();
        }
        return SpinalAPIMiddleware.instance;
    };
    SpinalAPIMiddleware.prototype.geneGraph = function () {
        return __asyncGenerator(this, arguments, function geneGraph_1() {
            var init, graph;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        init = new Promise(function (resolve, reject) {
                            spinal_core_connectorjs_type_1.spinalCore.load(_this.conn, config_1.default.file.path, function (graph) {
                                spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(graph)
                                    .then(function () {
                                    resolve(graph);
                                })
                                    .catch(function (e) {
                                    console.error(e);
                                    reject();
                                });
                            }, function () {
                                console.error("File does not exist in location ".concat(config_1.default.file.path));
                                reject();
                            });
                        });
                        return [4 /*yield*/, __await(init)];
                    case 1:
                        graph = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 5];
                        return [4 /*yield*/, __await(graph)];
                    case 3: return [4 /*yield*/, _a.sent()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // called if connected to the server and if the spinalhub sent us the Model
    SpinalAPIMiddleware.prototype.getGraph = function () {
        return __awaiter(this, void 0, void 0, function () {
            var g;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.iteratorGraph.next()];
                    case 1:
                        g = _a.sent();
                        return [2 /*return*/, g.value];
                }
            });
        });
    };
    SpinalAPIMiddleware.prototype.load = function (server_id) {
        var _this = this;
        if (!server_id) {
            return Promise.reject('Invalid serverId');
        }
        if (typeof spinal_core_connectorjs_type_1.FileSystem._objects[server_id] !== 'undefined') {
            // @ts-ignore
            return Promise.resolve(spinal_core_connectorjs_type_1.FileSystem._objects[server_id]);
        }
        return new Promise(function (resolve, reject) {
            _this.conn.load_ptr(server_id, function (model) {
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
    };
    SpinalAPIMiddleware.prototype.loadPtr = function (ptr) {
        var _this = this;
        if (ptr instanceof spinal_core_connectorjs_type_1.spinalCore._def['File'])
            return this.loadPtr(ptr._ptr);
        var server_id = ptr.data.value;
        if (this.loadedPtr.has(server_id)) {
            return this.loadedPtr.get(server_id);
        }
        var prom = new Promise(function (resolve, reject) {
            try {
                _this.conn.load_ptr(server_id, function (model) {
                    if (!model) {
                        reject(new Error("LoadedPtr Error server_id: '".concat(server_id, "'")));
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
    };
    SpinalAPIMiddleware.instance = null;
    return SpinalAPIMiddleware;
}());
exports.default = SpinalAPIMiddleware;
//# sourceMappingURL=spinalMiddelware.js.map