import * as dynamoose from "@appsimples/dynamoose";

export interface UserKeySchema {
    id: string;
    sort: string;
}

interface UserView extends UserKeySchema {
    id: string;
    sort: string;
    name: string;
    userName: string;
    email: string;
    dateOfBirth: number;
    favoriteTags: string[];
}

const schema = {
    id: { type: String, hashKey: true },
    sort: { type: String, rangeKey: true },
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Number,
        required: true,
    },
    favoriteTags: {
        type: [String],
        required: true,
    },
};
export const UserEntity = dynamoose.model<UserView, UserKeySchema>('UserEntity', new dynamoose.Schema(schema), {
    tableName: 'UnnamedTable'
});
