import * as uuid from 'uuid';
import { UsersService } from './user.service';
import { UserDTO } from '../repository';

type ValidatorType = (params: Object) => {
  error: null | Record<any, any>;
  params: Object;
}

const defaultValidator: ValidatorType = (params: any) => ({
  error: null,
  params,
})

export const UserRouter = {
  'GET': {
    'api/users': {
      validator: defaultValidator,
      service: UsersService.getAll,
    },
    'api/users/:id': {
      service: UsersService.getById,
      validator: (params: Record<any, any>) => {
        const id = params?.id;
        const isValid = uuid.validate(id);

        return {
          error: isValid ? null : {
            type: 'INVALID_DATA',
            message: 'Invalid user `id`.'
          },
          params,
        }
      },
    },
  },
  'POST': {
    'api/users': {
      service: UsersService.create,
      validator: (params: UserDTO) => {
        if ([params.username, params.age, params.hobbies].some(item => !item)) {
          return {
            error: {
              type: 'INVALID_DATA',
              message: 'Insufficient data.'
            }
          }
        }

        return {
          error: null,
          params,
        }
      }
    },
  },
  'PUT': {
    'api/users/:userId': {
      service: UsersService.update,
      validator: defaultValidator,
    },
  },
  'DELETE': {
    'api/users/:userId': {
      service: UsersService.delete,
      validator: defaultValidator,
    },
  },
};