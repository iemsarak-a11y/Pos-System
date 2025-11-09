import React, { useState, useMemo } from 'react';
import { CompletedOrder, formatCurrency } from '../types';

interface SalesHistoryProps {
    orderHistory: CompletedOrder[];
    onViewOrderDetails: (order: CompletedOrder) => void;
    currencySymbol: string;
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ orderHistory, onViewOrderDetails, currencySymbol }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = useMemo(() => {
        if (!searchTerm) {
            return orderHistory;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return orderHistory.filter(order =>
            order.id.toLowerCase().includes(lowercasedFilter) ||
            order.cashierName.toLowerCase().includes(lowercasedFilter)
        );
    }, [orderHistory, searchTerm]);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
                <input
                    type="text"
                    placeholder="Search by Order ID or Cashier..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="block w-full max-w-sm border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Cashier</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                            <tr key={order.id} className="bg-white border-b hover:bg-slate-50">
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                    {order.id}
                                </th>
                                <td className="px-6 py-4">{new Date(order.date).toLocaleString()}</td>
                                <td className="px-6 py-4">{order.cashierName}</td>
                                <td className="px-6 py-4">{formatCurrency(order.total, currencySymbol)}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => onViewOrderDetails(order)} className="font-medium text-blue-600 hover:underline">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesHistory;