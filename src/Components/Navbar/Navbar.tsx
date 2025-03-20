// Components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import {useApplicationContext} from "../../Context/ApplicationContext.tsx";

export const Navbar: React.FC = () =>
{
    const { isDarkMode, toggleDarkMode } = useApplicationContext();

    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between">
            <h1 className="text-xl font-bold">Smart Insurance</h1>

            <button
                onClick={toggleDarkMode}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:opacity-80"
            >
                {isDarkMode ? '🌙' : '☀️'}
            </button>
            <div>
                <Link className="mr-4" to="/">Apply</Link>
                <Link to="/submissions">Submissions</Link>
            </div>


        </nav>
    );
};