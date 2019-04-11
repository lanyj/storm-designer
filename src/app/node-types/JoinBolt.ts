import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { PropertyType } from './property-type';
import { PropertyTypeEnum } from './propertyType.enum';
import { RxNode } from './rxNode';
import { NumberInfo } from '../scene/number-info';

export class JoinBolt extends RxNode {
  protected static title = 'JoinBolt';
  protected static desc = 'join stream';
  protected static maxInput = 2;
  protected static minInput = 2;

  protected static propertiesType = new PropertyType('config', PropertyTypeEnum.Object, [
    new PropertyType('inputFieldsA', PropertyTypeEnum.String),
    new PropertyType('inputFieldsB', PropertyTypeEnum.String),
    new PropertyType('outputFields', PropertyTypeEnum.String)
  ], '');

  public properties = {
    inputFieldsA: '',
    inputFieldsB: '',
    outputFields: ''
  };

  public graphInputs = [];

  public runner = () => {
    let inputFieldsA = this.stringSplitToArray(this.properties.inputFieldsA);
    let inputFieldsB = this.stringSplitToArray(this.properties.inputFieldsB);
    let outputFields = this.stringSplitToArray(this.properties.outputFields);
    return zip(...this.graphInputs.map(gi => gi.observable), (...val: NumberInfo[]) => {
      let x1 = val[0];
      let x2 = val[1];
      this.checkInputField(inputFieldsA, x1.data);
      this.checkInputField(inputFieldsB, x2.data);

      let x = this.copy(x1);
      x.x = x1.x + "," + x2.x;
      x.data = [];
      this.addFieldsToArray(outputFields, x.data);
      return x;
    });
  }
  public toString = () => {
    return `.join(inputFieldsA: [${this.properties.inputFieldsA}], inputFieldsB: [${this.properties.inputFieldsB}], outputFields: [${this.properties.outputFields}])`;
  }
}
