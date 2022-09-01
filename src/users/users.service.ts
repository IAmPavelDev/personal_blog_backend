import { Injectable } from '@nestjs/common';

export type User = {
    id: number;
    name: string;
    username: string;
    password: string;
};

@Injectable()
export class UsersService {
    private readonly users: User[] = [
        {
            id: 1,
            name: 'Pavel',
            username: 'iampavel',
            password: '12345678',
        },
        {
            id: 2,
            name: 'Admin',
            username: 'admin',
            password: '12345678admin',
        },
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find((user) => user.username === username);
    }
}
