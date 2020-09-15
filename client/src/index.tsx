import React from 'react';
import { render } from 'react-dom';

import {Main} from './Main';

import './main.scss';

fetch('http://localhost:3000/initial.json')
    .then(response => response.json())
    .then(data => {
        const { columnIdeas, userLikes } = data;
        render((
            <>
                <Main columnIdeas={columnIdeas} userLikes={userLikes}  />
            </>
            ),
            document.getElementById('root')
        );
    });

