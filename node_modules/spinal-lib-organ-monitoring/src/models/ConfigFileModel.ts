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

import { Lst, Model, spinalCore, FileSystem, Str, Val, Ptr } from "spinal-core-connectorjs";


interface ILog extends Model {
  timeStamp: Val,
  message: Str
}

interface IGenericOrganData extends Model {
  name: Str,
  bootTimestamp: Val,
  lastHealthTime: Val
  ramHeapUsed: Str,
  logList: Lst<ILog>
}


interface ISpecificOrganData extends Model {
  state: Str,
  ipAdress: Str,
  port: Val,
  protocol: Str,
  lastAction: {
    message: Str,
    date: Val
  }
}
export class ConfigFileModel extends Model {
  genericOrganData: IGenericOrganData;
  specificOrganData: ISpecificOrganData;
  specificOrganConfig?: Ptr<any>
  constructor(name: string, ipAdress?: string, port?: number, protocol?: string) {
    super();
    if (FileSystem._sig_server === false) return;
    this.add_attr({
      genericOrganData: {
        name: name,
        bootTimestamp: Date.now(),
        lastHealthTime: Date.now(),
        ramHeapUsed: "",
        logList: [],
      },
      specificOrganData: {
        state: "",
        ipAdress: ipAdress,
        port: port,
        protocol: protocol,
        lastAction: {
          message: "connected",
          date: Date.now()
        }
      },
    });
    this.updateRamUsage();
  }

  public addToConfigFileModel(): Lst {
    var fileLst = new Lst();
    this.data.add_attr(fileLst)
    return fileLst;
  }
  public updateRamUsage() {
    const used = process.memoryUsage();
    this.genericOrganData.ramHeapUsed.set(`${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`)
  }
  public loadConfigModel() {
    if (typeof this.specificOrganConfig === "undefined") {
      return undefined
    } else {
      return this.specificOrganConfig.load()
    }
  }
  public setConfigModel(model: Model) {
    this.add_attr("specificOrganConfig", new Ptr(model))
  }
}
// @ts-ignore
spinalCore.register_models(ConfigFileModel, "ConfigFileModel");
