import React, { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { clearBalance } from '../services/expenseService';

export default function SettleUpModal({ group, members, currentUser, onClose, onSettled }) {
  // Settle Up Logic:
  // 1. Who is paying? (Default: Current User)
  // 2. To whom? (Select from members)
  // 3. Amount?
  
  const [payer] = useState(currentUser.uid);
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter out payer from receiver list
  const possibleReceivers = Object.values(members).filter(m => m.uid !== payer);

  const handleSubmit = async () => {
      if (!amount || !receiver || !payer) return;
      setIsSubmitting(true);
      try {
          // Add Settle Up Transaction
          // We treat it as a special "payment" type spend or use a dedicated clear function.
          // Using `clearBalance` service.
          
          await clearBalance(group.id, payer, receiver, parseFloat(amount));
          
          onSettled(); 
          onClose(); // Close modal
      } catch (error) {
          alert('Error settling up: ' + error.message);
          setIsSubmitting(false);
      }
  };

  return (
    <div className="modal-backdrop fade-in" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
       <div className="add-spend-sheet">
           
           <div className="asm-header">
               <button onClick={onClose} className="btn-close">
                   <X size={24} />
               </button>
               <h2 className="text-base font-semibold">Settle Up</h2>
               <div style={{ width: 24 }}></div>
           </div>

           <div className="asm-content">
               
               <div className="text-center mb-4">
                   <p className="text-muted text-sm">Record a cash or online payment</p>
               </div>

               {/* Payer -> Receiver */}
               <div className="flex items-center justify-between gap-2 mb-6">
                   <div className="flex-1 flex flex-col items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-xs text-muted mb-1 font-bold">FROM</span>
                        <div className="w-10 h-10 rounded-full bg-gray-200 mb-2 overflow-hidden">
                            {members[payer]?.profilePhoto ? <img src={members[payer].profilePhoto} className="w-full h-full object-cover"/> : null}
                        </div>
                        <span className="font-semibold text-sm">{payer === currentUser.uid ? 'You' : members[payer]?.name}</span>
                   </div>
                   
                   <div className="text-muted">
                       <ArrowRight size={20} />
                   </div>

                   <div className="flex-1 flex flex-col items-center p-3 rounded-xl bg-gray-50 border border-gray-100 relative">
                        <span className="text-xs text-muted mb-1 font-bold">TO</span>
                        
                        {/* Receiver Selector */}
                        {receiver ? (
                             <>
                                <div className="w-10 h-10 rounded-full bg-blue-100 mb-2 overflow-hidden border-2 border-blue-500">
                                    {members[receiver]?.profilePhoto ? <img src={members[receiver].profilePhoto} className="w-full h-full object-cover"/> : null}
                                </div>
                                <span className="font-semibold text-sm">{members[receiver]?.name}</span>
                                <button onClick={() => setReceiver('')} className="absolute inset-0 w-full h-full opacity-0">Change</button>
                             </>
                        ) : (
                             <select 
                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                               onChange={e => setReceiver(e.target.value)}
                               value={receiver}
                             >
                                 <option value="">Select...</option>
                                 {possibleReceivers.map(m => (
                                     <option key={m.uid} value={m.uid}>{m.name}</option>
                                 ))}
                             </select>
                        )}
                        {!receiver && <div className="w-10 h-10 rounded-full bg-orange-100 mb-2 flex items-center justify-center text-orange-500 font-bold">?</div>}
                        {!receiver && <span className="text-sm text-orange-500 font-medium">Select</span>}
                   </div>
               </div>

               {/* Amount */}
               <div className="amount-display" style={{ padding: '1rem 0' }}>
                   <div className="amount-wrapper">
                       <span className="currency-symbol">₹</span>
                       <input 
                         autoFocus 
                         className="amount-input-lg" 
                         placeholder="0" 
                         type="number"
                         value={amount}
                         onChange={e => setAmount(e.target.value)}
                       />
                   </div>
               </div>

           </div>

           <div className="asm-footer">
               <button 
                 className="btn-save-lg bg-green-600 hover:bg-green-700 shadow-green-200"
                 disabled={!amount || !receiver || isSubmitting}
                 onClick={handleSubmit}
                 style={{ backgroundColor: '#10B981', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)' }}
               >
                   {isSubmitting ? 'Recording...' : 'Record Payment'}
               </button>
           </div>

       </div>
    </div>
  );
}
