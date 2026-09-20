import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AppRoute.css';

function Signup() {
    const [inputValue1, setInputValue1] = useState(""); // Username
    const [inputValue2, setInputValue2] = useState(""); // Email
    const [inputValue3, setInputValue3] = useState(""); // Password
    const [inputValue4, setInputValue4] = useState(""); // Confirm Password
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const signup = async () => {
        setIsSubmitted(true);

        if (!inputValue1 || !inputValue2 || !inputValue3 || !inputValue4) {
            return;
        }

        if (inputValue4 !== inputValue3) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: inputValue1,
                    email: inputValue2,
                    password: inputValue3
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate('/login'); // Redirect to login after successful signup
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup">
                <center>
                    <h1 className="signup-head">Sign up</h1>

                    {/* Username */}
                    <input 
                        type="text"
                        className="input"
                        value={inputValue1}
                        onChange={(event) => setInputValue1(event.target.value)}
                        placeholder="Username"
                    />
                    <p>
                        {isSubmitted && !inputValue1 && "Username can't be empty"}
                        {inputValue1 && !inputValue1.match(/^[a-zA-Z.\s]+$/) && "Invalid username"}
                    </p>

                    {/* Email */}
                    <input 
                        type="text"
                        className="input"
                        value={inputValue2}
                        onChange={(event) => setInputValue2(event.target.value)}
                        placeholder="Email"
                    />
                    <p>
                        {isSubmitted && !inputValue2 && "Email can't be empty"}
                        {inputValue2 && !inputValue2.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) && "Invalid email"}
                    </p>

                    {/* Password */}
                    <input 
                        type="password"
                        className="input"
                        value={inputValue3}
                        onChange={(event) => setInputValue3(event.target.value)}
                        placeholder="Password"
                        maxLength="6"
                    />
                    <p>
                        {isSubmitted && !inputValue3 && "Password can't be empty"}
                        {inputValue3 && !inputValue3.match(/^[a-zA-Z0-9_-]{6}$/) && "Invalid password format"}
                    </p>

                    {/* Confirm Password */}
                    <input 
                        type="password"
                        className="input"
                        value={inputValue4}
                        onChange={(event) => setInputValue4(event.target.value)}
                        placeholder="Confirm Password"
                        maxLength="6"
                    />
                    <p>
                        {isSubmitted && !inputValue4 && "Confirm password can't be empty"}
                        {inputValue4 && inputValue4 !== inputValue3 && "Passwords do not match"}
                    </p>

                    {/* Signup Button */}
                    <button onClick={signup} className="login-btn">Sign up</button>
                    <p className="sign-in">Already have an account? <a href="/login">Login</a></p>
                </center>
            </div>
        </div>
    );
}

export default Signup;