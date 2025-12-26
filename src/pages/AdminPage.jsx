import React, { useState, useEffect } from 'react';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Load Users (Only works if Rules allow!)
  const loadUsers = async () => {
    setLoading(true);
    try {
        const snap = await getDocs(collection(db, "users"));
        setUsers(snap.docs.map(d => d.data()));
    } catch (e) {
        console.error(e);
        setStatus("Error loading users. Check permissions.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
     loadUsers();
  }, []);

  const handleResetDB = async () => {
     if (!window.confirm("ARE YOU SURE? This will delete ALL GROUPS and MEMBERS local to your view (or all if admin). This is destructive.")) return;
     
     setLoading(true);
     setStatus("Deleting data...");
     
     try {
         // Naive "Reset": Delete all groups I can see
         const groupsSnap = await getDocs(collection(db, "groups"));
         const batch = writeBatch(db);
         let count = 0;
         
         groupsSnap.docs.forEach(d => {
             batch.delete(d.ref);
             count++;
         });
         
         // Also delete groupMembers
         const memSnap = await getDocs(collection(db, "groupMembers"));
         memSnap.docs.forEach(d => {
             batch.delete(d.ref);
             count++;
         });

         // Also delete spends
         const spendSnap = await getDocs(collection(db, "spends"));
         spendSnap.docs.forEach(d => {
             batch.delete(d.ref);
             count++;
         });

         // Also delete activityLogs
         const logSnap = await getDocs(collection(db, "activityLogs"));
         logSnap.docs.forEach(d => {
             batch.delete(d.ref);
             count++;
         });

         // Also delete users (This will force everyone to sign up again)
         const userSnap = await getDocs(collection(db, "users"));
         userSnap.docs.forEach(d => {
             batch.delete(d.ref);
             count++;
         });
         
         await batch.commit();
         setStatus(`Deleted ${count} documents. DB wiped (mostly).`);
         
     } catch (e) {
         console.error(e);
         setStatus("Error resetting DB: " + e.message);
     } finally {
         setLoading(false);
     }
  };

  return (
    <div className="container">
      <header className="flex items-center gap-4 mb-6" style={{ paddingTop: '1rem' }}>
        <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold" style={{ fontSize: '1.2rem' }}>Admin / Reset</h1>
      </header>
      
      <div className="card mb-4 border-danger" style={{ borderColor: '#EF4444' }}>
          <h3 className="font-bold text-danger mb-2">Danger Zone</h3>
          <p className="text-sm text-muted mb-4">Wipe all groups, spends, and members.</p>
          <button className="btn btn-danger w-full" onClick={handleResetDB} disabled={loading}>
              <Trash2 size={18} style={{ marginRight: 8 }} /> Reset Database (Hisaab)
          </button>
          {status && <p className="mt-2 text-sm font-bold">{status}</p>}
      </div>

      <h3 className="font-bold mb-4">Registered Users ({users.length})</h3>
      {users.length === 0 && <p className="text-muted">No users visible (Check Rules).</p>}
      
      <div className="flex flex-col gap-2">
          {users.map(u => (
              <div key={u.uid} className="card p-4 flex justify-between items-center" style={{ marginBottom: 0 }}>
                  <div className="flex items-center gap-2">
                       <img src={u.profilePhoto} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                       <div>
                           <div className="font-bold text-sm">{u.name}</div>
                           <div className="text-xs text-muted">{u.email}</div>
                       </div>
                  </div>
                  <div className="text-xs text-muted">
                      {u.uid.substring(0, 6)}...
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}
