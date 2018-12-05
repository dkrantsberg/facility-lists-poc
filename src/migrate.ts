import {DataSource, Repository} from '@loopback/repository';
import {FacilityListsPocApplication} from './application';
import {ListRepository} from './repositories';

export async function dsMigrate(app: FacilityListsPocApplication) {
  const ds = await app.get<DataSource>('datasources.facilityDb');
  const listRepo = await app.getRepository(ListRepository);
  await ds.automigrate();
}
