import {DefaultCrudRepository, juggler, Entity, ModelDefinition, property, DataSource, resolveType} from '@loopback/repository';
import {List, ListField} from '../models';
import {inject, Context} from '@loopback/context';
import {Server, Application, CoreBindings} from '@loopback/core';
import {FacilityDbDataSource, FacilityInstanceDbDataSource} from '../datasources';
import * as _ from 'lodash';
import {ListItemRepository} from '../repositories';

export class ListRepository extends DefaultCrudRepository<List, typeof List.prototype.name> {
  constructor(
    @inject('datasources.facilityDb') dataSource: FacilityDbDataSource,
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
  ) {
    super(List, dataSource);
    this.app = app;
  }

  public async create(list: List) {
    list.config = list.config || new ModelDefinition(list.name);
    await this.autoMigrateModel(this.app, list.config, 'FacilityInstanceDb', false);
    return super.create(list);
  }

  public async upsertField(listName: string, field: ListField) {
    const list = await this.findById(listName);
    list.config = _.assign(new ModelDefinition(list.name), list.config);
    list.config.addProperty(field.name, field);
    await this.autoMigrateModel(this.app, list.config, 'FacilityInstanceDb', false);
    await this.save(list);
    return field;
  }

  public async getListItemRepository(listName: string): Promise<ListItemRepository> {
    // get list definition
    const list = await this.findById(listName);
    const facilityInstanceDb = new FacilityInstanceDbDataSource();
    const listItemModel = _.assign(new ModelDefinition(list.name), list.config);
    let ListItemModelClass = this.getPersistedModel(facilityInstanceDb, listItemModel);
    const listItemRepository = new ListItemRepository(facilityInstanceDb);
    listItemRepository.modelClass = ListItemModelClass;
    return listItemRepository;
  }

  private async autoMigrateModel(app: Application, model: ModelDefinition, dbName: string, keepData: boolean = true) {
    model = JSON.parse(JSON.stringify(model));
    const dataSource = await app.get<DataSource>(`datasources.${dbName}`);
    let modelClass = dataSource.createModel(model.name, model.properties, model.settings);
    _.set(model, 'dataSource', dataSource);
    _.set(model, 'model', modelClass);
    _.set(dataSource, `connector._models.${model.name}`, model);
    if (keepData) {
      return await dataSource.autoupdate();
    }
    return await dataSource.automigrate();
  }


  // Create an internal legacy Model attached to the datasource
  private getPersistedModel(ds: juggler.DataSource, definition: ModelDefinition) {
    // We need to convert property definitions from PropertyDefinition
    // to plain data object because of a juggler limitation
    const properties: {[name: string]: object} = {};

    // We need to convert PropertyDefinition into the definition that
    // the juggler understands
    Object.entries(definition.properties).forEach(([key, value]) => {
      if (value.type === 'array' || value.type === Array) {
        value = Object.assign({}, value, {type: [resolveType(value.itemType)]});
        delete value.itemType;
      }
      value.type = resolveType(value.type);
      properties[key] = Object.assign({}, value);
    });


    const modelClass= ds.createModel<juggler.PersistedModelClass>(
      definition.name,
      properties,
      Object.assign(
        // settings that users can override
        {strict: true},
        // user-defined settings
        definition.settings,
        // settings enforced by the framework
        {strictDelete: false},
      ),
    );
    modelClass.attachTo(ds);
    return modelClass;
  }
}
