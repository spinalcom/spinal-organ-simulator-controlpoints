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
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    spinalConnector: {
        protocol: process.env.SPINALHUB_PROTOCOL,
        user: process.env.SPINAL_USER_ID || 168,
        password: process.env.SPINAL_PASSWORD,
        host: process.env.SPINALHUB_IP,
        port: process.env.SPINALHUB_PORT, // port
    },
    file: {
        // path to a digital twin in spinalhub filesystem
        path: process.env.SPINAL_DTWIN_PATH,
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map