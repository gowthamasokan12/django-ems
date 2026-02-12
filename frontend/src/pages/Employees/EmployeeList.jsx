import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, deleteEmployee } from '../../api/employees';
import Layout from '../../components/layout/Layout';
import { canManageEmployees } from '../../utils/permissions';
import { ROLE_NAMES } from '../../utils/constants';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { user } = useAuth();
    const navigate = useNavigate();
    const canManage = canManageEmployees(user?.role);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await getEmployees({
                page,
                search: searchTerm
            });
            setEmployees(data.results);
            setTotalPages(Math.ceil(data.count / 10)); // Assuming page size is 10
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch employees');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [page, searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                fetchEmployees();
            } catch (err) {
                alert('Failed to delete employee');
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        fetchEmployees();
    };

    if (loading && employees.length === 0) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="spinner"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Employees</h1>

                <div className="flex gap-4 w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </form>

                    {canManage && (
                        <Link
                            to="/employees/new"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
                        >
                            <FaPlus /> Add Employee
                        </Link>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-500">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                {canManage && <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                                    {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{employee.full_name}</div>
                                                    <div className="text-sm text-gray-500">{employee.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{employee.position}</div>
                                            <div className="text-xs text-gray-500">{ROLE_NAMES[employee.role]}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                                                {employee.department_name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${employee.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {employee.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        {canManage && (
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => navigate(`/employees/${employee.id}/edit`)}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={canManage ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </Layout>
    );
};

export default EmployeeList;
