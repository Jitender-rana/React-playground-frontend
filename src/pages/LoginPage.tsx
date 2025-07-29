import { GoogleAuthWrapper } from "../Compoenets/GoogleAuth";
import "../styles/LoginPage.css";

export default function Login() {
    return (
        <div className="login-bg">
            <div className="login-card">
                
                <p className="login-desc">Sign in to continue</p>
                <GoogleAuthWrapper />
                <div className="backend-notice">
                    <div className="notice-icon">⏱️</div>
                    <p className="notice-text">
                        Please allow 30-40 seconds for the first login as our backend is hosted on Render and may take time to wake up.
                    </p>
                </div>
            </div>
        </div>
    );
}
