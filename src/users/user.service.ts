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
  update: (user: UserDTO & { id: string }) => ServiceReturn;
  delete: ({ id }: { id: string }) => ServiceReturn;
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
  create(user) {
    const newUser = {
      ...user,
      id: uuid.v4(),
    };
    //@ts-ignore
    process?.send?.({
      type: 'CREATE',
      data: newUser,
    })
    UsersRepository.push(newUser);
    return {
      error: null,
      result: {
        data: newUser,
        code: SERVICE_CODES.CREATED
      },
    }
  },
  update(params) {
    const existingUser = UsersRepository.find(user => params.id === user.id);
    if (existingUser) {
      //@ts-ignore
      process?.send?.({
        type: 'UPDATE',
        data: params,
      })
      Object.assign(existingUser, params);
    }
    return {
      error: null,
      result: {
        data: existingUser,
        code: existingUser ? SERVICE_CODES.UPDATED : SERVICE_CODES.NOT_FOUND,
      },
    }
  },
  delete(params) {
    const index = UsersRepository.findIndex(user => user.id === params.id);
    const hasFound = index !== -1;
    if (hasFound) {
      //@ts-ignore
      process?.send?.({
        type: 'DELETE',
        data: params,
      })
      UsersRepository.splice(index, 1);
    }
    return {
      error: null,
      result: {
        data: hasFound ? true : false,
        code: hasFound ? SERVICE_CODES.DELETED : SERVICE_CODES.NOT_FOUND,
      },
    }
  },
};
