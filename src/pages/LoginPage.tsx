import { GoogleAuthWrapper } from "../Compoenets/GoogleAuth";
import "../styles/LoginPage.css";

export default function Login() {
    return (
        <div className="login-bg">
            <div className="login-card">
                
                <p className="login-desc">Sign in to continue</p>
                <GoogleAuthWrapper />
            </div>
        </div>
    );
}
