import {Entity, ModelDefinition, model, property} from '@loopback/repository';
import {ListField} from './list-field.model'

@model()
export class List extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'object',
  })
  config?: ModelDefinition;

  constructor(data?: Partial<List>) {
    super(data);
  }
}
