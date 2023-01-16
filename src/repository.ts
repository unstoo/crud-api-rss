export type UserDTO = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

process.on('message', function ({
  type,
  data
}) {
  // each worker is listning to 'message' event
  // and then perform relevant tasks.
  if (type === 'CREATE') {
    return UsersRepository.push(data);
  }

  if (type === 'UPDATE') {
    const user = UsersRepository.find(user => data.id === user.id) as unknown as UserDTO;
    return Object.assign(user, data);
  }

  if (type === 'DELETE') {
    const index = UsersRepository.findIndex(user => user.id === data.id);
    return UsersRepository.splice(index, 1);
  }
});


export const UsersRepository: UserDTO[] = [];
