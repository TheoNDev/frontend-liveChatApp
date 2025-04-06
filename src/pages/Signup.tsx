import { Link, useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import "../styles/signupForm.scss";

const Signup = () => {
    const navigate = useNavigate();

    const onSignupSuccess = () => {
        navigate("/");
    }
    return (
        <div className="forms-signup">
            <p className="forms-signup__title">Signup</p>
            <SignupForm onSignupSuccess={onSignupSuccess} />
            <p>Already have an account? <Link to={"/auth/login"}>Login</Link></p>
        </div>
    );
};

export default Signup;