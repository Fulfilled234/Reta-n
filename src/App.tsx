import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import ShopSetup from './pages/ShopSetup'
import Today from './pages/Today'
import LogVisit from './pages/LogVisit'
import { Privacy, Terms } from './pages/Legal'
import { useShop } from './context/ShopContext'

function RequireShop({ children }: { children: JSX.Element }) {
  const { shop, loading } = useShop()
  if (loading) return <FullScreenLoader />
  if (!shop) return <Navigate to="/shop-setup" replace />
  return children
}

function FullScreenLoader() {
  return (
    <div className="min-h-full flex items-center justify-center bg-paper">
      <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/shop-setup" element={<ShopSetup />} />
      <Route
        path="/today"
        element={
          <RequireShop>
            <Today />
          </RequireShop>
        }
      />
      <Route
        path="/log-visit"
        element={
          <RequireShop>
            <LogVisit />
          </RequireShop>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
