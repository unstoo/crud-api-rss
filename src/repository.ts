
export type User = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

export const UsersRepository: User[] = [
  {
    id: '-1',
    username: 'admin',
    age: 55,
    hobbies: ['tinkering', 'bbq', 'hiking']
  },
  {
    id: '0',
    username: 'blank_user',
    age: 0,
    hobbies: ['idling', 'waitin', 'sleeping']
  },
];