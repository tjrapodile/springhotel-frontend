import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css'; // Custom CSS for additional styles

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        const isLogout = window.confirm('Are you sure you want to logout this user?');
        if (isLogout) {
            ApiService.logout();
            navigate('/home');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/home"><img src="/assets/images/logo.png" alt="Spring Hotel" style={{ width: '150px', height: '60px' }}/></NavLink>
                <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/home" activeclassname="active">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/rooms" activeclassname="active">Rooms</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/find-booking" activeclassname="active">Find my Booking</NavLink>
                        </li>
                        {isUser && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/profile" activeclassname="active">Profile</NavLink>
                            </li>
                        )}
                        {isAdmin && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin" activeclassname="active">Admin</NavLink>
                            </li>
                        )}
                        {!isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login" activeclassname="active">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register" activeclassname="active">Register</NavLink>
                                </li>
                            </>
                        )}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <span className="nav-link" onClick={handleLogout}>Logout</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
