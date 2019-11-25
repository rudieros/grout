import * as dynamoose from "@appsimples/dynamoose";
import { Picture } from "../../_common/models/Picture";

export interface GroupKeySchema {
    id: string;
    sort: string;
}

interface GroupView extends GroupKeySchema {
    id: string;
    sort: string;
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

const schema = {
    id: { type: String, hashKey: true },
    sort: { type: String, rangeKey: true },
    name: {
        type: String,
        required: true,
    },
    picture: {
        type: 'map',
        map: {
            medium: {
                type: String,
                required: true,
            },
            large: {
                type: String,
                required: true,
            },
            original: {
                type: String,
                required: true,
            },
        },
    },
    description: {
        type: String,
        required: true,
        default: '',
    },
    googlePlaceGroupId: {
        type: String,
    },
    tags: {
        type: [String],
        required: true,
        default: ['Hello'],
    },
    numbers: {
        type: [Number],
        default: [122, 123],
    },
    date: {
        type: Date,
        default: '2019-11-19T18:28:51.364Z',
    },
    timestamp: {
        type: Number,
        default: 0,
    },
    pictureList: {
        type: 'list',
        list: [{
            type: 'map',
            map: {
                medium: {
                    type: String,
                    required: true,
                },
                large: {
                    type: String,
                    required: true,
                },
                original: {
                    type: String,
                    required: true,
                },
            }
        }],
        default: [],
    },
    currentCity: {
        type: String,
    },
    country: {
        type: String,
    },
};
export const GroupEntity = dynamoose.model<GroupView, GroupKeySchema>('GroupEntity', new dynamoose.Schema(schema), {
    tableName: 'GroutTable'
});
