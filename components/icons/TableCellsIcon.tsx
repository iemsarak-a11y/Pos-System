import React from 'react';

const TableCellsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125H20.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h17.25m-17.25 0H20.625M3.375 4.5h17.25m-17.25 0a1.125 1.125 0 0 0-1.125 1.125v1.5c0 .621.504 1.125 1.125-1.125H20.625c.621 0 1.125.504 1.125 1.125v-1.5c0-.621-.504-1.125-1.125-1.125m-17.25 0H20.625m0 0v.001M4.5 4.5v.001m0 15v.001" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 4.5v15m17.25-15v15" />
    </svg>
);

export default TableCellsIcon;
