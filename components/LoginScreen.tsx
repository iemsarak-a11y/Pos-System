import React, { useState } from 'react';
import { User } from '../types';
import { useToast } from '../hooks/useToast';

interface LoginScreenProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLoginSuccess }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pin, setPin] = useState('');
  const { addToast } = useToast();

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleLoginAttempt = () => {
    if (!selectedUser) {
      addToast({ type: 'error', message: 'Please select a user.' });
      return;
    }
    if (pin === selectedUser.pin) {
      onLoginSuccess(selectedUser);
    } else {
      addToast({ type: 'error', message: 'Incorrect PIN. Please try again.' });
      setPin('');
    }
  };
  
  // Handle login when PIN reaches 4 digits
  React.useEffect(() => {
    if (pin.length === 4) {
      handleLoginAttempt();
    }
  }, [pin]);

  if (!selectedUser) {
    return (
      <div className="min-h-screen w-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome to Gemini POS Pro</h1>
            <p className="text-slate-500 mb-8">Please select your profile to begin.</p>
            <div className="grid grid-cols-2 gap-4">
                {users.map(user => (
                    <button 
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    >
                        <span className="text-lg font-semibold text-slate-800">{user.name}</span>
                        <span className="block text-sm text-slate-500 capitalize">{user.role}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xs bg-white rounded-xl shadow-2xl p-8 text-center">
        <button onClick={() => { setSelectedUser(null); handleClear(); }} className="text-sm text-blue-600 hover:underline mb-4">&larr; Back to users</button>
        <h2 className="text-2xl font-bold text-slate-800">Hello, {selectedUser.name}!</h2>
        <p className="text-slate-500 mb-6">Please enter your 4-digit PIN.</p>
        
        <div className="flex justify-center items-center space-x-3 mb-6 h-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`w-6 h-6 rounded-full border-2 transition-colors ${pin.length > i ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}></div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} onClick={() => handlePinInput(String(n))} className="p-4 text-2xl font-semibold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
              {n}
            </button>
          ))}
          <button onClick={handleClear} className="p-4 text-lg font-semibold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-red-500">
            C
          </button>
          <button onClick={() => handlePinInput('0')} className="p-4 text-2xl font-semibold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            0
          </button>
          <button onClick={handleBackspace} className="p-4 text-lg font-semibold bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            &larr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;