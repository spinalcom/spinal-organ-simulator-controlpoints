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

import { SpinalExcelManager } from 'spinal-env-viewer-plugin-excel-manager-service';

const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');
const protocol = process.env.SPINALHUB_PROTOCOL
const host = process.env.SPINALHUB_IP
const port = process.env.SPINALHUB_PORT

export function convertFileToJson(file) {
  return new Promise((resolve, reject) => {
    file.load((argPath) => {
      const p = `${__dirname}/${argPath._server_id}.xlsx`;
      const f = fs.createWriteStream(p);

      http.get(`${protocol}://${host}:${port}/sceen/_?u=${argPath._server_id}`, function (response) {
        response.pipe(f);
        response.on('end', async () => {
          f.end();
        })
        f.on('finish', async () => {
          const dataJson = await SpinalExcelManager.convertExcelToJson(p);
          // console.log(dataJson);
          fs.unlinkSync(p);
          resolve(dataJson);
        })
      });
    }, () => reject("err"))
  });
}

