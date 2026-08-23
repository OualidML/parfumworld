import { Routes, Route } from 'react-router-dom'
import NotePicker from './pages/NotePicker'
import Results from './pages/Results'
import PerfumeDetails from './pages/PerfumeDetails'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import WishlistPage from './pages/WishlistPage'
import ClientOnboarding from './pages/ClientOnboarding'

function App() {
  return (
    <Routes>
      <Route path="/" element={<NotePicker />} />
      <Route path="/results" element={<Results />} />
      <Route path="/perfume/:id" element={<PerfumeDetails />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/onboard" element={<ClientOnboarding />} />
      <Route path="/wishlist" element={<WishlistPage />} />
    </Routes>
  )
}



export default App
