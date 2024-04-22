import { createBrowserRouter } from "react-router-dom";
import SearchPage from "./pages/SearchPage/SearchPage";
import MonitorPage from "./pages/MonitorPage/MonitorPage";
import AlertPage from "./pages/AlertPage/AlertPage";
import PageLayout from "./layout";
import React from 'react';
import AddAlertFormPage from "./pages/AlertPage/AddAlertFormPage";



const router = createBrowserRouter([
    {
        path: '/',
        element: <PageLayout />,
        children: [
            {path:'/search', element: <SearchPage />},
            {path:'/monitor', element: <MonitorPage />},
            {path:'/alert', element: <AlertPage />},
            {path:'/alert/add', element: <AddAlertFormPage />}
        ]
    }
])

export default router