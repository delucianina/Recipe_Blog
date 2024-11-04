import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ReactEventHandler } from 'react';
import axios from 'axios';

function Header() {

    const store = useStore();
    const navigate = useNavigate();

    if (!store) {
        throw new Error('Store is not available');
    }

    const { state, setState } = store;

    const logoutUser: ReactEventHandler<HTMLAnchorElement> = async (event) => {
        event.preventDefault();

        await axios.get('/auth/logout');

        setState(oldState => ({
            ...oldState,
            user: null
        }));

        navigate('/');
    };
    return (


        // BOOTSTRAP NAV ----------------------
        <nav className="navbar-bg navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand custom-font chili-red" href="#">FlavorWave</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">

                    {state.user && <p className="m-0 pe-4 align-middle">Welcome, {state.user.username}</p>}

                    <NavLink className="nav-link" to="/">Home</NavLink>

                    {state.user ? (
                        <>
                            <a onClick={logoutUser} className="nav-link" href="/auth/logout">Log Out</a>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink className="nav-link active" aria-current="page" to="/recipes">Recipes</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/favorites">Favorites</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/recipes/create">Add Recipe</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/favorites/create">Add Favorite</NavLink>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Contact</a>
                                </li>
                            </ul>
                        </>
                    ) : (
                        <>
                            <NavLink className="nav-link" to="/login">Sign In</NavLink>
                            <NavLink className="nav-link" to="/register">Sign Up</NavLink>
                        </>
                    )}
                </div>
                {/* SEARCH BAR */}
                <div className="container-fluid search-bar">
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="What are you craving?" aria-label="Search"></input>
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Header;