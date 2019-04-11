import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PropertyType } from './property-type';
import { PropertyTypeEnum } from './propertyType.enum';
import { RxNode } from './rxNode';

export class BatchSpout extends RxNode {
  protected static title = 'BatchSpout';
  protected static desc = 'Spout used to create data tuple.';
  protected static maxInput = 0;
  protected static minInput = 0;

  protected static propertiesType = new PropertyType('config', PropertyTypeEnum.Object, [
    new PropertyType('name', PropertyTypeEnum.String),
    new PropertyType('interval', PropertyTypeEnum.Number),
    new PropertyType('length', PropertyTypeEnum.Number),
    new PropertyType('fields', PropertyTypeEnum.String)
  ], '');

  public properties = {
    name: '',
    interval: 1000,
    length: 10,
    fields: 'x'
  };

  public graphInputs = [];

  public runner = () => {
    let fields = this.stringSplitToArray(this.properties.fields);

    return interval(this.properties.interval).pipe(take(this.properties.length), map(x => {
      let xx = { x: x, fields: fields };
      return xx;
    }));
  }
  public toString = () => {
    return `emit(fields: [${this.properties.fields}])`;
  }
}
