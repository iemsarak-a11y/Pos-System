import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newName: string) => void;
  categoryName: string;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, onUpdate, categoryName }) => {
  const [newName, setNewName] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setNewName(categoryName);
    }
  }, [isOpen, categoryName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    if (trimmedName === '') {
      addToast({ type: 'error', message: 'Category name cannot be empty.' });
      return;
    }
    if (trimmedName.toLowerCase() === categoryName.toLowerCase()) {
      addToast({ type: 'info', message: 'No changes were made.' });
      onClose();
      return;
    }
    onUpdate(trimmedName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Edit Category</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Category Name</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="p-6 bg-slate-50 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;