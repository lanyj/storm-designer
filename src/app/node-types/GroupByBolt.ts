import { map } from 'rxjs/operators';
import { NumberInfo } from '../scene/number-info';
import { PropertyType } from './property-type';
import { PropertyTypeEnum } from './propertyType.enum';
import { RxNode } from './rxNode';
import { SampleFunctions } from './sample-functions';

export class GroupByBolt extends RxNode {
  protected static title = 'GroupByBolt';
  protected static desc = 'group by fields';
  protected static maxInput = 1;
  protected static minInput = 1;

  protected static propertiesType = new PropertyType('config', PropertyTypeEnum.Object, [
    new PropertyType('type', PropertyTypeEnum.Method, [
      SampleFunctions.GroupByFields,
      SampleFunctions.GroupByShuffle,
      SampleFunctions.GroupByLocalOrShuffle,
      SampleFunctions.GroupByGlobal,
      SampleFunctions.GroupByBatchGlobal,
    ]),
    new PropertyType('fields', PropertyTypeEnum.String)
  ], '');

  public properties = {
    type: SampleFunctions.GroupByFields,
    fields: ''
  };
  public graphInputs = [];

  public runner = () => {
    let inputFields = this.stringSplitToArray(this.properties.fields);
    return this.graphInputs[0].observable.pipe(map((x: NumberInfo) => {
      this.checkInputField(inputFields, x.data);
      return x;
    }));
  }
  public toString = () => {
    return `.groupBy(fields: [${this.properties.fields}], type: ${this.properties.type.name})`;
  }
}
