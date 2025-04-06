import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import StartPage from "../pages/StartPage";
import LogIn from "../pages/LogIn";
import Signup from "../pages/Signup";
import Chat from "../pages/Chat";
import FormLayout from "../Layouts/FormLayout";
import ProtectedRoute from "../components/ProtectedRoute";

const r = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <div>404 Not Found</div>,
        children: [
            {
                path: "/",
                element:
                    <ProtectedRoute>
                        <StartPage />
                    </ProtectedRoute>
            },
            {
                path: "/chat/group/:roomId",
                element:
                    <ProtectedRoute>
                        <Chat roomType={"group"} />
                    </ProtectedRoute>

            },
            {
                path: "/chat/dm/:friendId",
                element:
                    <ProtectedRoute>
                        <Chat roomType={"dm"} />
                    </ProtectedRoute>

            }

        ]
    },
    {
        path: "/auth",
        element: <FormLayout />,
        errorElement: <div>404 Not Found</div>,
        children: [
            {
                path: "/auth/login",
                element: <LogIn />
            },
            {
                path: "/auth/signup",
                element: <Signup />
            }
        ]

    }
]);

export default r;