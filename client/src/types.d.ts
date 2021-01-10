import { Action } from 'easy-peasy';

export interface IdeaProps {
    id: number;
    text: string;
    col_id: number;
    guest_hash: string;
    likes: number;
    deleted: 0 | 1;
    [other: string]: any;
}

export interface ColumnProps {
    id: number;
    name: string;
    ideas: {
        [id: number]: IdeaProps
    },
}

export interface ColumnsProps {
    [columnId: number]: ColumnProps
}


interface ColumnIdeasPart {
    items: ColumnsProps;
    set: Action<ColumnIdeasPart, ColumnsProps>;
}

interface UserLikesPart {
    items: number[];
    set: Action<UserLikesPart, number[]>;
}

interface OrderingPart {
    attr: string;
    dir: string;
    setAttr: Action<OrderingPart, string>;
    setDir: Action<OrderingPart, string>;
}

export interface StoreModelTypes {
    columnIdeas: ColumnIdeasPart,
    userLikes: UserLikesPart,
    ordering: OrderingPart
}