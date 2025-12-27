'use client';

import { useState } from 'react';
import { X, ChevronDown, Calendar, ArrowRight, Check } from 'lucide-react';

interface Member {
  userId: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId?: string;
  members?: Member[];
  currentUserId?: string;
  onSave?: (expenseData: any) => void;
}

type SplitType = 'equal' | 'custom' | 'percentage' | 'shares';

export default function AddExpenseModal({ 
  isOpen, 
  onClose, 
  groupId,
  members = [],
  currentUserId,
  onSave
}: AddExpenseModalProps) {
  const [type, setType] = useState<'expense' | 'transfer'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId || '');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(members.map(m => m.userId));
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});
  const [showPaidByDropdown, setShowPaidByDropdown] = useState(false);
  const [showSplitOptions, setShowSplitOptions] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const expenseData = {
      amount: parseFloat(amount),
      description,
      paidBy,
      splitType,
      selectedMembers,
      customSplits: splitType === 'custom' ? customSplits : undefined,
      groupId,
      date: new Date()
    };
    
    if (onSave) {
      onSave(expenseData);
    }
    
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedMembers(members.map(m => m.userId));
    setCustomSplits({});
    onClose();
  };

  const getPaidByMember = () => members.find(m => m.userId === paidBy);
  
  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const calculateSplit = () => {
    const amt = parseFloat(amount) || 0;
    const count = selectedMembers.length;
    
    if (splitType === 'equal' && count > 0) {
      return (amt / count).toFixed(2);
    }
    return '0.00';
  };

  const handleCustomSplitChange = (userId: string, value: string) => {
    setCustomSplits(prev => ({
      ...prev,
      [userId]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/20 dark:bg-black/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[580px] bg-white/95 dark:bg-[#101922]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Add Expense</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Body - Scrollable */}
        <div className="flex flex-col p-6 gap-6 overflow-y-auto">
          
          {/* Segmented Control */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex self-center w-full max-w-xs">
            <button 
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 px-4 rounded-md text-sm font-medium transition-all ${
                type === 'expense' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Expense
            </button>
            <button 
              onClick={() => setType('transfer')}
              className={`flex-1 py-1.5 px-4 rounded-md text-sm font-medium transition-all ${
                type === 'transfer' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' 
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Transfer
            </button>
          </div>
          
          {/* Massive Amount Input */}
          <div className="flex flex-col items-center justify-center py-2">
            <label className="sr-only" htmlFor="amount">Amount</label>
            <div className="flex items-baseline text-slate-900 dark:text-white">
              <span className="text-4xl font-medium text-slate-400 mr-1">$</span>
              <input 
                autoFocus
                className="bg-transparent border-none text-6xl font-bold p-0 text-center w-64 focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 caret-[#2b8cee]" 
                id="amount" 
                placeholder="0.00" 
                type="text" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            
            {/* Description Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 group-focus-within:text-[#2b8cee] transition-colors">✎</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b8cee]/20 focus:border-[#2b8cee] transition-all text-base" 
                placeholder="What is this for?" 
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Payer Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowPaidByDropdown(!showPaidByDropdown)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                >
                  <div className="flex -space-x-2 overflow-hidden">
                    {getPaidByMember()?.photoURL ? (
                      <img 
                        src={getPaidByMember()?.photoURL} 
                        alt={getPaidByMember()?.name}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                      />
                    ) : (
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                        {getPaidByMember()?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs text-slate-500 font-medium group-hover:text-[#2b8cee] transition-colors">Paid by</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {getPaidByMember()?.userId === currentUserId ? 'You' : getPaidByMember()?.name || 'Select...'}
                    </span>
                  </div>
                  <ChevronDown className="text-slate-400 flex-shrink-0" size={18} />
                </button>
                
                {/* Dropdown */}
                {showPaidByDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {members.map(member => (
                      <button
                        key={member.userId}
                        onClick={() => {
                          setPaidBy(member.userId);
                          setShowPaidByDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        {member.photoURL ? (
                          <img src={member.photoURL} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {member.userId === currentUserId ? 'You' : member.name}
                          </p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                        {paidBy === member.userId && <Check size={16} className="text-[#2b8cee]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Date Picker */}
              <button className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 flex-shrink-0">
                  <Calendar size={18} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs text-slate-500 font-medium group-hover:text-[#2b8cee] transition-colors">Date</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">Today</span>
                </div>
              </button>
            </div>
            
            {/* Split Section */}
            <div className="mt-2">
              <div className="flex justify-between items-center mb-3 px-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Split with</label>
                <div className="relative">
                  <button 
                    onClick={() => setShowSplitOptions(!showSplitOptions)}
                    className="text-xs font-semibold text-[#2b8cee] hover:text-[#2b8cee]/80 flex items-center gap-1"
                  >
                    {splitType === 'equal' ? 'Split equally' : splitType === 'custom' ? 'Custom amounts' : splitType === 'percentage' ? 'By percentage' : 'By shares'}
                    <ChevronDown size={14} />
                  </button>
                  
                  {/* Split Type Dropdown */}
                  {showSplitOptions && (
                    <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 w-48">
                      {(['equal', 'custom', 'percentage', 'shares'] as SplitType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setSplitType(type);
                            setShowSplitOptions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{type}</span>
                          {splitType === type && <Check size={14} className="text-[#2b8cee]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Members List */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50 divide-y divide-slate-100 dark:divide-slate-700">
                {members.map(member => {
                  const isSelected = selectedMembers.includes(member.userId);
                  
                  // Calculate display amount based on split type
                  let displayAmount = '0.00';
                  const amt = parseFloat(amount) || 0;
                  
                  if (isSelected && amt > 0) {
                    if (splitType === 'equal') {
                      displayAmount = calculateSplit();
                    } else if (splitType === 'custom') {
                      displayAmount = (customSplits[member.userId] || 0).toFixed(2);
                    } else if (splitType === 'percentage') {
                      const percentage = customSplits[member.userId] || 0;
                      displayAmount = ((amt * percentage) / 100).toFixed(2);
                    } else if (splitType === 'shares') {
                      const memberShares = customSplits[member.userId] || 0;
                      const totalShares = Object.entries(customSplits)
                        .filter(([id]) => selectedMembers.includes(id))
                        .reduce((sum, [, shares]) => sum + shares, 0);
                      if (totalShares > 0) {
                        displayAmount = ((amt * memberShares) / totalShares).toFixed(2);
                      }
                    }
                  }
                  
                  return (
                    <div key={member.userId} className="flex items-center gap-3 p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleMember(member.userId)}
                        className="w-4 h-4 rounded border-slate-300 text-[#2b8cee] focus:ring-[#2b8cee]/20"
                      />
                      {member.photoURL ? (
                        <img src={member.photoURL} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {member.userId === currentUserId ? 'You' : member.name}
                        </span>
                      </div>
                      
                      {/* Equal Split - Just show amount */}
                      {splitType === 'equal' && isSelected && (
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">${displayAmount}</span>
                      )}
                      
                      {/* Custom Amount Input */}
                      {splitType === 'custom' && isSelected && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-slate-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={customSplits[member.userId] || ''}
                            onChange={(e) => handleCustomSplitChange(member.userId, e.target.value)}
                            className="w-20 px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded bg-transparent text-right focus:ring-1 focus:ring-[#2b8cee] focus:border-[#2b8cee]"
                          />
                        </div>
                      )}
                      
                      {/* Percentage Input */}
                      {splitType === 'percentage' && isSelected && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={customSplits[member.userId] || ''}
                            onChange={(e) => handleCustomSplitChange(member.userId, e.target.value)}
                            className="w-16 px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded bg-transparent text-right focus:ring-1 focus:ring-[#2b8cee] focus:border-[#2b8cee]"
                          />
                          <span className="text-sm text-slate-500">%</span>
                          <span className="text-xs text-slate-400 w-16 text-right">${displayAmount}</span>
                        </div>
                      )}
                      
                      {/* Shares Input */}
                      {splitType === 'shares' && isSelected && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="1"
                            min="0"
                            placeholder="0"
                            value={customSplits[member.userId] || ''}
                            onChange={(e) => handleCustomSplitChange(member.userId, e.target.value)}
                            className="w-16 px-2 py-1 text-sm border border-slate-200 dark:border-slate-600 rounded bg-transparent text-right focus:ring-1 focus:ring-[#2b8cee] focus:border-[#2b8cee]"
                          />
                          <span className="text-sm text-slate-500">shares</span>
                          <span className="text-xs text-slate-400 w-16 text-right">${displayAmount}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Summary */}
              {selectedMembers.length > 0 && (
                <div className="flex justify-between items-center px-1">
                  <p className="text-xs text-slate-500">
                    Split among {selectedMembers.length} {selectedMembers.length === 1 ? 'person' : 'people'}
                  </p>
                  {splitType === 'percentage' && (
                    <p className="text-xs text-slate-500">
                      Total: {Object.entries(customSplits)
                        .filter(([id]) => selectedMembers.includes(id))
                        .reduce((sum, [, val]) => sum + (parseFloat(val as any) || 0), 0).toFixed(1)}%
                    </p>
                  )}
                  {splitType === 'shares' && (
                    <p className="text-xs text-slate-500">
                      Total shares: {Object.entries(customSplits)
                        .filter(([id]) => selectedMembers.includes(id))
                        .reduce((sum, [, val]) => sum + (parseFloat(val as any) || 0), 0)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-6 pt-2 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!amount || !description || selectedMembers.length === 0}
            className="px-4 py-3 rounded-xl bg-[#2b8cee] text-white font-semibold text-sm hover:bg-[#2b8cee]/90 transition-colors shadow-lg shadow-[#2b8cee]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Expense
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
