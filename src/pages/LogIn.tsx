import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../styles/loginForm.scss";

const LogIn = () => {
    const navigate = useNavigate();

    const onLoginSuccess = () => {
        navigate("/")
    }
    return (
        <div className="forms-login">
            <p className="forms-login__title">Login</p>
            <LoginForm onLoginSuccess={onLoginSuccess} />
            <p>Don't have an account? <Link to={"/auth/signup"}>Sign up</Link></p>
        </div>
    );
};

export default LogIn;