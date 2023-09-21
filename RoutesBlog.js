import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AttributionBlog from './views/AttributionBlog';
import App from './App';

import history from './history';
import ScrollToTop from './ScrollToTop'


export default class RoutesBlog extends Component {
    render() {
        return (
            <BrowserRouter history={history}>
                <Routes>
                    <Route path="/StockerBlog" exact element={() => AttributionBlog} />
                    <ScrollToTop >
                    <Route path="/attribution" exact element={() => AttributionBlog} />
                    </ScrollToTop >
                </Routes>
            </BrowserRouter>
        )
    }
}