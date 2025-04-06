import './app.scss';
import { RouterProvider } from 'react-router-dom';
import r from './utils/Router';
import { AuthContextProvider } from './context/authContext';

const App = () => {
    return (
        <AuthContextProvider>
            <RouterProvider router={r} />
        </AuthContextProvider>
    );
};

export default App;
