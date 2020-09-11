import React, {FormEvent, Dispatch, useState} from 'react';
import io from 'socket.io-client'; // might try https://github.com/robtaussig/react-use-websocket#readme

const socket = io('localhost:3000');

export const WebSocketDemo = () => {
    const [value, setValue]: [string, Dispatch<string>] = useState('');
    const [messages, setMessages]: [string[], Dispatch<any>] = useState([]);

    const onChatCallback = (msg: string) => {
        setMessages([...messages, msg]);
    };

    socket.on('chat message', onChatCallback);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`sending ${value}`);
        socket.emit('chat message', value);
        setValue('');
    };

    return (
        <>
            <ul>
                {messages.map((message, index) => {
                    return (
                      <li key={index}>{message}</li>
                    );
                })}
            </ul>

            <form onSubmit={onSubmit}>
                <input value={value} onChange={(e) => setValue(e.target.value)} />
                <button type="submit">Send</button>
            </form>
        </>
    );
};