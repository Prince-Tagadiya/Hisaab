import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Save, User, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { currentUser, userProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || currentUser?.displayName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: name
      });
      alert("Profile updated!");
    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="main-header">
         <div className="header-left">
            <Link to="/dashboard" className="icon-btn">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="brand-name" style={{ fontSize: '1.25rem', marginLeft: '0.5rem' }}>Profile</h1>
         </div>
      </header>

      <main className="main-content" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        
        <div className="profile-card fade-in">
             <div className="pc-header">
                 <div className="large-avatar">
                     {currentUser?.photoURL ? 
                        <img src={currentUser.photoURL} alt="Profile" /> : 
                        <div className="initials">{name?.[0]}</div>
                     }
                 </div>
                 <h2 className="pc-name">{name || "User"}</h2>
                 <span className="pc-email">{currentUser?.email}</span>
             </div>

             <div className="pc-form">
                 <div className="input-group">
                     <div className="input-icon"><User size={18}/></div>
                     <input 
                       className="input-field" 
                       value={name} 
                       onChange={e => setName(e.target.value)} 
                       placeholder="Display Name"
                     />
                 </div>
                 <div className="input-group disabled">
                     <div className="input-icon"><Mail size={18}/></div>
                     <input 
                       className="input-field" 
                       value={currentUser?.email} 
                       disabled 
                     />
                 </div>
                 <div className="input-group disabled">
                     <div className="input-icon"><Calendar size={18}/></div>
                     <input 
                       className="input-field" 
                       value={`Joined ${userProfile?.createdAt?.toDate().toLocaleDateString() || 'Recently'}`} 
                       disabled 
                     />
                 </div>
             </div>

             <div className="pc-actions">
                 <button 
                  className="btn-save-lg" 
                  onClick={handleSave} 
                  disabled={saving}
                 >
                     {saving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                 </button>
             </div>
        </div>

      </main>
    </div>
  );
}
