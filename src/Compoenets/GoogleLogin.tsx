import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/GoogleLogin.css";
const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;
export function GoogleLoginPage(){
    const navigate=useNavigate();
    
        const login = useGoogleLogin({
            
            flow: 'auth-code',
            onSuccess: async(tokenResponse) => {
                try{
                    const {code}=tokenResponse;
                    console.log(`Received auth code is : ${code}`);
                    console.log("sending request to backend");
                    const response = await axios.post(`${BACKEND_URL}api/auth/google`,{code});
                    console.log(`Returned response from backend is : ${JSON.stringify(response.data)}`);
                    const {token}=response.data;
                    console.log(token);
                    if (token) {
                        localStorage.setItem("token", token);
                        navigate("/dashboard");
                      } else {
                        console.error("No token received from backend");
                      }
                    

                }catch(error){
                    console.log("Google login failed");

                }

                
            },
            onError: (error)=>{
                console.log("error google login failed");
            }
          });

    return (
        <div className="google-login-container">
            <button onClick={()=>login()} className="google-login-btn" aria-label="Sign in with Google">
                <span className="google-logo" aria-hidden="true">
                    {/* Google SVG Logo */}
                    <svg width="24" height="24" viewBox="0 0 24 24"><g><path fill="#4285F4" d="M21.805 10.023h-9.765v3.955h5.627c-.242 1.236-1.377 3.63-5.627 3.63-3.386 0-6.146-2.803-6.146-6.262s2.76-6.262 6.146-6.262c1.927 0 3.222.82 3.963 1.527l2.713-2.64c-1.715-1.6-3.93-2.59-6.676-2.59-5.523 0-10 4.477-10 10s4.477 10 10 10c5.77 0 9.59-4.045 9.59-9.75 0-.654-.07-1.15-.16-1.528z"/><path fill="#34A853" d="M3.272 7.548l3.285 2.41c.89-1.74 2.57-2.86 4.443-2.86 1.08 0 2.09.37 2.87 1.09l2.713-2.64c-1.715-1.6-3.93-2.59-6.676-2.59-2.7 0-5.09 1.04-6.91 2.73z"/><path fill="#FBBC05" d="M12 22c2.43 0 4.47-.8 5.96-2.17l-2.75-2.25c-.77.52-1.75.83-3.21.83-2.47 0-4.57-1.67-5.32-3.93l-3.25 2.5c1.8 3.54 5.53 5.02 8.57 5.02z"/><path fill="#EA4335" d="M21.805 10.023h-9.765v3.955h5.627c-.242 1.236-1.377 3.63-5.627 3.63-3.386 0-6.146-2.803-6.146-6.262s2.76-6.262 6.146-6.262c1.927 0 3.222.82 3.963 1.527l2.713-2.64c-1.715-1.6-3.93-2.59-6.676-2.59-5.523 0-10 4.477-10 10s4.477 10 10 10c5.77 0 9.59-4.045 9.59-9.75 0-.654-.07-1.15-.16-1.528z"/></g></svg>
                </span>
                <span>Sign in with Google</span>
            </button>
        </div>
    );
}