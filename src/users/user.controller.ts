import { UsersService } from './user.service';

export const UserRouter = {
  'GET': {
    'api/users': {
      validator: () => ({
        error: null,
        params: {},
      }),
      service: UsersService.getAll,
    },
    'api/users/:id': {
      service: UsersService.getById,
      validator: (params: Record<any, any>) => ({
        error: null,
        params: { ...params },
      }),
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