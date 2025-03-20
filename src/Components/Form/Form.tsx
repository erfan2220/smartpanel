import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useApplicationContext } from "../../Context/ApplicationContext.tsx";

const DynamicFormPage = () => {
    const { formId } = useParams();
    const { addApplication } = useApplicationContext();
    const navigate = useNavigate();

    const [formSchema, setFormSchema] = useState<any>(null);
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state
    const { isDarkMode } = useApplicationContext();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);


    useEffect(() => {
        axios.get("https://assignment.devotel.io/api/insurance/forms")
            .then((res) => {
                const form = res.data.find((form: any) => form.formId === formId);
                setFormSchema(form);
            })
            .catch((err) => console.error("Error fetching form:", err));
    }, [formId]);

    const handleChange = (fieldId: string, value: any) => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));
    };

    const isFieldVisible = (field: any) => {
        if (!field.visibility) return true;
        const { dependsOn, condition, value } = field.visibility;
        return condition === "equals" ? formData[dependsOn] === value : true;
    };


    useEffect(() => {
        const autosave = setInterval(() => {
            if (formData) {
                localStorage.setItem(`draft_${formId}`, JSON.stringify(formData));
            }
        }, 5000);

        return () => clearInterval(autosave); // Cleanup interval on unmount
    }, [formData, formId]);


    useEffect(() => {
        const savedDraft = localStorage.getItem(`draft_${formId}`);
        if (savedDraft) {
            setFormData(JSON.parse(savedDraft));
        }
    }, [formId]);




    const renderField = (field: any) => {
        if (!isFieldVisible(field)) return null;

        if (field.type === "group" && field.fields) {
            return (
                <fieldset key={field.id} className="border p-4 mb-4 rounded">
                    <legend className="text-lg font-bold">{field.label}</legend>
                    {field.fields.map((nestedField: any) => renderField(nestedField))}
                </fieldset>
            );
        }

        return (
            <div key={field.id} className="mb-4">
                <label className="block font-medium">{field.label}</label>
                {field.type === "text" || field.type === "date" ? (
                    <input
                        type={field.type}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="border p-2 rounded w-full"
                        required={field.required}
                    />
                ) : field.type === "select" && field.options ? (
                    <select
                        value={formData[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className="border p-2 rounded w-full"
                        required={field.required}
                    >
                        <option value="">Select...</option>
                        {field.options.map((option: string) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : field.type === "radio" && field.options ? (
                    <div className="flex space-x-4">
                        {field.options.map((option: string) => (
                            <label key={option} className="flex items-center">
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={option}
                                    checked={formData[field.id] === option}
                                    onChange={() => handleChange(field.id, option)}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                ) : field.type === "checkbox" && field.options ? (
                    <div className="flex space-x-4">
                        {field.options.map((option: string) => (
                            <label key={option} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={formData[field.id]?.includes(option)}
                                    onChange={() => {
                                        const updatedData = formData[field.id] || [];
                                        handleChange(
                                            field.id,
                                            updatedData.includes(option)
                                                ? updatedData.filter((item: string) => item !== option)
                                                : [...updatedData, option]
                                        );
                                    }}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true); // Start loading

        try {

            // const response = await axios.post("https://assignment.devotel.io/api/insurance/forms/submit", {
        await axios.post("https://assignment.devotel.io/api/insurance/forms/submit", {
                formId,
                data: formData
            });

            // Handle successful submission (e.g., update context, show success message, etc.)
            addApplication({ id: Date.now().toString(), formId, data: formData });

            alert("Application Submitted!");

            // Optionally, redirect to the applications list page
            navigate("/applications");

        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to submit the application. Please try again.");
        } finally {
            setIsSubmitting(false); // Stop loading
        }
    };

    if (!formSchema) return <p>Loading form...</p>;

    return (
        <form onSubmit={handleSubmit} className="p-4  rounded shadow">
            <h2 className="text-xl font-bold mb-4">{formSchema.title}</h2>
            {formSchema.fields.map((field: any) => renderField(field))}
            <button type="submit" className="bg-blue-600 text-white p-2 rounded" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
};

export default DynamicFormPage;
