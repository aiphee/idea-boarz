import React from 'react';

import io from 'socket.io-client';
const socket = io('localhost:3000');

import clsx from 'clsx';

import { ColumnProps, IdeaProps } from './types';
import events from '../../shared/events.json';
import { useStoreState } from './model';

const deleteIdea = (ideaId: number) => {
    socket.emit(events.IDEA_DELETE_C, {
        ideaId,
    });
}

const handleLike = (ideaId: number) => {
    socket.emit(events.IDEA_LIKE_C, {
        ideaId,
    });
}

export const Column = (props: { column: ColumnProps }) => {
    const { column } = props;
    const { ideas } = column;

    const orderAttr = useStoreState((state) => state.ordering.attr);
    const orderDir = useStoreState((state) => state.ordering.dir);
    const userLikes = useStoreState((state) => state.userLikes.items);

    const ideasArr: IdeaProps[] = Object.values(ideas);

    return (
        <section key={column.id} className="section">
            <h1>{column.name}</h1>
            <div id="articlesWrap">
                {ideasArr.map((idea: IdeaProps) => {
                    const order = orderDir === 'asc' ? idea[orderAttr] : 0 - idea[orderAttr];

                    return (
                        <article
                            className="idea"
                            key={idea.id}
                            style={{ order }}
                        >
                            {idea.text}
                            &nbsp;
                            <button
                                className={clsx({ 'addLike': true, liked: userLikes.includes(idea.id)})}
                                title="like it"
                                onClick={() => handleLike(idea.id)}
                            >👍</button>

                            <button
                                className="delete"
                                title="delete"
                                onClick={() => deleteIdea(idea.id)}
                            >❌</button>
                        </article>
                    );
                })}
            </div>
        </section>
    )
}

