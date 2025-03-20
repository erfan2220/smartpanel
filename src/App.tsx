import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./Components/Navbar/Navbar.tsx";
import {ApplicationProvider, useApplicationContext} from "./Context/ApplicationContext.tsx";


const DynamicFormPage = React.lazy(() => import("./Components/Form/Form.tsx"));
const ListTable = React.lazy(() => import("./Components/ListTable/ListTable.tsx"));
const Home = React.lazy(() => import("./page/Home/Home.tsx"));

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) =>
{
    const { isDarkMode } = useApplicationContext();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);



    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="p-6">{children}</main>
        </div>
    );
};

const App: React.FC = () => {


    return (
        <ApplicationProvider>
            <Router>
                <Layout>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Insurance Application</h1>

                    </div>

                    <Suspense fallback={<div className="text-center">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/apply/:formId" element={<DynamicFormPage />} />
                            <Route path="/applications" element={<ListTable />} />
                        </Routes>
                    </Suspense>
                </Layout>
            </Router>
        </ApplicationProvider>
    );
};

export default App;
