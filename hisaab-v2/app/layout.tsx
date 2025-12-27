import './globals.css'
import { AuthProvider } from '../components/AuthContext'
import InstallPrompt from '../components/InstallPrompt'
import ServiceWorkerRegister from '../components/ServiceWorkerRegister'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hisaab',
  description: 'Minimal Expense Sharing',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="min-h-screen bg-[#f9f9f9] text-[#111418] dark:bg-[#101922] dark:text-white transition-colors duration-200">
        <AuthProvider>
            <ServiceWorkerRegister />
            <InstallPrompt />
            {children}
        </AuthProvider>
      </body>
    </html>
  )
}
