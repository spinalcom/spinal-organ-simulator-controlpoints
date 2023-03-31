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

import { Lst, spinalCore, Model } from "spinal-core-connectorjs";
import * as path from "path";
import { ConfigFileModel } from "../models/ConfigFileModel";


class ConfigFile {
  private static instance: ConfigFile;
  private file: ConfigFileModel;

  private constructor() { }

  public static getInstance(): ConfigFile {
    if (!this.instance) this.instance = new ConfigFile();

    return this.instance;
  }

  public async init(connect: spinal.FileSystem, fileName: string, ipAdress: string, protocol: string, port: number): Promise<ConfigFileModel> {
    return this._loadOrMakeConfigFile(connect, fileName, ipAdress, protocol, port).then((file) => {
      this.file = file;
      this.file.genericOrganData.bootTimestamp.set(Date.now())
      this._scheduleReInit();
      return file;
    })
  }


  private _loadOrMakeConfigFile(connect: spinal.FileSystem, fileName: string, ipAdress: string, protocol: string, port: number): Promise<ConfigFileModel> {
    return new Promise((resolve, reject) => {
      spinalCore.load(connect, path.resolve(`/etc/Organs/${fileName}`),
        (file: ConfigFileModel) => resolve(file),
        () => connect.load_or_make_dir("/etc/Organs", (directory: spinal.Directory) => {
          resolve(this._createFile(directory, fileName, ipAdress, protocol, port));
        })
      )
    });
  }

  private _createFile(directory: spinal.Directory, fileName: string, ipAdress: string, protocol: string, port: number): ConfigFileModel {
    const file = new ConfigFileModel(fileName, ipAdress, port, protocol);
    directory.force_add_file(fileName, file, { model_type: "ConfigFile" });
    return file;
  }


  private _scheduleReInit() {
    setInterval(() => {
      this._reInitializeFileConfig()
    }, 60000)
  }
  private _reInitializeFileConfig() {
    this.file.updateRamUsage();
    this.file.genericOrganData.lastHealthTime.set(Date.now())
  }
  public getConfig() {
    return this.file.loadConfigModel();
  };
  public setConfig(obj: Model) {
    return this.file.setConfigModel(obj)
  }

  public bindState(callback: (state: string) => void) {
    this.file.specificOrganData.state.bind(() => {
      callback(this.file.specificOrganData.state.get())
    })
  }
  public setState(state: string) {
    this.file.specificOrganData.state.set(state)
  }
  public pushLog(message: string) {
    this.file.genericOrganData.logList.push({
      timeStamp: Date.now(),
      message: message
    })
  }
  public pushLastAction(message: string) {
    this.file.specificOrganData.lastAction.date.set(Date.now())
    this.file.specificOrganData.lastAction.message.set(message)
  }
}
export default ConfigFile.getInstance()  