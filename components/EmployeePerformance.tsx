import React, { useMemo, useState } from 'react';
import { CompletedOrder, User, formatCurrency } from '../types';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import UserPlusIcon from './icons/UserPlusIcon';

interface EmployeePerformanceProps {
  orderHistory: CompletedOrder[];
  users: User[];
  onAddUser: (newUser: Omit<User, 'id'>) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: number) => void;
  currencySymbol: string;
}

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-500 uppercase">{title}</h4>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
);

const EmployeePerformance: React.FC<EmployeePerformanceProps> = ({ orderHistory, users, onAddUser, onUpdateUser, onDeleteUser, currencySymbol }) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const performanceData = useMemo(() => {
        return users.map(user => {
            const userOrders = orderHistory.filter(order => order.cashierName === user.name && order.status !== 'refunded');
            const totalRevenue = userOrders.reduce((acc, order) => acc + order.total, 0);
            const totalItemsSold = userOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

            return {
                ...user,
                totalRevenue,
                ordersProcessed: userOrders.length,
                totalItemsSold,
            };
        }).sort((a, b) => b.totalRevenue - a.totalRevenue); // Sort by revenue
    }, [orderHistory, users]);

    const handleEditClick = (user: User) => {
        setUserToEdit(user);
        setEditModalOpen(true);
    };

    return (
        <>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    <UserPlusIcon className="w-5 h-5" />
                    <span>Add Employee</span>
                </button>
            </div>
            <div className="space-y-6">
                {performanceData.map(employee => (
                    <div key={employee.id} className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{employee.name}</h3>
                                <p className="text-sm text-slate-500 capitalize">{employee.role}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleEditClick(employee)} className="text-blue-600 hover:text-blue-800">
                                    <PencilIcon />
                                </button>
                                <button onClick={() => onDeleteUser(employee.id)} className="text-red-600 hover:text-red-800">
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <StatCard title="Total Revenue" value={formatCurrency(employee.totalRevenue, currencySymbol)} />
                            <StatCard title="Orders Processed" value={employee.ordersProcessed.toString()} />
                            <StatCard title="Items Sold" value={employee.totalItemsSold.toString()} />
                        </div>
                    </div>
                ))}
            </div>

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAddUser={onAddUser}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                user={userToEdit}
                onUpdateUser={onUpdateUser}
            />
        </>
    );
};

export default EmployeePerformance;