import { UsersService } from './user.service';

export const UserRouter = {
  'GET': {
    'api/users': {
      validator: (props: Record<any, any>) => ({
        error: null,
        data: { ...props },
      }),
      service: UsersService.getAll,
    },
    'api/users/{userId}': {
      service: UsersService.getById,
      validator: (props: Record<any, any>) => ({
        error: null,
        data: { ...props },
      }),
    },
  },
  'POST': {
    'api/users': {
      service: UsersService.create,
    },
  },
  'PUT': {
    'api/users/{userId}': {
      service: UsersService.update,
    },
  },
  'DELETE': {
    'api/users/{userId}': {
      service: UsersService.delete,
    },
  },
};