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

import { SpinalGraph, SpinalGraphService } from "spinal-env-viewer-graph-service";
import { convertFileToJson } from "./utils/utilsExcel";
import spinalServiceTimeSeries from './utils/spinalTimeSeries';

async function mapControlPoints(graph: SpinalGraph<any>) {
  const geoContext = await graph.getContext("spatial");
  const building = await geoContext.getChildren('hasGeographicBuilding');
  const controlPointsBuildings = await building[0].getChildren('hasControlPoints');
  for (const controlPointsBuilding of controlPointsBuildings) {
    const bmsendpoints = await controlPointsBuilding.getChildren('hasBmsEndpoint');
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
            // @ts-ignore
            for (const objTabExcel of objFile.Tableau) {
              await timeseries.insert(objTabExcel.value, objTabExcel.date)
            }
          }
        }
      }



    }
  }

}

export default mapControlPoints