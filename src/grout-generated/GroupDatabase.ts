import { GroupEntity } from "./entities/GroupEntity";
import * as dynamoose from "@appsimples/dynamoose";
import { Picture } from "../_common/models/Picture";

export class GroupDatabase {
    async create(input: CreateGroupInput) {
        const transactions = []
        const createTransaction = GroupEntity.transaction.create({
            id: generateId(),
            sort: 'Group',
            name: input.name,
            picture: input.picture,
            description: input.description,
            googlePlaceGroupId: input.googlePlaceGroupId,
            tags: input.tags,
            numbers: input.numbers,
            date: input.date,
            timestamp: input.timestamp,
            pictureList: input.pictureList,
            currentCity: input.currentCity,
            country: input.country,

        })
        transactions.push(createTransaction)
    }
}

interface CreateGroupInput {
    name: string;
    picture?: Picture;
    description: string;
    googlePlaceGroupId?: string;
    tags: string[];
    numbers?: number[];
    date?: Date;
    timestamp?: number;
    pictureList?: Picture[];
    currentCity?: string;
    country?: string;
}
