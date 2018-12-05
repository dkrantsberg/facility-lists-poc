import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  del,
  requestBody,
} from '@loopback/rest';
import {List, ListField, ListItem} from '../models';
import {ListRepository} from '../repositories';

export class ListControllerController {
  constructor(
    @repository(ListRepository)
    public listRepository : ListRepository
  ) {}

  @post('/lists', {
    responses: {
      '200': {
        description: 'List model instance',
        content: {'application/json': {schema: {'x-ts-type': List}}},
      },
    },
  })
  async create(@requestBody() list: List): Promise<List> {
    return await this.listRepository.create(list);
  }

  @get('/lists/count', {
    responses: {
      '200': {
        description: 'List model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(List)) where?: Where,
  ): Promise<Count> {
    return await this.listRepository.count(where);
  }

  @get('/lists', {
    responses: {
      '200': {
        description: 'Array of List model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': List}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(List)) filter?: Filter,
  ): Promise<List[]> {
    return await this.listRepository.find(filter);
  }

  @patch('/lists', {
    responses: {
      '200': {
        description: 'List PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() list: List,
    @param.query.object('where', getWhereSchemaFor(List)) where?: Where,
  ): Promise<Count> {
    return await this.listRepository.updateAll(list, where);
  }

  @get('/lists/{id}', {
    responses: {
      '200': {
        description: 'List model instance',
        content: {'application/json': {schema: {'x-ts-type': List}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<List> {
    return await this.listRepository.findById(id);
  }

  @patch('/lists/{id}', {
    responses: {
      '204': {
        description: 'List PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() list: List,
  ): Promise<void> {
    await this.listRepository.updateById(id, list);
  }

  @del('/lists/{id}', {
    responses: {
      '204': {
        description: 'List DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.listRepository.deleteById(id);
  }

  @post('/lists/{listName}/fields', {
    responses: {
      '200': {
        description: 'Add field to a list',
        content: {'application/json': {schema: {'x-ts-type': ListField}}},
      },
    },
  })
  async addField(@param.path.string('listName') listName: string, @requestBody() field: ListField): Promise<ListField> {
    return await this.listRepository.upsertField(listName, field);
  }

  @post('/lists/{listName}/items', {
    responses: {
      '200': {
        description: 'Add field to a list',
        content: {'application/json': {schema: {'x-ts-type': ListField}}},
      },
    },
  })
  async addItem(@param.path.string('listName') listName: string, @requestBody() listItem: ListItem): Promise<ListItem> {
    const listItemRepository = await this.listRepository.getListItemRepository(listName);
    return await listItemRepository.create(listItem);
  }
}
