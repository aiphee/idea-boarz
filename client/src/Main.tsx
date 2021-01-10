import React from 'react';
import produce from 'immer';

import io from 'socket.io-client'; // might try https://github.com/robtaussig/react-use-websocket#readme
const socket = io('localhost:3000');

import events from '../../shared/events.json';
import { Column } from './Column';
import { ColumnsProps, IdeaProps } from './types';
import { Controls } from './Controls';
import { useStoreActions, useStoreState } from './model';


export const Main = () => {
    const columnIdeas = useStoreState((state) => state.columnIdeas.items);
    const setColumnsIdeas = useStoreActions((actions ) => actions.columnIdeas.set);

    const userLikes = useStoreState((state) => state.userLikes.items);
    const setUserLikes = useStoreActions((actions ) => actions.userLikes.set);

    socket.on(events.IDEA_CREATE_S, (msg: IdeaProps) => {
        setColumnsIdeas(produce(columnIdeas, (draft: ColumnsProps) => {
            draft[msg.col_id].ideas[msg.id] = msg;
        }));
    });

    socket.on(events.IDEA_DELETE_S, (props: { ideaId: number; colId: number }) => {
        const { ideaId, colId } = props;
        setColumnsIdeas(produce(columnIdeas, (draft: ColumnsProps) => {
            delete draft[colId].ideas[ideaId];
        }));
    });

    socket.on(events.IDEA_LIKE_S, (props: { ideaId: number }) => {
        const { ideaId } = props;

        if (userLikes.includes(ideaId)) {
            setUserLikes(produce(userLikes, (draft: number[]) => {
                const index = draft.indexOf(ideaId);
                delete draft[index];
            }));
        } else {
            setUserLikes([...userLikes, ideaId]);
        }
    });

    return (
        <main>
            <Controls />
            <div id="sectionsWrap">
                {Object.values(columnIdeas).map((column) => {
                    return (
                        <Column
                            key={column.id}
                            column={column}
                        />
                    );
                })}
            </div>
        </main>
    );
};