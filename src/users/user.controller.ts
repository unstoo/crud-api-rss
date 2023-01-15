import * as uuid from 'uuid';
import { UsersService } from './user.service';

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
            message: 'Invalid user id.'
          },
          params: { ...params },
        }
      },
    },
  },
  'POST': {
    'api/users': {
      service: UsersService.create,
    },
  },
  'PUT': {
    'api/users/:userId': {
      service: UsersService.update,
    },
  },
  'DELETE': {
    'api/users/:userId': {
      service: UsersService.delete,
    },
  },
};