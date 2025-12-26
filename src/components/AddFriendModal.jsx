import React, { useState } from 'react';
import { X, Search, UserPlus, Check } from 'lucide-react';
import { searchUserByEmail, sendFriendRequest } from '../services/friendService';

export default function AddFriendModal({ currentUser, onClose, onAdded }) {
  const [email, setEmail] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null); // null, user object, or 'not-found'
  const [adding, setAdding] = useState(false);

  const handleSearch = async (e) => {
      e.preventDefault();
      if (!email.trim()) return;
      
      setSearching(true);
      setResult(null);
      
      try {
          const user = await searchUserByEmail(email.trim());
          setResult(user || 'not-found');
      } catch (err) {
          console.error(err);
          alert("Error searching user");
      } finally {
          setSearching(false);
      }
  };

  const handleAdd = async () => {
      if (!result || result === 'not-found') return;
      
      setAdding(true);
      try {
          await sendFriendRequest(currentUser, result);
          alert("Friend request sent!");
          // onAdded(); // No need to refresh list immediately as it's pending
          onClose(); // Close modal
      } catch (err) {
          console.error(err);
          alert(err.message); // Show "Already friends" or "Request pending"
      } finally {
          setAdding(false);
      }
  };

  return (
    <div className="modal-backdrop fade-in" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
       <div className="add-spend-sheet">
           
           <div className="asm-header">
               <button onClick={onClose} className="btn-close">
                   <X size={24} />
               </button>
               <h2 className="text-base font-semibold">Add Friend</h2>
               <div style={{ width: 24 }}></div>
           </div>

           <div className="asm-content">
               <p className="text-muted text-sm text-center mb-4">
                   Enter your friend's email address to find and add them to your contacts.
               </p>

               <form onSubmit={handleSearch} className="flex gap-2">
                   <div className="input-group flex-1">
                       <input 
                         className="input-field" 
                         placeholder="friend@example.com" 
                         type="email"
                         value={email}
                         onChange={e => setEmail(e.target.value)}
                         autoFocus
                       />
                   </div>
                   <button 
                     type="submit"
                     className="btn btn-primary" 
                     style={{ width: 'auto', padding: '0 1.2rem', borderRadius: 12, height: 'auto' }}
                     disabled={searching || !email}
                   >
                       {searching ? '...' : <Search size={20} />}
                   </button>
               </form>

               {/* Result Area */}
               <div style={{ minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   {searching && <div className="spinner"></div>}
                   
                   {!searching && result === 'not-found' && (
                       <div className="text-center fade-in">
                           <div className="text-muted mb-2">🤷‍♂️</div>
                           <p className="text-sm font-medium text-muted">User not found</p>
                       </div>
                   )}

                   {!searching && result && result !== 'not-found' && (
                       <div className="friend-result fade-in" style={{ 
                           background: '#F3F4F6', 
                           padding: '1rem', 
                           borderRadius: 16, 
                           width: '100%', 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: '1rem' 
                       }}>
                           <div className="large-avatar" style={{ width: 50, height: 50, marginBottom: 0, border: 'none' }}>
                               {result.photoURL ? <img src={result.photoURL} /> : <div className="initials" style={{ fontSize: '1.2rem' }}>{result.name?.[0]}</div>}
                           </div>
                           <div className="flex-1">
                               <h4 className="font-bold text-sm">{result.name}</h4>
                               <p className="text-xs text-muted">{result.email}</p>
                           </div>
                           {/* Check if self */}
                           {result.uid === currentUser.uid ? (
                               <span className="text-xs font-bold text-muted">That's you!</span>
                           ) : (
                               <button 
                                 className="btn btn-primary" 
                                 style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                 onClick={handleAdd}
                                 disabled={adding}
                               >
                                  {adding ? '...' : <UserPlus size={18} />}
                               </button>
                           )}
                       </div>
                   )}
               </div>

           </div>
       </div>
    </div>
  );
}
