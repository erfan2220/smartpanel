import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [forms, setForms] = useState<{ formId: string; title: string }[]>([]);

    useEffect(() => {
        axios
            .get("https://assignment.devotel.io/api/insurance/forms")
            .then((res) => setForms(res.data))
            .catch((err) => console.error("Error fetching forms:", err));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">
                Choose an Insurance Type
            </h1>
            <div className="space-y-4">
                {forms.map((form) => (
                    <Link
                        key={form.formId}
                        to={`/apply/${form.formId}`}
                        className="block bg-blue-600 text-white p-4 rounded-lg shadow-lg transition-transform hover:scale-105 focus:outline-none"
                    >
                        {form.title}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
