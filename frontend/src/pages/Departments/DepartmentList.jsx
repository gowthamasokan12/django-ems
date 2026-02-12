import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api/departments';
import Layout from '../../components/layout/Layout';
import { canManageDepartments } from '../../utils/permissions';
import { FaEdit, FaTrash, FaPlus, FaUsers } from 'react-icons/fa';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const { user } = useAuth();
    const canManage = canManageDepartments(user?.role);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await getDepartments();
            setDepartments(data.results); // Assuming pagination, but getting first page
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch departments');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await deleteDepartment(id);
                fetchDepartments();
            } catch (err) {
                alert('Failed to delete department. It may have employees assigned.');
            }
        }
    };

    const handleEdit = (dept) => {
        setEditingDept(dept);
        setFormData({ name: dept.name, description: dept.description });
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingDept(null);
        setFormData({ name: '', description: '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await updateDepartment(editingDept.id, formData);
            } else {
                await createDepartment(formData);
            }
            setShowModal(false);
            fetchDepartments();
        } catch (err) {
            alert('Failed to save department');
        }
    };

    if (loading && departments.length === 0) {
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
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
                {canManage && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                        <FaPlus /> Add Department
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <FaUsers className="text-xl" />
                            </div>
                            {canManage && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(dept)}
                                        className="text-gray-400 hover:text-indigo-600 p-1"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept.id)}
                                        className="text-gray-400 hover:text-red-600 p-1"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">{dept.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 flex-grow">{dept.description}</p>

                        <div className="border-t border-gray-100 pt-4 mt-auto">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Staff Count: <span className="text-indigo-600 ml-1 text-sm">{dept.employee_count || 0}</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4">{editingDept ? 'Edit Department' : 'New Department'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default DepartmentList;
