"use strict";
/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
Object.defineProperty(exports, "__esModule", { value: true });
var spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
var utilsExcel_1 = require("./utils/utilsExcel");
var spinalTimeSeries_1 = require("./utils/spinalTimeSeries");
function mapControlPoints(graph) {
    return __awaiter(this, void 0, void 0, function () {
        var geoContext, building, controlPointsBuildings, _i, controlPointsBuildings_1, controlPointsBuilding, bmsendpoints, _a, bmsendpoints_1, bmsendpoint, files, _b, files_1, file, element, _c, element_1, fileLoaded, objFile, timeseries, _d, _e, objTabExcel;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, graph.getContext("spatial")];
                case 1:
                    geoContext = _f.sent();
                    return [4 /*yield*/, geoContext.getChildren('hasGeographicBuilding')];
                case 2:
                    building = _f.sent();
                    return [4 /*yield*/, building[0].getChildren('hasControlPoints')];
                case 3:
                    controlPointsBuildings = _f.sent();
                    _i = 0, controlPointsBuildings_1 = controlPointsBuildings;
                    _f.label = 4;
                case 4:
                    if (!(_i < controlPointsBuildings_1.length)) return [3 /*break*/, 20];
                    controlPointsBuilding = controlPointsBuildings_1[_i];
                    return [4 /*yield*/, controlPointsBuilding.getChildren('hasBmsEndpoint')];
                case 5:
                    bmsendpoints = _f.sent();
                    _a = 0, bmsendpoints_1 = bmsendpoints;
                    _f.label = 6;
                case 6:
                    if (!(_a < bmsendpoints_1.length)) return [3 /*break*/, 19];
                    bmsendpoint = bmsendpoints_1[_a];
                    // @ts-ignore
                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(bmsendpoint);
                    return [4 /*yield*/, bmsendpoint.getChildren('hasFiles')];
                case 7:
                    files = _f.sent();
                    if (!(files.length !== 0)) return [3 /*break*/, 18];
                    _b = 0, files_1 = files;
                    _f.label = 8;
                case 8:
                    if (!(_b < files_1.length)) return [3 /*break*/, 18];
                    file = files_1[_b];
                    return [4 /*yield*/, file.element.load()];
                case 9:
                    element = _f.sent();
                    _c = 0, element_1 = element;
                    _f.label = 10;
                case 10:
                    if (!(_c < element_1.length)) return [3 /*break*/, 17];
                    fileLoaded = element_1[_c];
                    return [4 /*yield*/, (0, utilsExcel_1.convertFileToJson)(fileLoaded)];
                case 11:
                    objFile = _f.sent();
                    return [4 /*yield*/, (0, spinalTimeSeries_1.default)().getOrCreateTimeSeries(bmsendpoint.getId().get())];
                case 12:
                    timeseries = _f.sent();
                    _d = 0, _e = objFile.Tableau;
                    _f.label = 13;
                case 13:
                    if (!(_d < _e.length)) return [3 /*break*/, 16];
                    objTabExcel = _e[_d];
                    return [4 /*yield*/, timeseries.insert(objTabExcel.value, objTabExcel.date)];
                case 14:
                    _f.sent();
                    _f.label = 15;
                case 15:
                    _d++;
                    return [3 /*break*/, 13];
                case 16:
                    _c++;
                    return [3 /*break*/, 10];
                case 17:
                    _b++;
                    return [3 /*break*/, 8];
                case 18:
                    _a++;
                    return [3 /*break*/, 6];
                case 19:
                    _i++;
                    return [3 /*break*/, 4];
                case 20: return [2 /*return*/];
            }
        });
    });
}
exports.default = mapControlPoints;
//# sourceMappingURL=mapControlPoints.js.map