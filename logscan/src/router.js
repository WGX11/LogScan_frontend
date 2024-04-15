import { createBrowserRouter } from "react-router-dom";
import SearchPage from "./pages/SearchPage/SearchPage";
import MonitorPage from "./pages/MonitorPage/MonitorPage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <SearchPage />
    },
    {
        path: "/monitor",
        element: <MonitorPage />
    }
])

export default router