import { useApplicationContext} from "../../Context/ApplicationContext.tsx";

const ApplicationList = () => {
    const { applications } = useApplicationContext();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
            {applications.length === 0 ? <p>No applications submitted.</p> : (
                <ul>
                    {applications.map((app) => (
                        <li key={app.id} className="p-4 bg-gray-100 rounded mb-2">
                            <strong>Form ID:</strong> {app.formId} <br />
                            <strong>Data:</strong> {JSON.stringify(app.data)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ApplicationList;
