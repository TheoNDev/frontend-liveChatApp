import { useState } from "react";
import axios from "../utils/axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface SignupFormProps {
    onSignupSuccess: () => void
}

const SignupForm = ({ onSignupSuccess }: SignupFormProps) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { login } = useAuthContext();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("")
        try {
            const userData = {
                username,
                email,
                password
            }
            const response = await axios.post("/auth/signup", userData, { withCredentials: true })
            console.log(response.data);
            login(response.data.user)
            onSignupSuccess();

        } catch (error) {
            console.error(error);
            setError("Username Taken");
        }
    }

    return (
        <form onSubmit={handleSignUp} className="forms-signup__form">
            {error && <p className="forms-signup__form__error">{error}</p>}
            <input
                type="text"
                placeholder="Email"
                className="forms-signup__form__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Username"
                className="forms-signup__form__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {showPassword ?
                <div className="forms-signup__form__password">
                    <input
                        type="text"
                        placeholder="Password"
                        className="forms-signup__form__password__input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <IoEyeOffOutline
                        onClick={() => setShowPassword(false)}
                        className="forms-signup__form__password__icon"
                    />
                </div>
                :
                <div className="forms-signup__form__password">
                    <input
                        type="password"
                        placeholder="Password"
                        className="forms-signup__form__password__input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <IoEyeOutline
                        onClick={() => setShowPassword(true)}
                        className="forms-signup__form__password__icon"
                    />
                </div>
            }
            {showConfirmPassword ?
                <div className="forms-signup__form__password">
                    <input
                        type="text"
                        placeholder="Confirm Password"
                        className="forms-signup__form__password__input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <IoEyeOffOutline
                        onClick={() => setShowConfirmPassword(false)}
                        className="forms-signup__form__password__icon"
                    />
                </div>
                :
                <div className="forms-signup__form__password">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="forms-signup__form__password__input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <IoEyeOutline
                        onClick={() => setShowConfirmPassword(true)}
                        className="forms-signup__form__password__icon"
                    />
                </div>
            }

            <button type="submit" className="forms-signup__form__btn">Sign Up</button>
        </form>
    );
};

export default SignupForm;