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
import ConfigFile from "spinal-lib-organ-monitoring";
import SpinalAPIMiddleware from "./spinalMiddelware";
import mapControlPoints from "./mapControlPoints";
import { SpinalGraph } from "spinal-env-viewer-graph-service";

async function initSpinalHub() {
  const spinalAPIMiddleware = SpinalAPIMiddleware.getInstance();
  await spinalAPIMiddleware.getGraph();
  console.log('graph loaded successfully.');
  return spinalAPIMiddleware;
}
async function init() {
  const spinalAPIMiddleware = await initSpinalHub();
  const graph: SpinalGraph<any> = await spinalAPIMiddleware.getGraph()
  await mapControlPoints(graph);
  ConfigFile.init(spinalAPIMiddleware.conn, process.env.ORGAN_NAME + "-config", process.env.SPINALHUB_IP, process.env.SPINALHUB_PROTOCOL, parseInt(process.env.REQUESTS_PORT));
}

init();
