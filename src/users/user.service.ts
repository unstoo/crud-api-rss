import * as uuid from 'uuid';
import { UserDTO, UsersRepository } from "../repository";

export enum SERVICE_CODES {
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND',
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export type ServiceReturn = {
  error: any | null;
  result: {
    data?: any;
    code: SERVICE_CODES;
  };
}

type ServiceType = {
  getAll: () => ServiceReturn;
  getById: ({ id }: { id: string }) => ServiceReturn;
  create: (user: UserDTO) => ServiceReturn;
  update: () => ServiceReturn;
  delete: () => ServiceReturn;
}

export const UsersService: ServiceType = {
  getAll() {
    return {
      error: null,
      result: {
        data: UsersRepository,
        code: SERVICE_CODES.FOUND,
      },
    }
  },
  getById(params) {
    const user = UsersRepository.find(user => user.id === params.id);
    return {
      error: null,
      result: {
        data: user ? user : {},
        code: user ? SERVICE_CODES.FOUND : SERVICE_CODES.NOT_FOUND,
      }
    }
  },
  create(params) {
    const newUser = {
      ...params,
      id: uuid.v4(),
    };
    UsersRepository.push(newUser);
    return {
      error: null,
      result: {
        data: newUser,
        code: SERVICE_CODES.CREATED
      },
    }
  },
  update() {
    return {
      error: null,
      result: {
        data: true,
        code: SERVICE_CODES.UPDATED
      },
    }
  },
  delete() {
    return {
      error: null,
      result: {
        data: true,
        code: SERVICE_CODES.DELETED
      },
    }
  },
};
