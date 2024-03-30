import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import dayjs from 'dayjs';
import 'dayjs/esm/locale/zh-cn';

dayjs.locale('zh-cn');


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

