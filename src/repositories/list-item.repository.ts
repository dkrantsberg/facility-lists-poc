import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {ListItem} from '../models';
import {FacilityInstanceDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ListItemRepository extends DefaultCrudRepository<ListItem, typeof ListItem.prototype.id> {
  constructor(
    @inject('datasources.FacilityInstanceDb') dataSource: FacilityInstanceDbDataSource
  ) {
    super(ListItem, dataSource);
  }

  public async create(listItem: ListItem) {
    return super.create(listItem);
  }
}
