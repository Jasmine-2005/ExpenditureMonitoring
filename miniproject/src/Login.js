import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AppRoute.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        if (!username || !password) {
            setError("Username and password cannot be empty");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem('token', data.token); // Ensure token is set
                alert("Login successful!");
                navigate('/expense'); // Navigate only after token is set
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (error) {
            setError("Error logging in. Please try again.");
        }
    };
    

    return (
        <div className="login-page">
            <div className="login">
                <center>
                    <h1 className="login-head">User Login</h1>
                    
                    <input 
                        type="text"
                        className="input"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="User Name"
                    />
                    
                    <input 
                        type="password"
                        className="input"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        maxLength="6"
                    />

                    {error && <p className="error-message">{error}</p>}

                    <button onClick={login} className="login-btn">Login</button>
                    <p className="sign-in">Don't have an account? <a href="/signup">Sign up</a></p>
                </center>
            </div>
        </div>
    );
}

export default Login;
