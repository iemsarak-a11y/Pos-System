import React, { useMemo, useState } from 'react';
import { CompletedOrder, Product, formatCurrency } from '../types';

interface DashboardProps {
    orderHistory: CompletedOrder[];
    products: Product[];
    currencySymbol: string;
}

type TimeRange = 'all' | 'today' | 'week' | 'month';

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <h3 className="text-sm font-semibold text-slate-500 uppercase">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ orderHistory, products, currencySymbol }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('all');

    const activeOrders = useMemo(() => orderHistory.filter(order => order.status !== 'refunded'), [orderHistory]);

    const filteredOrders = useMemo(() => {
        const now = new Date();
        if (timeRange === 'all') {
            return activeOrders;
        }
        return activeOrders.filter(order => {
            const orderDate = new Date(order.date);
            if (timeRange === 'today') {
                return orderDate.toDateString() === now.toDateString();
            }
            if (timeRange === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday is the first day of the week
                startOfWeek.setHours(0, 0, 0, 0);
                return orderDate >= startOfWeek;
            }
            if (timeRange === 'month') {
                return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [activeOrders, timeRange]);

    const {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        totalItemsSold
    } = useMemo(() => {
        const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = filteredOrders.length;
        const totalItemsSold = filteredOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        return {
            totalRevenue,
            totalOrders,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            totalItemsSold
        }
    }, [filteredOrders]);

    const topSellingProducts = useMemo(() => {
        const productSales = new Map<number, { name: string, quantity: number }>();
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const existing = productSales.get(item.id) || { name: item.name, quantity: 0 };
                productSales.set(item.id, { ...existing, quantity: existing.quantity + item.quantity });
            });
        });

        return Array.from(productSales.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
    }, [filteredOrders]);

    const salesByCategory = useMemo(() => {
        const categorySales = new Map<string, number>();
         filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const category = item.category;
                const itemRevenue = item.price * item.quantity * (1 - (item.discount || 0) / 100);
                categorySales.set(category, (categorySales.get(category) || 0) + itemRevenue);
            });
        });
        return Array.from(categorySales.entries())
            .sort((a, b) => b[1] - a[1]);
    }, [filteredOrders]);

    const TimeRangeButton: React.FC<{ range: TimeRange; label: string }> = ({ range, label }) => (
        <button
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                timeRange === range
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
        >
            {label}
        </button>
    );

    const maxTopProductQuantity = Math.max(...topSellingProducts.map(p => p.quantity), 0);
    const maxCategoryRevenue = Math.max(...salesByCategory.map(c => c[1]), 0);


    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 space-x-1">
                    <TimeRangeButton range="today" label="Today" />
                    <TimeRangeButton range="week" label="This Week" />
                    <TimeRangeButton range="month" label="This Month" />
                    <TimeRangeButton range="all" label="All Time" />
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-slate-700">No sales data for this period.</h3>
                    <p className="text-slate-500 mt-2">Try selecting a different time range or complete a new sale.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue, currencySymbol)} />
                        <StatCard title="Orders Processed" value={totalOrders.toString()} />
                        <StatCard title="Items Sold" value={totalItemsSold.toString()} />
                        <StatCard title="Avg. Order Value" value={formatCurrency(avgOrderValue, currencySymbol)} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold text-slate-800">Top Selling Products</h3>
                            <div className="mt-4 space-y-4">
                                {topSellingProducts.map(product => (
                                    <div key={product.name}>
                                        <div className="flex justify-between items-center mb-1 text-sm font-medium text-slate-600">
                                            <span>{product.name}</span>
                                            <span>{product.quantity}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${maxTopProductQuantity > 0 ? (product.quantity / maxTopProductQuantity) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold text-slate-800">Sales by Category</h3>
                            <div className="mt-4 space-y-4">
                                {salesByCategory.map(([category, revenue]) => (
                                    <div key={category}>
                                        <div className="flex justify-between items-center mb-1 text-sm font-medium text-slate-600">
                                            <span>{category}</span>
                                            <span>{formatCurrency(revenue, currencySymbol)}</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${maxCategoryRevenue > 0 ? (revenue / maxCategoryRevenue) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;