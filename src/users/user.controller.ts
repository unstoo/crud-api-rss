import * as uuid from 'uuid';
import { UsersService } from './user.service';
import { UserDTO } from '../repository';

type ValidatorType = (params: Object) => {
  error: null | Record<any, any>;
  params: Object;
}

const defaultValidator: ValidatorType = (params: Object) => ({
  error: null,
  params,
})

enum CONTROLLER_CODES {
  INVALID_DATA = "INVALID_DATA",
};

const uuidValidator: ValidatorType = (params: Record<any, any>) => {
  const isValid = uuid.validate(params?.id);

  return {
    error: isValid ? null : {
      type: CONTROLLER_CODES.INVALID_DATA,
      message: 'Invalid user `id`.'
    },
    params,
  }
};

export const UserRouter = {
  'GET': {
    'api/users': {
      service: UsersService.getAll,
      validator: defaultValidator,
    },
    'api/users/:id': {
      service: UsersService.getById,
      validator: uuidValidator,
    },
  },
  'POST': {
    'api/users': {
      service: UsersService.create,
      validator: (params: UserDTO) => {
        if ([params.username, params.age, params.hobbies].some(item => !item))
          return {
            error: {
              type: CONTROLLER_CODES.INVALID_DATA,
              message: 'Insufficient data.'
            },
            params,
          };

        return {
          error: null,
          params,
        }
      }
    },
  },
  'PUT': {
    'api/users/:id': {
      service: UsersService.update,
      validator: (params: UserDTO & { id: string }) => {
        const { error: uuidError } = uuidValidator({ id: params?.id });
        if (uuidError) {
          return {
            error: uuidError,
            params,
          }
        }

        if ([params.username, params.age, params.hobbies].some(item => !item))
          return {
            error: {
              type: CONTROLLER_CODES.INVALID_DATA,
              message: 'Insufficient data.',
            },
            params,
          };

        return {
          error: null,
          params,
        }
      },
    },
  },
  'DELETE': {
    'api/users/:id': {
      service: UsersService.delete,
      validator: uuidValidator,
    },
  },
};