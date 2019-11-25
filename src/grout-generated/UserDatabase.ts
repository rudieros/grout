import { UserEntity } from "./entities/UserEntity";
import * as dynamoose from "@appsimples/dynamoose";

export class UserDatabase {
    async create(input: CreateUserInput) {
        const transactions = []
        const createTransaction = UserEntity.transaction.create({
            id: generateId(),
            sort: 'User',
            name: input.name,
            userName: input.userName,
            email: input.email,
            dateOfBirth: input.dateOfBirth,
            favoriteTags: input.favoriteTags,

        })
        transactions.push(createTransaction)
    }
}

interface CreateUserInput {
    name: string;
    userName: string;
    email: string;
    dateOfBirth: number;
    favoriteTags: string[];
}
