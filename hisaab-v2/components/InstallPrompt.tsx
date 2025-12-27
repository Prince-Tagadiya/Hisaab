'use client';
import { useState, useEffect } from 'react';
import { Download, X, CheckCircle, MonitorDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setIsVisible(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Development testing fallback: Un-comment to see the UI immediately in dev
    //  setTimeout(() => setIsVisible(true), 1000);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-full"
        >
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 relative">
            
            {/* Close Button */}
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex gap-4">
              {/* Icon Box */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2b8cee]">
                  <MonitorDown size={24} strokeWidth={2} />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 pr-6">
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">Install Hisab for Desktop</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Experience faster load times and access your shared expenses even when you're offline.
                </p>

                {/* Features */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-green-500 fill-green-500 text-white" />
                      <span className="text-sm font-medium text-slate-600">Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-green-500 fill-green-500 text-white" />
                      <span className="text-sm font-medium text-slate-600">Offline Mode</span>
                    </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleInstall}
                    className="bg-[#2b8cee] hover:bg-[#1a6bb5] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Install App
                  </button>
                  <button 
                    onClick={handleDismiss}
                    className="text-slate-500 hover:text-slate-700 font-semibold text-sm transition-colors"
                  >
                    Not Now
                  </button>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
