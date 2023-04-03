import { SpinalTimeSeries } from 'spinal-model-timeseries';
interface ObjetExcel {
    date: number;
    value: number;
}
export declare function orderFileDate(tableau: ObjetExcel[], timeseries: SpinalTimeSeries): Promise<void>;
export default orderFileDate;
