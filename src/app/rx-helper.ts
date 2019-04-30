import * as NodeTypes from './node-types';
import { RxNode } from './node-types/rxNode';

interface OperatorsKind {
  link: string;
  name: string;
  desc: string;
  list: Array<any>;
}

export class RxHelper {
  public static operators: Array<OperatorsKind> = [
    {
      link: 'creation',
      name: 'Creating Storm Topology',
      desc: 'Operators that originate new Observables.',
      list: [
        NodeTypes.BatchSpout,
        NodeTypes.FunctionBolt,
        NodeTypes.GroupByBolt,
        NodeTypes.JoinBolt,
        NodeTypes.MergeBolt,
        NodeTypes.PersistentAggregate,
        NodeTypes.NewValuesStream,
        NodeTypes.Subscribe
      ]
    },
  ];
  public static getRxOperators() {
    return this.operators;
  }
  public static getOperatorLink(operatorName) {
    // const cate = this.operators.find((cat: any) => {
    //   return cat.list.find((nodeType: RxNode) => operatorName === nodeType.title);
    // });
    return 'http://storm.apache.org/releases/1.0.6/Trident-API-Overview.html';
  }
  constructor() {
  }
}
