"use strict";
/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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
exports.convertFileToJson = void 0;
const spinal_env_viewer_plugin_excel_manager_service_1 = require("spinal-env-viewer-plugin-excel-manager-service");
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');
const protocol = process.env.SPINALHUB_PROTOCOL;
const host = process.env.SPINALHUB_IP;
const port = process.env.SPINALHUB_PORT;
function convertFileToJson(file) {
    return new Promise((resolve, reject) => {
        file.load((argPath) => {
            const p = `${__dirname}/${argPath._server_id}.xlsx`;
            const f = fs.createWriteStream(p);
            http.get(`${protocol}://${host}:${port}/sceen/_?u=${argPath._server_id}`, function (response) {
                response.pipe(f);
                response.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    f.end();
                }));
                f.on('finish', () => __awaiter(this, void 0, void 0, function* () {
                    const dataJson = yield spinal_env_viewer_plugin_excel_manager_service_1.SpinalExcelManager.convertExcelToJson(p);
                    fs.unlinkSync(p);
                    resolve(dataJson);
                }));
            });
        }, () => reject("err"));
    });
}
exports.convertFileToJson = convertFileToJson;
//# sourceMappingURL=utilsExcel.js.map