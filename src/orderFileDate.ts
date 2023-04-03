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
import { SpinalDateValue, SpinalTimeSeries } from 'spinal-model-timeseries';
import spinalServiceTimeSeries from './utils/spinalTimeSeries';
import config from './config';

interface ObjetExcel {
  date: number,
  value: number
}
interface NormalizedTime {
  week: number,
  day: number,
  timestamp: number,
}

export async function orderFileDate(tableau: ObjetExcel[], timeseries: SpinalTimeSeries) {
  let resultMap = new Map<number, ObjetExcel[]>()
  const date = new Date();
  const timestampSixMonthAgo = date.setMonth(date.getMonth() - config.verifMonth)
  const dateTimeseries = await timeseries.getFromIntervalTime(timestampSixMonthAgo, Date.now())
  const misingDays = generateDate(config.verifMonth, dateTimeseries);
  misingDays.forEach(item => {
    resultMap.set(item, [])
  })
  searchInTableauExcel(tableau, misingDays, resultMap);
  await consumeResult(resultMap, timeseries);


}
export default orderFileDate



async function consumeResult(resultMap: Map<number, ObjetExcel[]>, timeseries: SpinalTimeSeries) {
  const promise = []
  for (const [key, array] of resultMap) {
    if (array.length > 0) {
      resultMap.delete(key);
      for (const objectArray of array) {
        promise.push(timeseries.insert(objectArray.value, objectArray.date));
      }
    }
  }
  await Promise.all(promise)
}

function searchInTableauExcel(tableau: ObjetExcel[], misingDays: number[], resultMap: Map<number, ObjetExcel[]>) {
  const misingDaysNormalized: NormalizedTime[] = misingDays.map(day => {
    return { week: getWeek(day), day: (new Date(day)).getDay(), timestamp: day }
  })
  for (const misingDay of misingDaysNormalized) {
    let resultFindInTableau = tableau.filter(obj => {
      if (obj.value === 0 || isNaN(obj.value)) {
        return false
      }
      const week = getWeek(obj.date);
      const day = (new Date(obj.date)).getDay();
      return week === misingDay.week && day === misingDay.day
    })
    let index = 1
    while (resultFindInTableau.length === 0 && index < 10) {
      resultFindInTableau = tableau.filter(obj => {
        if (obj.value === 0 || isNaN(obj.value)) {
          return false
        }
        const week = getWeek(obj.date);
        const day = (new Date(obj.date)).getDay();
        return week === (misingDay.week - index) && day === misingDay.day
      })

      if (resultFindInTableau.length === 0) {
        resultFindInTableau = tableau.filter(obj => {
          if (obj.value === 0 || isNaN(obj.value)) {
            return false
          }
          const week = getWeek(obj.date);
          const day = (new Date(obj.date)).getDay();
          return week === (misingDay.week + index) && day === misingDay.day
        })
      }
      index++
    }

    if (resultFindInTableau.length > 0) {
      for (const result of resultFindInTableau) {
        const array = resultMap.get(misingDay.timestamp);
        const res = new Date(misingDay.timestamp)
        const tmp = new Date(result.date)
        res.setHours(tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds())
        array.push({ date: res.getTime(), value: result.value });
      }
    }
  }
}



function generateDate(nbMonths: number, dateTimeseries: SpinalDateValue[]) {
  let resultTab: number[] = []
  const date = new Date();
  date.setMonth(date.getMonth() - nbMonths);
  date.setHours(0, 0, 0, 0);
  while (date.getTime() <= Date.now()) {
    let found = false
    for (const dateTimeserie of dateTimeseries) {
      if (dateTimeserie.value === 0 || isNaN(dateTimeserie.value)) {
        continue;
      }
      const timeDaySerie = new Date(dateTimeserie.date)
      timeDaySerie.setHours(0, 0, 0, 0);
      if (timeDaySerie.getTime() === date.getTime()) {
        found = true
        break;
      }
    }
    if (found === false) {
      resultTab.push(date.getTime())
    }
    date.setDate(date.getDate() + 1)
  }
  return resultTab
}





function getWeek(timestamp: number) {
  var date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getDay() + 6) % 7) / 7)
    ;
}