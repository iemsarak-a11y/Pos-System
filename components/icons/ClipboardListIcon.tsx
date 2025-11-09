import React from 'react';

const ClipboardListIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 12 2.25a2.251 2.251 0 0 1 1.024.28M4.5 9A2.25 2.25 0 0 1 6.75 6.75h1.5a2.25 2.25 0 0 1 2.25 2.25v.75m-4.5 0v11.25c0 1.24 1.01 2.25 2.25 2.25h9.75a2.25 2.25 0 0 0 2.25-2.25V9.75m-14.25 0h14.25" />
    </svg>
);

export default ClipboardListIcon;