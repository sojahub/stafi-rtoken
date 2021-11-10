import React from 'react';
import ReactDOM from 'react-dom';
import { initAnalytics } from 'src/util/analyticsUtil';
import App from './app';

initAnalytics();

const Div: any = <App />;
ReactDOM.render(Div, document.getElementById('root'));
