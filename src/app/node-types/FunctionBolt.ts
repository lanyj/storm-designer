import { interval, empty } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { PropertyType } from './property-type';
import { PropertyTypeEnum } from './propertyType.enum';
import { RxNode } from './rxNode';
import { NumberInfo } from '../scene/number-info';
import { reject } from 'q';
import { SampleFunctions } from './sample-functions';

export class FunctionBolt extends RxNode {
  protected static title = 'FunctionBolt';
  protected static desc = 'function bolt interface';
  protected static maxInput = 1;
  protected static minInput = 1;

  protected static propertiesType = new PropertyType('config', PropertyTypeEnum.Object, [
    new PropertyType('name', PropertyTypeEnum.String),
    new PropertyType('functionType', PropertyTypeEnum.Method, [
      SampleFunctions.EACH, SampleFunctions.AGGREGATOR, SampleFunctions.COMBINER_AGGREGATOR, SampleFunctions.REDUCER_AGGREGATOR
    ]),
    new PropertyType('inputFields', PropertyTypeEnum.String),
    new PropertyType('outputFields', PropertyTypeEnum.String)
  ], '');

  public properties = {
    name: '',
    functionType: 0,
    inputFields: '',
    outputFields: ''
  };

  public graphInputs = [];

  public runner = () => {
    let inputFields = this.stringSplitToArray(this.properties.inputFields);
    let outputFields = this.stringSplitToArray(this.properties.outputFields);
    return this.graphInputs[0].observable.pipe(map((x: NumberInfo) => {
      this.checkInputField(inputFields, x.data);

      outputFields.forEach(v => {
        this.addFieldsToArray(outputFields, x.data);
      })
      return x;
    }));
  }
  public toString = () => {
    return `.${this.propertiesType.params[1].params[this.properties.functionType].name}(inputFields: [${this.properties.inputFields}], outputFields: [${this.properties.outputFields}])`;
  }
}
