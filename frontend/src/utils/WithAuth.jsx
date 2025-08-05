import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from '../context/AuthContext';

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        const { setIsLoggedIn } = useContext(AuthContext);

        const isAuthenticated = () => {
            if (localStorage.getItem("token")) {
                return true;
            }

            return false;
        }

        useEffect(() => {
            if (!isAuthenticated()) {
                setIsLoggedIn(false);
                router("/login")
            }
        }, [])

        return <WrappedComponent {...props} />
    }

    return AuthComponent;
}

export default withAuth;