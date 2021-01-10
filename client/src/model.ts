import { action, createStore, createTypedHooks, Store } from 'easy-peasy';

import { ColumnsProps, StoreModelTypes } from './types';


export const orderAttributes = [
    'likes',
    'id'
];

export const getStore = (columnIdeas: ColumnsProps, userLikes: number[]): Store<StoreModelTypes> =>
    createStore<StoreModelTypes>({
        columnIdeas: {
            items: columnIdeas,
            set: action((state, payload) => {
                state.items = payload
            }),
        },
        userLikes: {
            items: userLikes,
            set: action((state, payload) => {
                state.items = payload
            }),
        },
        ordering: {
            attr: orderAttributes[0],
            dir: 'asc',
            setAttr: action((state, payload) => {
                state.attr = payload
            }),
            setDir: action((state, payload) => {
                state.dir = payload
            }),
        }
    });

const typedHooks = createTypedHooks<StoreModelTypes>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

