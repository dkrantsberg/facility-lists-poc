import {FacilityListsPocApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {dsMigrate} from './migrate'

export {FacilityListsPocApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new FacilityListsPocApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  // await dsMigrate(app);
  return app;
}
