import {Model, model, property} from '@loopback/repository';

@model()
export class ListField extends Model {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  label?: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  constructor(data?: Partial<ListField>) {
    super(data);
  }
}
