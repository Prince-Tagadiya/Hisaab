import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Download } from 'lucide-react';

export default function InstallPrompter() {
  const { userProfile } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check condition: User logged in AND added first spend
      // If userProfile not loaded yet, wait.
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    if (deferredPrompt && userProfile) {
      // Condition: User has added at least one spend OR just logged in for now if stats missing
      // Logic: (userProfile.stats?.totalSpendsAdded > 0)
      // For Phase 1 robustness, if stats is undefined (old user), maybe show it anyway or default true?
      // Let's stick to the rule: "User added their first spend".
      
      const hasAddedSpend = userProfile.stats?.totalSpendsAdded > 0;
      
      if (hasAddedSpend) {
          setTimeout(() => setShowBanner(true), 0);
      }
    }
  }, [deferredPrompt, userProfile]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="card slide-up" style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      right: '1rem',
      zIndex: 1000, // Above FAB? Maybe. FAB is z-index 100.
      background: '#fff',
      border: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      marginBottom: 0
    }}>
      <div className="flex items-start gap-3">
        <div style={{ padding: '8px', background: '#EEF2FF', borderRadius: '8px' }}>
            <Download size={20} className="text-primary" />
        </div>
        <div>
            <h4 className="font-bold text-sm">Install Hisab</h4>
            <p className="text-sm text-muted">Add to home screen for faster access.</p>
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setShowBanner(false)}>Not now</button>
        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={handleInstallClick}>Install</button>
      </div>
    </div>
  );
}
