"use strict";
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
const spinal_lib_organ_monitoring_1 = require("spinal-lib-organ-monitoring");
const spinalMiddelware_1 = require("./spinalMiddelware");
const mapControlPoints_1 = require("./mapControlPoints");
const CronJob = require('cron').CronJob;
function initSpinalHub() {
    return __awaiter(this, void 0, void 0, function* () {
        const spinalAPIMiddleware = spinalMiddelware_1.default.getInstance();
        yield spinalAPIMiddleware.getGraph();
        console.log('graph loaded successfully.');
        return spinalAPIMiddleware;
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const spinalAPIMiddleware = yield initSpinalHub();
        const graph = yield spinalAPIMiddleware.getGraph();
        yield (0, mapControlPoints_1.default)(graph);
        spinal_lib_organ_monitoring_1.default.init(spinalAPIMiddleware.conn, process.env.ORGAN_NAME + "-config", process.env.SPINALHUB_IP, process.env.SPINALHUB_PROTOCOL, parseInt(process.env.REQUESTS_PORT));
    });
}
init();
const job = new CronJob('0 3 * * *', function () {
    init();
}, null, true, 'Europe/Paris');
//# sourceMappingURL=index.js.map