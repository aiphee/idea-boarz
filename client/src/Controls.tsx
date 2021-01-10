import React, {FormEvent, useState} from 'react';

import io from 'socket.io-client';
import { orderAttributes, useStoreActions, useStoreState } from './model';
const socket = io('localhost:3000');

import events from '../../shared/events.json';

export const Controls = () => {
    const columnIdeas = useStoreState((state) => state.columnIdeas.items);
    const orderAttr = useStoreState((state) => state.ordering.attr);
    const orderDir = useStoreState((state) => state.ordering.dir);

    const setOrderAttr = useStoreActions((state) => state.ordering.setAttr);
    const setOrderDir = useStoreActions((state) => state.ordering.setDir);

    const [newTextContent, setNewTextContent] = useState('');
    const [newTextColId, setNewTextId] = useState(Object.keys(columnIdeas)[0]);

    const addNewText = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit(events.IDEA_CREATE_C, {
            newTextContent,
            newTextColId,
        });
    };

    return (
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
                            {Object.keys(columnIdeas).map((colId) => {
                                const col = columnIdeas[parseInt(colId)];
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
    )
}

