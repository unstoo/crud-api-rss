export type UserDTO = {
  id: string | null;
  username: string;
  age: number;
  hobbies: string[];
}

export const UsersRepository: UserDTO[] = [
  {
    id: '7277fd95-f856-4d54-9c11-5f259c3fafbf',
    username: 'admin',
    age: 55,
    hobbies: ['bbq', 'hiking']
  },
  {
    id: '7277fd95-f8d6-4d54-9c11-5f259c3fafbf',
    username: 'blank_user',
    age: 0,
    hobbies: ['idling', 'sleeping']
  },
];