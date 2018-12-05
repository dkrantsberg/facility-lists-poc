import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './facility-db.datasource.json';

export class FacilityDbDataSource extends juggler.DataSource {
  static dataSourceName = 'facilityDb';

  constructor(
    @inject('datasources.config.facilityDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
