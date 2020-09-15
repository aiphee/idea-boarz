import React, {FormEvent, useState} from 'react';
import produce from 'immer';
import io from 'socket.io-client'; // might try https://github.com/robtaussig/react-use-websocket#readme

const socket = io('localhost:3000');

import events from '../../shared/events.json';

type Idea = {
    id: number;
    text: string;
    col_id: number;
    guest_hash: string;
    likes: number;
    deleted: 0 | 1;
    [other: string]: any;
};

type Column = {
    id: number;
    name: string;
    ideas: {
        [id: number]: Idea
    },
};

interface Columns {
    [columnId: number]: Column
}

const orderAttributes = [
    'likes',
    'id'
];

export const Main = (props: { columns: Columns }) => {
    const { columns } = props;

    /*
     * We need state, prop change wont cause component rerender
     */
    const [columnsInner, setColumnsInner] = useState(columns);

    const [orderAttr, setOrderAttr] = useState(orderAttributes[0]);
    const [orderDir, setOrderDir] = useState('asc');
    const [newTextContent, setNewTextContent] = useState('');
    const [newTextColId, setNewTextId] = useState(Object.keys(columnsInner)[0]);

    const addNewText = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit(events.IDEA_CREATE_C, {
            newTextContent,
            newTextColId,
        });
    };

    socket.on(events.IDEA_CREATE_S, (msg: Idea) => {
        setColumnsInner(produce(columnsInner, (draft: Columns) => {
            draft[msg.col_id].ideas[msg.id] = msg;
        }));
    });

    socket.on(events.IDEA_DELETE_S, (props: { ideaId: number; colId: number }) => {
        const { ideaId, colId } = props;
        setColumnsInner(produce(columnsInner, (draft: Columns) => {
            delete draft[colId].ideas[ideaId];
        }));
    });

    const deleteIdea = (ideaId: number) => {
        socket.emit(events.IDEA_DELETE_C, {
            ideaId,
        });
    }

    return (
        <main>
            <div id="controlsWrap">
                <fieldset id="orderingWrap">
                    <legend>Sorting</legend>
                    <select value={orderAttr} onChange={((e) => setOrderAttr(e.target.value))}>
                        {orderAttributes.map((orderAttribute) => (
                            <option key={orderAttribute} value={orderAttribute}>{orderAttribute}</option>
                        ))}
                    </select>
                    <select value={orderDir} onChange={((e) => setOrderDir(e.target.value))}>
                        <option value="asc">asc</option>
                        <option value="desc">desc</option>
                    </select>
                </fieldset>

                <form
                    id="addIdeaForm"
                    onSubmit={addNewText}
                >
                    <fieldset>
                        <legend>Add new idea</legend>
                        <label>
                            Text
                            &nbsp;
                            <textarea
                                value={newTextContent}
                                onChange={(e) => setNewTextContent(e.target.value)}
                                rows={2}
                            />
                        </label>
                        <label>
                            Column
                            &nbsp;
                            <select
                                value={newTextColId}
                                onChange={(e) => setNewTextId(e.target.value)}
                            >
                                {Object.keys(columnsInner).map((colId) => {
                                    const col = columnsInner[parseInt(colId)];
                                    return (
                                        <option key={col.id} value={col.id}>{col.name}</option>
                                    );
                                })}
                            </select>
                        </label>
                        <button type="submit">
                            Add
                        </button>
                    </fieldset>
                </form>
            </div>
            <div id="sectionsWrap">
                {Object.values(columnsInner).map((column) => {
                    const { ideas } = column;
                    const ideasArr: Idea[] = Object.values(ideas);
                    return (
                        <section key={column.id} className="section">
                            <h1>{column.name}</h1>
                            <div id="articlesWrap">
                                {ideasArr.map((idea: Idea) => {
                                    const order = orderDir === 'asc' ? idea[orderAttr] : 0 - idea[orderAttr];

                                    return (
                                        <article
                                            className="idea"
                                            key={idea.id}
                                            style={{ order }}
                                        >
                                            <div className="text">
                                                {idea.text}
                                            </div>
                                            <div className="actions">
                                                <button
                                                    className="delete"
                                                    title="delete"
                                                    onClick={() => deleteIdea(idea.id)}
                                                >x</button>
                                            </div>


                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    )
                })}
            </div>
        </main>
    );
};