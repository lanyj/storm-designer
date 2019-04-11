import { map, tap } from 'rxjs/operators';
import { PropertyType } from './property-type';
import { PropertyTypeEnum } from './propertyType.enum';
import { RxNode } from './rxNode';
import { merge, of, pipe } from 'rxjs';
import { NumberInfo } from '../scene/number-info';

export class MergeBolt extends RxNode {
  protected static title = 'MergeBolt';
  protected static desc = 'merge streams';
  protected static maxInput = 300;
  protected static minInput = 2;

  protected static propertiesType = new PropertyType('config', PropertyTypeEnum.Object, [
    new PropertyType('fields', PropertyTypeEnum.String)
  ], '');

  public properties = {
    fields: ''
  };
  public graphInputs = [];

  public runner = () => {
    let outputFields = this.stringSplitToArray(this.properties.fields);
    return merge(...this.graphInputs.map(gi => gi.observable.pipe(map((x: NumberInfo) => {
      x.data = [];
      this.addFieldsToArray(outputFields, x.data);
      return x;
    }))));
  }
  public toString = () => {
    return `.merge(fields: [${this.properties.fields}])`;
  }
}
