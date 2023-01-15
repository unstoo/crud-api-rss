import { UsersRepository } from "../repository";

export const UsersService = {
  getAll() {
    return {
      error: null,
      data: UsersRepository,
    }
  },
  getById() {
    return {
      error: null,
      data: false,
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
