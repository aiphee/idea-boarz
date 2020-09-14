import React, {FormEvent, useState} from 'react';
import produce from 'immer';

const socket = new WebSocket('ws://' + window.location.hostname + ':3000');

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

        socket.send(JSON.stringify({
            type: events.IDEA_CREATE_C,
            payload: {
                newTextContent,
                newTextColId,
            }
        }));
    };

    socket.addEventListener('message', (socket) => {
        const msg = JSON.parse(socket.data) as any;

        switch (msg.type) {
            case events.IDEA_CREATE_S:
                const idea: Idea = msg.payload;
                setColumnsInner(produce(columnsInner, (draft: Columns) => {
                    draft[idea.col_id].ideas[idea.id] = idea;
                }));
        }
    })


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
                                            {idea.text}
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