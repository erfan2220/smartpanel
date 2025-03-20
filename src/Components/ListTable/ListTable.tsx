//@ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";

 const ListTable: React.FC = () => {
    const [columns, setColumns] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

    const [loading,setLoading]=useState(true)
    useEffect(() => {

        setLoading(true)

        axios.get("https://assignment.devotel.io/api/insurance/forms/submissions")
            .then((response) =>
            {

                console.log("Fetched API Response:", response.data);

                if (response.data && Array.isArray(response.data.data)) {
                    const firstRow = response.data.data[0] || {};
                    const availableColumns = response.data.columns || Object.keys(firstRow);

                    console.log("Available Columns:", availableColumns);
                    console.log("First Row Data:", firstRow);

                    setColumns(availableColumns);
                    setData(response.data.data);
                    setSelectedColumns(availableColumns);
                    setLoading(false)
                } else {
                    console.error("Unexpected API response format:", response.data);
                    setLoading(false)
                }
            })
            .catch((error) => console.error("Error fetching submissions:", error));
        setLoading(false)
    }, []);

    if(loading)
    {
        return (
            <div>
                loading
            </div>
        )
    }
    return (
        <div className="p-6   rounded-lg shadow-lg">
            <div className="mb-6">
                <label className="block font-semibold text-gray-700 dark:text-gray-300">Select Columns:</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {columns.map((col) => (
                        <label key={col} className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedColumns.includes(col)}
                                onChange={(e) => {
                                    const colName = String(col); // Ensure col is a string
                                    setSelectedColumns((prev) =>
                                        e.target.checked ? [...prev, colName] : prev.filter(c => c !== colName)
                                    );
                                }}
                                className="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span className="text-gray-900 dark:text-gray-200">{col}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700  shadow-md">
                    <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ">
                        {selectedColumns.map((col) => (
                            <th key={String(col)} className="border p-2">{String(col)}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={selectedColumns.length} className="text-center p-4 text-gray-500 dark:text-gray-400">
                                No submissions available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={index} className="border">
                                {selectedColumns.map((col) => (
                                    <td key={col} className="border p-2">
                                        {row[col] !== undefined ? String(row[col]) : "-"}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


 export default ListTable;