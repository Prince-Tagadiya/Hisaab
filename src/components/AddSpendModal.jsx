import React, { useState } from 'react';
import { X, Edit3 } from 'lucide-react';

export default function AddSpendModal({ members, currentUser, onClose, onAdd }) {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paidBy, setPaidBy] = useState(currentUser.uid); // Default: You
  // For Phase 1, we assume simple equal split among all members as default
  // Can expand to "Partner Paid" or specific selection later if needed.

  const isValid = amount && parseFloat(amount) > 0 && title.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    
    // Construct simplified payload
    // GroupPage logic handles the "splitBetween" logic effectively
    // We send: { title, amount, paidBy, shares: [], ... }
    
    // Default: Split equally among all members
    const allMemberIds = Object.keys(members);
    const numMembers = allMemberIds.length;
    const shareAmount = parseFloat(amount) / numMembers;
    
    const shares = allMemberIds.map(uid => ({
        uid,
        amount: shareAmount
    }));

    onAdd({
        title,
        amount: parseFloat(amount),
        paidBy,
        shares, 
        splitType: 'EQUAL'
    });
  };

  return (
    <div className="modal-backdrop fade-in" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
       <div className="add-spend-sheet">
           
           {/* Header */}
           <div className="asm-header">
               <button onClick={onClose} className="btn-close">
                   <X size={24} />
               </button>
               <h2 className="text-base font-semibold">New Expense</h2>
               <button className="btn-text" onClick={() => { setAmount(''); setTitle(''); }}>Clear</button>
           </div>

           {/* Content */}
           <div className="asm-content">
               
               {/* Amount */}
               <div className="amount-display">
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

               {/* Toggle: You Paid / Partner Paid */}
               <div className="toggle-row">
                   <button 
                     className={`toggle-btn ${paidBy === currentUser.uid ? 'active' : ''}`}
                     onClick={() => setPaidBy(currentUser.uid)}
                   >
                       You paid
                   </button>
                   <button 
                     className={`toggle-btn ${paidBy !== currentUser.uid ? 'active' : ''}`}
                     onClick={() => {
                         // Find first other member or rotate? 
                         // For now, simpler logic: iterate to next member or show modal?
                         // Let's just pick the first other member for the UI toggle effect
                         // A better UI would be a dropdown.
                         
                         const others = Object.keys(members).filter(id => id !== currentUser.uid);
                         if (others.length > 0) {
                             if (paidBy === currentUser.uid) {
                                  setPaidBy(others[0]); 
                             } else {
                                  // If already someone else, maybe rotate?
                                  // This is a simple toggle for "Partner" logic (2 people)
                                  // For >2, we might want a dropdown.
                                  // We'll stick to a simple toggle behavior: if current is You, switch to [0], else switch to You (if clicked You)
                                  // But here we are clicking the "Partner paid" button.
                                  // If I click Partner Paid, I want to see the partner name.
                                  
                                  // Optimization: if >2 members, show dropdown?
                                  // Let's just cycle for now or keep it simple.
                                  setPaidBy(others[0]); 
                             }
                         }
                     }}
                   >
                       {paidBy !== currentUser.uid && members[paidBy] ? members[paidBy].name : 'Partner'} paid
                   </button>
               </div>

               {/* Note Input */}
               <div className="input-group">
                   <div className="input-icon">
                       <Edit3 size={20} />
                   </div>
                   <input 
                     className="input-field" 
                     placeholder="What is this for?" 
                     type="text"
                     value={title}
                     onChange={e => setTitle(e.target.value)}
                   />
               </div>

           </div>

           {/* Footer */}
           <div className="asm-footer">
               <button 
                 className="btn-save-lg" 
                 disabled={!isValid}
                 onClick={handleSubmit}
               >
                   Save Expense
               </button>
           </div>

       </div>
    </div>
  );
}
