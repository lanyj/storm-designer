import { PropertyType } from './property-type';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Operator } from '../operator';
import { NumberInfo } from '../scene/number-info';
import { DiagramNode } from '../scene/diagram-node';
import resultAnimator from '../scene/result-animator';
import { Result } from '../scene/result';
import { Alert } from 'selenium-webdriver';

export class RxNode implements Operator {
  protected static title: string;
  protected static link: string;
  protected static desc: string;
  protected static maxInput: number;
  protected static minInput: number;

  protected static propertiesType: PropertyType;

  private static cntr = 1;

  public rxo: any;
  public level: any;
  public rx: any;
  public properties: Object;
  public graphInputs: Array<any>;
  public runner;
  public data: RxNode;

  get title(): string {
    return (<typeof RxNode>this.constructor).title;
  }
  get maxInput(): number {
    return (<typeof RxNode>this.constructor).maxInput;
  }
  get minInput(): number {
    return (<typeof RxNode>this.constructor).minInput;
  }
  get link(): string { return (<typeof RxNode>this.constructor).link; }
  get desc(): string { return (<typeof RxNode>this.constructor).desc; }
  get propertiesType(): PropertyType {
    return (<typeof RxNode>this.constructor).propertiesType;
  }

  public run(node: DiagramNode, level) {
    const res = this.runner();
    this.rx = res.pipe(map((x: NumberInfo | any) => {

      let xx: NumberInfo;
      let timeoutStep = 1;

      if (!x.hasOwnProperty("__number_info")) {
        xx = <NumberInfo>{ __number_info: true, x: x.x, id: RxNode.cntr++, data: x.fields };
      } else {
        xx = JSON.parse(JSON.stringify(x));
        if (node.data.title === 'JoinBolt') {
          xx.id = RxNode.cntr++;
          timeoutStep = level;
        }
      }
      resultAnimator.add(<Result>{ node, numberInfo: xx, timeoutStep, });
      return xx;
    }));
    this.level = level;
  }

  public dispose() {
    if (this.rxo) {
      if (this.rxo.unsubscribe) {
        this.rxo.unsubscribe();
      }
      this.rxo = undefined;
    }
    if (this.rx) {
      this.rx = undefined;
    }
  }

  public copy(x) {
    return JSON.parse(JSON.stringify(x));
  }

  public areInputsReady(nodeInputs) {
    return nodeInputs.length <= this.maxInput &&
      nodeInputs.length >= this.minInput &&
      nodeInputs.every(n => n.data.rx);
  }

  public stringSplitToArray(str: string): string[] {
    let res = [];
    this.addFieldsToArray(str.split(",").map(x => x.trim()).filter(x => x.length > 0), res);
    return res;
  }

  public hasFieldInArray(field: string, fieldArray: string[]): boolean {
    return !!fieldArray.find(x => x === field);
  }

  public addFieldToArray(field: string, fieldArray: string[]) {
    if (!this.hasFieldInArray(field, fieldArray)) {
      fieldArray.push(field);
    }
  }

  public addFieldsToArray(fieldSrc: string[], fieldDst: string[]) {
    fieldSrc.forEach(x => {
      this.addFieldToArray(x, fieldDst);
    })
  }

  public fieldNotFound(field: string, fieldArray: string[]) {
    alert(this.title + ": field '" + field + "' not found in [" + fieldArray + "]");
  }

  public checkInputField(fieldNeed: string[], fieldInput: string[]) {
    fieldNeed.forEach(x => {
      if (!this.hasFieldInArray(x, fieldInput)) {
        this.fieldNotFound(x, fieldInput);
        throw this.title + ": field '" + x + "' not found in [" + fieldInput + "]";
      }
    })
  }
}
