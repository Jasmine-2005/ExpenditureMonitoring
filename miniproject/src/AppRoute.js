import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Expense from './Expense';
import ChartPage from './ChartPage';
import PrivateRoute from './PrivateRoute';
import './AppRoute.css';

    const menu =('click',()=>{
        const navlink = document.querySelector('.nav-link')
        navlink.classList.toggle('mobile-menu')
    })

    const links=('click',()=>{
        const navlink = document.querySelector('.nav-link')
        navlink.classList.toggle('mobile-menu')
    })



function AppRoute() {
    const log = () => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect using window.location
        } else {
            return <Navigate to="/login" />;
        }
    };

    return (
        <Router>
            <nav class="navbar">
                <h1><Link to="/" class="logo link">Moon</Link></h1>
                <ul class="nav-link">
                    <li onClick={links}><Link to="/" class="link">Home</Link></li>
                    <li onClick={links}><Link to="/expense" class="link">Expense</Link></li>
                    <li id="b1" class="b1">
                        <button class="link btn" onClick={log}>
                            {localStorage.getItem('token') ? 'Logout' : 'Login'}
                        </button>
                    </li>
                </ul>
                <span class="menu-btn" onClick={menu}>&#9778;</span>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/expense" element={<PrivateRoute><Expense /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/chart" element={<ChartPage />} />
            </Routes>
        </Router>
    );
}

export default AppRoute;
