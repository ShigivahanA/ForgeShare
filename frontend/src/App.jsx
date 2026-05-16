import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Auth from './pages/Auth'
import ForgotPassword from './pages/ForgotPassword'
import Onboarding from './pages/Onboarding'
import Marketplace from './pages/Marketplace'
import RentTool from './pages/RentTool'
import ListTool from './pages/ListTool'
import ToolDetails from './pages/ToolDetails'
import BookingFlow from './pages/BookingFlow'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import BookingHistory from './pages/BookingHistory'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminContent from './pages/AdminContent'
import StoryDetail from './pages/StoryDetail'
import NotFound from './pages/NotFound'
import HowItWorks from './pages/HowItWorks'
import OurMakers from './pages/OurMakers'
import MakerStories from './pages/MakerStories'
import SafetyTrust from './pages/SafetyTrust'
import About from './pages/About'
import Support from './pages/Support'
import PressRoom from './pages/PressRoom'
import Insurance from './pages/Insurance'
import TheCraft from './pages/TheCraft'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Verification from './pages/Verification'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

import { useAuth } from './context/AuthContext'
import ConsentModal from './components/auth/ConsentModal'

function App() {
  const { user } = useAuth()
  const location = useLocation()
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname) || 
                    location.pathname.startsWith('/resetpassword/') || 
                    location.pathname.startsWith('/verifyemail/')

  // Determine if we should show the global consent modal
  const showGlobalConsent = user && 
                           user.onboardingCompleted && 
                           !user.termsAccepted && 
                           !location.pathname.startsWith('/onboarding')

  return (
    <div className="min-h-screen bg-artisan-dark">
      {showGlobalConsent && <ConsentModal onComplete={() => {}} />}
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/verification" element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/rent" element={<RentTool />} />
          <Route path="/list" element={
            <ProtectedRoute>
              <ListTool />
            </ProtectedRoute>
          } />
          <Route path="/tool/:id" element={<ToolDetails />} />
          <Route path="/checkout/:id" element={
            <ProtectedRoute>
              <BookingFlow />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/content" element={
            <ProtectedRoute>
              <AdminContent />
            </ProtectedRoute>
          } />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/our-makers" element={<OurMakers />} />
          <Route path="/maker-stories" element={<MakerStories />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/safety" element={<SafetyTrust />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/press" element={<PressRoom />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/the-craft" element={<TheCraft />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/verifyemail/:token" element={<VerifyEmail />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default App
