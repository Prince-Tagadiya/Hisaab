import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { Check, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateAccountPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");

  // States
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null); // null, true, false
  const [loading, setLoading] = useState(false);

  // Validation


  // Debounce for username check
  useEffect(() => {
    const timer = setTimeout(() => {
       if (username && username.length >= 4) {
          checkUsernameAvailability(username);
       } else {
          setUsernameAvailable(null);
          setCheckingUsername(false);
       }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  // Username Logic
  const handleUsernameChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''); // Enforce constraints
    setUsername(val);
    setCheckingUsername(true);
    setUsernameAvailable(null); // Reset while typing
  };

  const checkUsernameAvailability = async (userStr) => {
     try {
       const q = query(collection(db, "users"), where("username", "==", userStr));
       const snap = await getDocs(q);
       if (snap.empty) {
          setUsernameAvailable(true);
       } else {
          setUsernameAvailable(false);
       }
     } catch (e) {
       console.error(e);
       setUsernameAvailable(null); // Error state
     } finally {
       setCheckingUsername(false);
     }
  };

  // derived validity
  const isFormValid = 
     firstName.trim().length > 0 && 
     lastName.trim().length > 0 && 
     username.length >= 4 && 
     usernameAvailable === true && 
     !loading;

  const handleSubmit = async () => {
     if (!isFormValid) return;
     setLoading(true);

     try {
       const userRef = doc(db, "users", currentUser.uid);
       const newProfile = {
           uid: currentUser.uid,
           firstName: firstName.trim(),
           lastName: lastName.trim(),
           // Name combination for display
           name: `${firstName.trim()} ${lastName.trim()}`, 
           username: username,
           email: currentUser.email,
           photoURL: currentUser.photoURL,
           mobile: mobile || "",
           createdAt: serverTimestamp(),
           lastActiveAt: serverTimestamp(),
           settings: {
             theme: "light",
             notifications: true
           },
           stats: {
             totalSpendsAdded: 0,
             totalClears: 0,
             favorCount: 0
           }
       };

       await setDoc(userRef, newProfile);
       // Navigate handled by AuthContext listener, but we can force it
       navigate('/dashboard');

     } catch (e) {
        console.error(e);
        alert("Error creating account: " + e.message);
        setLoading(false);
     }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-10 fade-in">
       
       <div className="w-full max-w-[420px]">
          {/* Header */}
          <div className="text-center mb-10">
             <h1 className="font-bold text-2xl mb-2">Create your account</h1>
             <p className="text-muted text-sm">Just a few details to get started.</p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6">
             
             {/* Names */}
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <input 
                    className="input w-full p-3 font-medium" 
                    placeholder="First name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                    autoFocus
                  />
               </div>
               <div>
                  <input 
                    className="input w-full p-3 font-medium" 
                    placeholder="Last name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  />
               </div>
             </div>

             {/* Username */}
             <div>
                <div className="relative">
                  <input 
                    className="input w-full p-3 font-medium lowercase" 
                    placeholder="Choose a username"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  <div className="absolute right-3 top-3.5">
                     {checkingUsername && <span className="w-2 h-2 rounded-full bg-gray-400 block animate-pulse"></span>}
                     {!checkingUsername && usernameAvailable === true && <Check size={18} className="text-green-500" />}
                     {!checkingUsername && usernameAvailable === false && <X size={18} className="text-red-500" />}
                  </div>
                </div>
                
                {/* Username Checklist / Feedback */}
                <div className="mt-2 text-xs flex flex-col gap-1 pl-1">
                   {usernameAvailable === false && <span className="text-red-500 font-medium">Username is taken</span>}
                   {usernameAvailable === true && <span className="text-green-600 font-medium">Username available</span>}
                   <span className={username.length >= 4 ? "text-green-600" : "text-muted"}>
                      {username.length >= 4 ? "✔" : "•"} At least 4 characters
                   </span>
                </div>
             </div>

             {/* Mobile (Optional) */}
             <div>
                <input 
                    className="input w-full p-3 font-medium" 
                    type="number"
                    placeholder="Mobile number (optional)"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                  />
                <p className="text-xs text-muted mt-2 ml-1">Used only for group visibility.</p>
             </div>

          </div>

          {/* Action */}
          <div className="mt-10">
             <button 
                className={`btn btn-primary w-full py-3.5 rounded-full font-bold text-lg transition-transform active:scale-95 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isFormValid}
                onClick={handleSubmit}
             >
                {loading ? <Loader2 className="animate-spin mx-auto"/> : "Create Account"}
             </button>
          </div>

       </div>

    </div>
  );
}
