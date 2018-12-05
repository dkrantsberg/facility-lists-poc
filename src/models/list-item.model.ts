import {Entity, model, property} from '@loopback/repository';

@model()
export class ListItem extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  constructor(data?: Partial<ListItem>) {
    super(data);
  }
}
