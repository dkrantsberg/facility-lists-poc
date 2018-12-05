import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './facility-instance-db.datasource.json';

export class FacilityInstanceDbDataSource extends juggler.DataSource {
  static dataSourceName = 'FacilityInstanceDb';

  constructor(
    @inject('datasources.config.FacilityInstanceDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
