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

import { SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";
import { convertFileToJson } from "./utils/utilsExcel";
import spinalServiceTimeSeries from './utils/spinalTimeSeries';
import orderFileDate from "./orderFileDate";

async function mapControlPoints(graph: SpinalGraph<any>) {
  const geoContext = await graph.getContext("spatial");
  const building = await geoContext.getChildren('hasGeographicBuilding');
  const controlPointsBuildings = await building[0].getChildren('hasControlPoints');
  for (const controlPointsBuilding of controlPointsBuildings) {
    await initSimulator(controlPointsBuilding);
  }
  const floors = await building[0].getChildren('hasGeographicFloor');
  for (const floor of floors) {
    const controlPointsFloors = await floor.getChildren('hasControlPoints');
    for (const controlPointsFloor of controlPointsFloors) {
      await initSimulator(controlPointsFloor);
    }
  }
}
export default mapControlPoints

async function initSimulator(controlPoint: SpinalNode) {
  const bmsendpoints = await controlPoint.getChildren('hasBmsEndpoint');
  for (const bmsendpoint of bmsendpoints) {
    // @ts-ignore
    SpinalGraphService._addNode(bmsendpoint);
    const files = await bmsendpoint.getChildren('hasFiles');
    if (files.length !== 0) {
      for (const file of files) {
        const element = await file.element.load();
        for (const fileLoaded of element) {
          const objFile = await convertFileToJson(fileLoaded);
          var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(bmsendpoint.getId().get());
          try {
            const archive = await timeseries.getArchive();
            const day_1 = new Date();
            day_1.setHours(0, 0, 0, 0);
            day_1.setDate(day_1.getDate() - 1);
            const archiveDay = await archive.getArchiveAtDate(day_1);
            // @ts-ignore
            archiveDay.lstDate.trim(archive.initialBlockSize.get());
            // @ts-ignore
            archiveDay.lstValue.trim(archive.initialBlockSize.get());
            archiveDay.length.set(0);
          } catch (error) {
            console.log("fail archive");
          }
          console.log("start", bmsendpoint.info.get());
          for (const key in objFile) {
            if (Object.prototype.hasOwnProperty.call(objFile, key)) {
              const element = objFile[key];
              // @ts-ignore
              await orderFileDate(element, timeseries);
              break;
            }
          }
          console.log("end done");
        }
      }
    }
  }
}
