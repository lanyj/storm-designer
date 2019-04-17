import { map, tap } from 'rxjs/operators';
import { PropertyType } from './property-type';
import { PropertyTypeEnum } from './propertyType.enum';
import { RxNode } from './rxNode';
import { merge, of, pipe } from 'rxjs';
import { NumberInfo } from '../scene/number-info';
import { SampleFunctions } from './sample-functions';

export class PersistentAggregate extends RxNode {
  protected static title = 'PersistentAggregate';
  protected static desc = 'persistent Aggregate';
  protected static maxInput = 1;
  protected static minInput = 1;

  protected static propertiesType = new PropertyType('config', PropertyTypeEnum.Object, [
    new PropertyType('stateFactoryName', PropertyTypeEnum.String),
    new PropertyType('inputFields', PropertyTypeEnum.String),
    new PropertyType('outputFields', PropertyTypeEnum.String),
    new PropertyType('aggregatorType', PropertyTypeEnum.Method, [SampleFunctions.COMBINER_AGGREGATOR, SampleFunctions.REDUCER_AGGREGATOR]),
    new PropertyType('aggregatorName', PropertyTypeEnum.String)
  ], '');

  public properties = {
    stateFactoryName: '',
    inputFields: '',
    outputFields: '',
    aggregatorType: SampleFunctions.COMBINER_AGGREGATOR,
    aggregatorName: ''
  };
  public graphInputs = [];

  public runner = () => {
    return this.graphInputs[0].observable;
  }
  public toString = () => {
    return `.persistentAggregate(stateFactory: ${this.properties.stateFactoryName}, inputFields: [${this.properties.inputFields}], aggregator: (${this.properties.aggregatorType}::${this.properties.aggregatorName}), outputFields: [${this.properties.outputFields}])`;
  }
}
