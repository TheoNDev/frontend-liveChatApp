import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "../utils/axios";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface LoginFormProps {
    onLoginSuccess: () => void
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuthContext();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("/auth/login", { username, password }, { withCredentials: true });
            console.log(response.data.user);
            login(response.data.user);
            onLoginSuccess();
        } catch (error) {
            console.error(error);
            setError("Invalid credentials");
        }

    }

    return (
        <form onSubmit={handleLogin} className="forms-login__form">
            {error && <p className="forms-login__form__error">{error}</p>}
            <input
                className="forms-login__form__input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <div className="forms-login__form__password">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="forms-login__form__input"
                />
                {showPassword ?
                    <IoEyeOffOutline
                        onClick={() => setShowPassword(false)}
                        className="forms-login__form__password__icon"
                    /> : <IoEyeOutline
                        onClick={() => setShowPassword(true)}
                        className="forms-login__form__password__icon"
                    />}
            </div>
            <button
                type="submit"
                className="forms-login__form__btn"
            >Log In</button>

        </form>
    );
};

export default LoginForm;