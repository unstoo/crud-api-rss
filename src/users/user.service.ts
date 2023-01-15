import { UsersRepository } from "../repository";

export const UsersService = {
  getAll() {
    return {
      error: null,
      data: UsersRepository,
    }
  },
  getById({ id }: { id: string }) {
    return {
      error: null,
      data: UsersRepository.find(user => user.id === id),
    }
  },
  create() {
    return {
      error: null,
      data: true,
    }
  },
  update() {
    return {
      error: null,
      data: true,
    }
  },
  delete() {
    return {
      error: null,
      data: true,
    }
  },
};
