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
exports.orderFileDate = void 0;
const config_1 = require("./config");
function orderFileDate(tableau, timeseries) {
    return __awaiter(this, void 0, void 0, function* () {
        let resultMap = new Map();
        const date = new Date();
        const timestampSixMonthAgo = date.setMonth(date.getMonth() - config_1.default.verifMonth);
        const dateTimeseries = yield timeseries.getFromIntervalTime(timestampSixMonthAgo, Date.now());
        const misingDays = generateDate(config_1.default.verifMonth, dateTimeseries);
        misingDays.forEach(item => {
            resultMap.set(item, []);
        });
        searchInTableauExcel(tableau, misingDays, resultMap);
        yield consumeResult(resultMap, timeseries);
    });
}
exports.orderFileDate = orderFileDate;
exports.default = orderFileDate;
function consumeResult(resultMap, timeseries) {
    return __awaiter(this, void 0, void 0, function* () {
        const promise = [];
        for (const [key, array] of resultMap) {
            if (array.length > 0) {
                resultMap.delete(key);
                for (const objectArray of array) {
                    promise.push(timeseries.insert(objectArray.value, objectArray.date));
                }
            }
        }
        yield Promise.all(promise);
    });
}
function searchInTableauExcel(tableau, misingDays, resultMap) {
    const misingDaysNormalized = misingDays.map(day => {
        return { week: getWeek(day), day: (new Date(day)).getDay(), timestamp: day };
    });
    for (const misingDay of misingDaysNormalized) {
        let resultFindInTableau = tableau.filter(obj => {
            if (obj.value === 0 || isNaN(obj.value)) {
                return false;
            }
            const week = getWeek(obj.date);
            const day = (new Date(obj.date)).getDay();
            return week === misingDay.week && day === misingDay.day;
        });
        let index = 1;
        while (resultFindInTableau.length === 0 && index < 10) {
            resultFindInTableau = tableau.filter(obj => {
                if (obj.value === 0 || isNaN(obj.value)) {
                    return false;
                }
                const week = getWeek(obj.date);
                const day = (new Date(obj.date)).getDay();
                return week === (misingDay.week - index) && day === misingDay.day;
            });
            if (resultFindInTableau.length === 0) {
                resultFindInTableau = tableau.filter(obj => {
                    if (obj.value === 0 || isNaN(obj.value)) {
                        return false;
                    }
                    const week = getWeek(obj.date);
                    const day = (new Date(obj.date)).getDay();
                    return week === (misingDay.week + index) && day === misingDay.day;
                });
            }
            index++;
        }
        if (resultFindInTableau.length > 0) {
            for (const result of resultFindInTableau) {
                const array = resultMap.get(misingDay.timestamp);
                const res = new Date(misingDay.timestamp);
                const tmp = new Date(result.date);
                res.setHours(tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds());
                array.push({ date: res.getTime(), value: result.value });
            }
        }
    }
}
function generateDate(nbMonths, dateTimeseries) {
    let resultTab = [];
    const date = new Date();
    date.setMonth(date.getMonth() - nbMonths);
    date.setHours(0, 0, 0, 0);
    while (date.getTime() <= Date.now()) {
        let found = false;
        for (const dateTimeserie of dateTimeseries) {
            if (dateTimeserie.value === 0 || isNaN(dateTimeserie.value)) {
                continue;
            }
            const timeDaySerie = new Date(dateTimeserie.date);
            timeDaySerie.setHours(0, 0, 0, 0);
            if (timeDaySerie.getTime() === date.getTime()) {
                found = true;
                break;
            }
        }
        if (found === false) {
            resultTab.push(date.getTime());
        }
        date.setDate(date.getDate() + 1);
    }
    return resultTab;
}
function getWeek(timestamp) {
    var date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}
//# sourceMappingURL=orderFileDate.js.map