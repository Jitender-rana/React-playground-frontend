import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLoginPage } from './GoogleLogin';


const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID;
export function GoogleAuthWrapper(){
    console.log(clientId);
    return <GoogleOAuthProvider clientId={clientId}>
        <GoogleLoginPage></GoogleLoginPage>

    </GoogleOAuthProvider>

}