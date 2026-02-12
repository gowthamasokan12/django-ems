import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import { ROLES } from '../utils/constants';

const Dashboard = () => {
    const { user } = useAuth();

    const StatCard = ({ title, value, color, link, linkText }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <div className={`text-3xl font-bold mt-2 text-${color}-600`}>{value}</div>
            <div className="mt-4">
                <Link to={link} className={`text-sm text-${color}-600 hover:text-${color}-800 font-medium flex items-center`}>
                    {linkText} <span className="ml-1">→</span>
                </Link>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                    <h1 className="text-3xl font-bold">Hello, {user?.fullName || user?.username}!</h1>
                    <p className="mt-2 opacity-90">
                        Welcome to your dashboard. You are logged in as <span className="font-semibold bg-white/20 px-2 py-1 rounded ml-1">{user?.role?.replace('_', ' ')}</span>
                    </p>
                </div>

                {/* Quick Stats/Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-gray-800 font-semibold text-lg mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link to="/employees" className="block w-full py-2 px-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-center font-medium">
                                View Employees
                            </Link>
                            <Link to="/departments" className="block w-full py-2 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-center font-medium">
                                View Departments
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 md:col-span-2">
                        <h3 className="text-gray-800 font-semibold text-lg mb-4">System Overview</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* These would normally be populated with real data */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <span className="block text-2xl font-bold text-gray-800">1+</span>
                                <span className="text-sm text-gray-500">Active Departments</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <span className="block text-2xl font-bold text-gray-800">5+</span>
                                <span className="text-sm text-gray-500">Total Employees</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <span className="block text-2xl font-bold text-gray-800">4</span>
                                <span className="text-sm text-gray-500">User Roles</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
