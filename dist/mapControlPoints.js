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
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const utilsExcel_1 = require("./utils/utilsExcel");
const spinalTimeSeries_1 = require("./utils/spinalTimeSeries");
const orderFileDate_1 = require("./orderFileDate");
function mapControlPoints(graph) {
    return __awaiter(this, void 0, void 0, function* () {
        const geoContext = yield graph.getContext("spatial");
        const building = yield geoContext.getChildren('hasGeographicBuilding');
        const controlPointsBuildings = yield building[0].getChildren('hasControlPoints');
        for (const controlPointsBuilding of controlPointsBuildings) {
            yield initSimulator(controlPointsBuilding);
        }
        const floors = yield building[0].getChildren('hasGeographicFloor');
        for (const floor of floors) {
            const controlPointsFloors = yield floor.getChildren('hasControlPoints');
            for (const controlPointsFloor of controlPointsFloors) {
                yield initSimulator(controlPointsFloor);
            }
        }
    });
}
exports.default = mapControlPoints;
function initSimulator(controlPoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const bmsendpoints = yield controlPoint.getChildren('hasBmsEndpoint');
        for (const bmsendpoint of bmsendpoints) {
            // @ts-ignore
            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(bmsendpoint);
            const files = yield bmsendpoint.getChildren('hasFiles');
            if (files.length !== 0) {
                for (const file of files) {
                    const element = yield file.element.load();
                    for (const fileLoaded of element) {
                        const objFile = yield (0, utilsExcel_1.convertFileToJson)(fileLoaded);
                        var timeseries = yield (0, spinalTimeSeries_1.default)().getOrCreateTimeSeries(bmsendpoint.getId().get());
                        try {
                            const archive = yield timeseries.getArchive();
                            const day_1 = new Date();
                            day_1.setHours(0, 0, 0, 0);
                            day_1.setDate(day_1.getDate() - 1);
                            const archiveDay = yield archive.getArchiveAtDate(day_1);
                            // @ts-ignore
                            archiveDay.lstDate.trim(archive.initialBlockSize.get());
                            // @ts-ignore
                            archiveDay.lstValue.trim(archive.initialBlockSize.get());
                            archiveDay.length.set(0);
                        }
                        catch (error) {
                            console.log("fail archive");
                        }
                        console.log("start", bmsendpoint.info.get());
                        for (const key in objFile) {
                            if (Object.prototype.hasOwnProperty.call(objFile, key)) {
                                const element = objFile[key];
                                // @ts-ignore
                                yield (0, orderFileDate_1.default)(element, timeseries);
                                break;
                            }
                        }
                        console.log("end done");
                    }
                }
            }
        }
    });
}
//# sourceMappingURL=mapControlPoints.js.map