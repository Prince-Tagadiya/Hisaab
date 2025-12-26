import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { addSpend, getGroupSpends, getGroupBalances } from '../services/expenseService';
import { deleteGroup as deleteGroupService } from '../services/groupService';
import { ArrowLeft, Plus, ChevronRight, BarChart3, Receipt, Utensils, Home, Car, ShoppingBag, Trash2 } from 'lucide-react';
import AddSpendModal from '../components/AddSpendModal';
import SettleUpModal from '../components/SettleUpModal';

export default function GroupPage() {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState({}); // uid -> { name, email }
  const [spends, setSpends] = useState([]);
  const [balances, setBalances] = useState({});
  const [showAddSpend, setShowAddSpend] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);

  // Derived State
  const totalGroupSpend = useMemo(() => {
    return spends
      .filter(s => s.type !== 'payment')
      .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  }, [spends]);
  
  const loadGroupData = React.useCallback(async () => {
    try {
      // 1. Group Info
      const gSnap = await getDoc(doc(db, "groups", groupId));
      if (gSnap.exists()) {
        setGroup({ id: gSnap.id, ...gSnap.data() });
      }

      // 2. Balances & Spends
      const [bal, sp] = await Promise.all([
        getGroupBalances(groupId),
        getGroupSpends(groupId)
      ]);
      setBalances(bal);
      setSpends(sp);

      // 3. Members
      const q = query(collection(db, "groupMembers"), where("groupId", "==", groupId));
      const memberSnaps = await getDocs(q);
      
      const memberData = {};
      const userPromises = memberSnaps.docs.map(async (mDoc) => {
        const uid = mDoc.data().uid;
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
            // Merge profile photo if available, fallback to basic data
            memberData[uid] = { ...userSnap.data(), uid }; 
        }
      });
      await Promise.all(userPromises);
      setMembers(memberData);

    } catch (error) {
      console.error("Error loading group", error);
    }
  }, [groupId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGroupData();
  }, [loadGroupData]);

  // Actions
  const handleDeleteGroup = async () => {
     if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;
     
     try {
         await deleteGroupService(groupId);
         navigate('/dashboard');
     } catch (error) {
         console.error(error);
         alert("Failed to delete group");
     }
  };

  // Helpers
  const getCategoryIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('food') || t.includes('dinner') || t.includes('lunch')) return <Utensils size={20} />;
    if (t.includes('cab') || t.includes('uber') || t.includes('travel')) return <Car size={20} />;
    if (t.includes('grocery') || t.includes('market')) return <ShoppingBag size={20} />;
    return <Receipt size={20} />;
  };

  const getCategoryColor = (title) => {
    const t = title.toLowerCase();
    if (t.includes('food')) return 'icon-orange';
    if (t.includes('cab')) return 'icon-blue';
    return 'icon-default'; // Define in CSS
  };

  return (
    <div className="dashboard-container group-page-con">
       <main className="main-content">
          
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
              <Link to="/dashboard" className="crumb-link">Dashboard</Link>
              <ChevronRight size={14} className="crumb-sep" />
              <Link to="/dashboard" className="crumb-link">Groups</Link>
              <ChevronRight size={14} className="crumb-sep" />
              <span className="crumb-active">{group ? group.name : 'Loading...'}</span>
          </div>

          {/* Header */}
          <div className="group-header">
              <div className="gh-left">
                  <h1 className="page-title">{group ? group.name : '...'}</h1>
                  <div className="gh-meta">
                      <div className="members-badge">
                        {Object.keys(members).length} Members
                      </div>
                      <span className="invite-code">Code: {group?.inviteCode}</span>
                  </div>
              </div>
              <div className="gh-actions">
                  {group?.createdBy === currentUser.uid && (
                      <button className="btn btn-outline-danger" onClick={handleDeleteGroup} style={{ borderColor: '#FCA5A5', color: '#DC2626', marginRight: '0.5rem' }} title="Delete Group">
                          <Trash2 size={18} />
                      </button>
                  )}
                  <button className="btn btn-outline"  onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
                      <BarChart3 size={18} /> Balances
                  </button>
                  <button className="btn btn-primary" onClick={() => setShowAddSpend(true)}>
                      <Plus size={18} /> Add Expense
                  </button>
              </div>
          </div>

          {/* 2-Column Grid */}
          <div className="group-grid">
              
              {/* LEFT: Expenses Stream */}
              <div className="feed-column">
                  {spends.length > 0 ? (
                    <>
                      <h3 className="section-label">LATEST EXPENSES</h3>
                      <div className="spends-list">
                          {spends.map(spend => {
                            const isPayment = spend.type === 'payment';
                            if (isPayment) {
                                return (
                                    <div key={spend.id} className="spend-card payment-card" style={{ borderLeft: '4px solid #10B981', background: '#F0FDF4' }}>
                                        <div className="spend-icon" style={{ background: '#D1FAE5', color: '#059669' }}>
                                            <Receipt size={20} />
                                        </div>
                                        <div className="spend-info">
                                            <div className="si-top">
                                                <h4 className="text-success">Payment</h4>
                                                <span className="spend-amt text-success">₹{spend.amount}</span>
                                            </div>
                                            <div className="si-bot">
                                                <span className="paid-by">
                                                    {members[spend.paidBy]?.name || 'Unknown'} paid {spend.sharedWith?.[0] ? members[spend.sharedWith[0].uid]?.name : 'someone'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={spend.id} className="spend-card">
                                    <div className={`spend-icon ${getCategoryColor(spend.title)}`}>
                                        {getCategoryIcon(spend.title)}
                                    </div>
                                    <div className="spend-info">
                                        <div className="si-top">
                                            <h4>{spend.title}</h4>
                                            <span className="spend-amt">₹{spend.amount}</span>
                                        </div>
                                        <div className="si-bot">
                                            <span className="paid-by">
                                                {members[spend.paidBy]?.name === currentUser.displayName ? 'You' : members[spend.paidBy]?.name} paid
                                            </span>
                                            <span className="borrow-tag">Split equally</span> 
                                        </div>
                                    </div>
                                </div>
                            );
                          })}
                      </div>
                    </>
                  ) : (
                    <div className="empty-state">
                        <p>No expenses yet. Add one to get started!</p>
                    </div>
                  )}
              </div>

              {/* RIGHT: Sticky Sidebar */}
              <div className="sidebar-column">
                  
                  {/* Total Card */}
                  <div className="stat-card primary-gradient">
                      <div className="sc-content">
                          <p className="sc-label">Total Group Spend</p>
                          <h3 className="sc-value">₹{totalGroupSpend.toLocaleString()}</h3>
                      </div>
                  </div>

                  {/* Balances Card */}
                  <div className="balances-card">
                      <div className="bc-header">
                          <h2>Group Balances</h2>
                      </div>
                      <div className="bc-list">
                          {Object.entries(balances)
                             .filter(([uid]) => uid !== currentUser.uid) 
                             .map(([uid, amount]) => (
                              <div key={uid} className="balance-row">
                                  <div className="u-avatar">
                                      {members[uid]?.profilePhoto ? <img src={members[uid].profilePhoto} alt="" /> : <div className="u-initial">{members[uid]?.name?.[0]}</div>}
                                  </div>
                                  <div className="u-info">
                                      <p className="u-name">{members[uid]?.name}</p>
                                      <p className={`u-status ${amount > 0 ? 'text-success' : amount < 0 ? 'text-danger' : 'text-muted'}`}>
                                          {amount > 0 ? `Gets back ₹${amount.toFixed(0)}` : amount < 0 ? `Owes ₹${Math.abs(amount).toFixed(0)}` : 'Settled'}
                                      </p>
                                  </div>
                              </div>
                          ))}
                          {Object.keys(balances).length === 0 && <p className="text-muted p-4 text-sm">No balances yet.</p>}
                      </div>
                      <div className="bc-footer">
                           <button className="btn btn-full btn-outline-sm" onClick={() => setShowSettleUp(true)}>Settle Up</button>
                      </div>
                  </div>

              </div>

          </div>

       </main>

       {showAddSpend && (
        <AddSpendModal 
          members={members}
          currentUser={currentUser}
          onClose={() => setShowAddSpend(false)}
          onAdd={async (data) => {
             const payload = {
                 ...data,
                 splitBetween: data.shares.map(s => s.uid),
             };
             await addSpend(groupId, payload);
             setShowAddSpend(false);
             loadGroupData();
          }}
        />
      )}

      {showSettleUp && (
          <SettleUpModal 
             group={group}
             members={members}
             currentUser={currentUser}
             onClose={() => setShowSettleUp(false)}
             onSettled={() => {
                 loadGroupData();
             }}
          />
      )}
    </div>
  );
}
