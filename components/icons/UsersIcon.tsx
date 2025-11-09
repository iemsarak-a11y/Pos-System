import React from 'react';

const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253M15 19.128v-3.863a3.375 3.375 0 0 0-3.375-3.375H9.375a3.375 3.375 0 0 0-3.375 3.375v3.863m0 0a9.38 9.38 0 0 0-2.625-.372 9.337 9.337 0 0 0-4.121 2.253M15 19.128 12 16.5m3-3.863 3.03-3.03a2.25 2.25 0 0 0 0-3.182L16.5 4.5M15 11.265l-3-3m0 0-3 3m3-3v3.863" />
    </svg>
);

export default UsersIcon;
