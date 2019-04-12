import { timer, range } from 'rxjs';
import { take, repeat } from 'rxjs/operators';

class SampleFunction {
  name: string;
  desc: string;
  func: any;
  text: string;
  constructor(name, func, text, description = '') {
    this.desc = description;
    this.func = func;
    this.text = text;
    this.name = name;
  }
}

export class SampleFunctions {
  // function types
  public static EACH = new SampleFunction('each', (x) => x, 'each function');
  public static AGGREGATOR = new SampleFunction('aggregator', (x) => x, 'aggregator function');
  public static COMBINER_AGGREGATOR = new SampleFunction('combinerAggregator', (x) => x, 'combiner aggregator function');
  public static REDUCER_AGGREGATOR = new SampleFunction('reducerAggregator', (x) => x, 'reducer aggregator function');

  // group types
  public static GroupByGlobal = new SampleFunction('global', (x) => x, 'global group');
  public static GroupByBatchGlobal = new SampleFunction('batchGlobal', (x) => x, 'batchGlobal group');
  public static GroupByShuffle = new SampleFunction('shuffle', (x) => x, 'shuffle group');
  public static GroupByLocalOrShuffle = new SampleFunction('localOrShuffle', (x) => x, 'localOrShuffle group');
  // public static GroupByFields = new SampleFunction('groupBy', (x) => x, 'group by fields group');

}
