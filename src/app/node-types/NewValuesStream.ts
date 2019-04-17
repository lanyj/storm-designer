import { map, tap } from 'rxjs/operators';
import { PropertyType } from './property-type';
import { PropertyTypeEnum } from './propertyType.enum';
import { RxNode } from './rxNode';
import { merge, of, pipe } from 'rxjs';
import { NumberInfo } from '../scene/number-info';

export class NewValuesStream extends RxNode {
  protected static title = 'NewValuesStream';
  protected static desc = 'make groupStream to Stream';
  protected static maxInput = 1;
  protected static minInput = 1;

  protected static propertiesType = new PropertyType('config', PropertyTypeEnum.Object, [
  ], '');

  public properties = {
  };
  public graphInputs = [];

  public runner = () => {
    return this.graphInputs[0].observable;
  }
  public toString = () => {
    return `.newValuesStream()`;
  }
}
