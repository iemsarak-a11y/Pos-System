import React, { useState } from 'react';
import { User } from '../types';
import { useToast } from '../hooks/useToast';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (newUser: Omit<User, 'id'>) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<'manager' | 'cashier' | 'supervisor'>('cashier');
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pin) {
      addToast({ type: 'error', message: 'Please fill out all fields.' });
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
        addToast({ type: 'error', message: 'PIN must be exactly 4 digits.' });
        return;
    }
    onAddUser({ name, pin, role });
    // Reset form
    setName('');
    setPin('');
    setRole('cashier');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-slate-800">Add New Employee</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Employee Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700">4-Digit PIN</label>
                    <input type="password" value={pin} onChange={e => setPin(e.target.value)} maxLength={4} pattern="\d{4}" placeholder="e.g., 1234" className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700">Role</label>
                    <select value={role} onChange={e => setRole(e.target.value as 'manager' | 'cashier' | 'supervisor')} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="cashier">Cashier</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">Add Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;