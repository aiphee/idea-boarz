import React  from 'react';
import { render } from 'react-dom';

import { StoreProvider } from 'easy-peasy';

import {Main} from './Main';

import './main.scss';

import { getStore } from './model';

fetch('http://localhost:3000/initial.json')
    .then(response => response.json())
    .then(data => {
        const { columnIdeas, userLikes } = data;

        const store = getStore(columnIdeas, userLikes);

        render((
            <StoreProvider store={store}>
                <Main />
            </StoreProvider>
            ),
            document.getElementById('root')
        );
    });

