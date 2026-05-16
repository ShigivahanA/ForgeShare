import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
   UserCheck,
   MapPin,
   Hammer,
   Settings,
   LogOut,
   Box,
   History,
   Star,
   Plus,
   ArrowRight,
   ShieldCheck,
   Loader2,
   Trash2,
   Eye,
   EyeOff,
   X,
   CreditCard,
   Shield
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

export default function Profile() {
   const { user, logout, updateProfile, uploadAvatar, deleteAvatar } = useAuth()
   const { addToast } = useToast()
   const navigate = useNavigate()
   const [activeTab, setActiveTab] = useState('arsenal')
   const [userTools, setUserTools] = useState([])
   const [activeRentals, setActiveRentals] = useState([])
   const [incomingRequests, setIncomingRequests] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
   const [managingTool, setManagingTool] = useState(null)
   const [viewingBooking, setViewingBooking] = useState(null)

   const [isEditing, setIsEditing] = useState(false)
   const [editData, setEditData] = useState({
      name: '',
      bio: '',
      address: ''
   })
   const [isChangingPassword, setIsChangingPassword] = useState(false)
   const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      otp: ''
   })
   const [showPasswords, setShowPasswords] = useState({
      current: false,
      new: false,
      confirm: false
   })
   const [isSettingUp2FA, setIsSettingUp2FA] = useState(false)
   const [twoFactorStep, setTwoFactorStep] = useState('initial') // initial, verify
   const [twoFactorOTP, setTwoFactorOTP] = useState('')

   const fetchProfileData = async (retryCount = 0) => {
      const userId = user?._id || user?.id
      if (!userId) return
      
      try {
         setLoading(true)
         
         // Fetch tools and bookings in parallel for better performance
         const [toolsRes, bookingsRes] = await Promise.all([
            api.get(`/listings?owner=${userId}`),
            api.get('/bookings')
         ])

         setUserTools(toolsRes.data.data)

         const borrowed = bookingsRes.data.data.filter(b => 
            (b.renter._id === userId || b.renter === userId)
         )
         const incoming = bookingsRes.data.data.filter(b => 
            (b.owner._id === userId || b.owner === userId)
         )
         
         setActiveRentals(borrowed)
         setIncomingRequests(incoming)
         setError(null)
      } catch (err) {
         console.error(`Attempt ${retryCount + 1} failed:`, err)
         
         // Retry once if it fails on the first visit
         if (retryCount < 1) {
            setTimeout(() => fetchProfileData(retryCount + 1), 500)
            return
         }
         
         addToast('System link unstable. Re-syncing terminal...', 'error')
      } finally {
         setLoading(false)
      }
   }

   const handleUpdateBookingStatus = async (bookingId, status) => {
      try {
         setLoading(true)
         await api.put(`/bookings/${bookingId}/status`, { status })
         addToast(`Request ${status === 'confirmed' ? 'Authorized' : 'Cancelled'}`, 'success')
         fetchProfileData()
      } catch (err) {
         addToast('Action failed', 'error')
      } finally {
         setLoading(false)
      }
   }

   const handleReturnBooking = async (id) => {
      try {
         setLoading(true)
         await api.put(`/bookings/${id}/return`)
         addToast('Gear marked as returned', 'success')
         fetchProfileData()
      } catch (err) {
         addToast('Failed to mark return', 'error')
      } finally {
         setLoading(false)
      }
   }

   const handleCompleteBooking = async (id) => {
      try {
         setLoading(true)
         await api.put(`/bookings/${id}/complete`)
         addToast('Booking completed', 'success')
         fetchProfileData()
      } catch (err) {
         addToast('Failed to complete booking', 'error')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      if (user) {
         fetchProfileData()
         setEditData({
            name: user.name,
            bio: user.bio || '',
            address: user.onboardingData?.location?.address || ''
         })
      }
   }, [user])

   const handleUpdateProfile = async (e) => {
      e.preventDefault()
      try {
         setLoading(true)
         await updateProfile({
            name: editData.name,
            bio: editData.bio,
            location: {
               ...user.onboardingData?.location,
               address: editData.address
            }
         })
         addToast('Profile updated successfully', 'success')
         setIsEditing(false)
      } catch (err) {
         addToast('Update failed', 'error')
      } finally {
         setLoading(false)
      }
   }

   const handleImageUpload = async (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onloadend = async () => {
         try {
            setLoading(true)
            await uploadAvatar(reader.result)
            addToast('Avatar updated successfully', 'success')
         } catch (err) {
            addToast('Failed to upload image', 'error')
         } finally {
            setLoading(false)
         }
      }
      reader.readAsDataURL(file)
   }

   const handleDeleteAvatar = async () => {
      if (!window.confirm('Are you sure you want to remove your profile picture?')) return
      try {
         setLoading(true)
         await deleteAvatar()
         addToast('Avatar removed', 'success')
      } catch (err) {
         addToast('Failed to remove image', 'error')
      } finally {
         setLoading(false)
      }
   }

   const handleToggleActive = async (toolId, currentState) => {
      try {
         await api.put(`/listings/${toolId}`, { isActive: !currentState })
         addToast(`Listing ${!currentState ? 'Enabled' : 'Disabled'}`, 'success')
         setUserTools(prev => prev.map(t => t._id === toolId ? { ...t, isActive: !currentState } : t))
         setManagingTool(null)
      } catch (err) {
         addToast('Action failed', 'error')
      }
   }

   const handleDeleteTool = async (toolId) => {
      if (!window.confirm('IRREVERSIBLE: This will remove the gear from the guild collection. Confirm deletion?')) return
      try {
         await api.delete(`/listings/${toolId}`)
         addToast('Gear removed permanently', 'success')
         setUserTools(prev => prev.filter(t => t._id !== toolId))
         setManagingTool(null)
      } catch (err) {
         addToast('Deletion failed', 'error')
      }
   }

   const handleLogout = async () => {
      try {
         await logout()
         addToast('Successfully logged out', 'success')
         navigate('/login')
      } catch (err) {
         addToast('Logout failed', 'error')
      }
   }

   const handleChangePassword = async (e) => {
      e.preventDefault()
      
      // If OTP is not yet sent/entered, we might need a step for it
      if (!passwordData.otp && isChangingPassword) {
         try {
            setLoading(true)
            await api.post('/auth/sendotp')
            addToast('Security code sent to your email', 'success')
            // We just stay in the same modal but now show the OTP field
            return
         } catch (err) {
            addToast('Failed to send security code', 'error')
            return
         } finally {
            setLoading(false)
         }
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
         addToast('Passwords do not match', 'error')
         return
      }
      
      if (passwordData.newPassword.length < 6) {
         addToast('Password must be at least 6 characters', 'error')
         return
      }

      try {
         setLoading(true)
         await api.put('/auth/updatepassword', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            otp: passwordData.otp
         })
         addToast('Security credentials updated', 'success')
         setIsChangingPassword(false)
         setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '', otp: '' })
      } catch (err) {
         addToast(err.response?.data?.error || 'Security verification failed', 'error')
      } finally {
         setLoading(false)
      }
   }

   const handleToggle2FA = async (enable) => {
      if (enable) {
         // Start setup flow
         setIsSettingUp2FA(true)
         setTwoFactorStep('initial')
         return
      }

      // Deactivating 2FA
      try {
         setLoading(true)
         await api.put('/auth/toggle2fa', { enable: false })
         addToast('Two-Factor Authentication Deactivated', 'success')
         await updateProfile({ twoFactorEnabled: false })
      } catch (err) {
         addToast('Failed to update security settings', 'error')
      } finally {
         setLoading(false)
      }
   }

   const handleSetup2FA = async () => {
      try {
         setLoading(true)
         if (twoFactorStep === 'initial') {
            await api.post('/auth/sendotp')
            setTwoFactorStep('verify')
            addToast('Verification code sent to email', 'success')
         } else {
            // Verify and enable
            await api.put('/auth/toggle2fa', { enable: true, otp: twoFactorOTP })
            addToast('Two-Factor Authentication Activated', 'success')
            await updateProfile({ twoFactorEnabled: true })
            setIsSettingUp2FA(false)
            setTwoFactorOTP('')
         }
      } catch (err) {
         addToast(err.response?.data?.error || '2FA setup failed', 'error')
      } finally {
         setLoading(false)
      }
   }

   if (!user) {
      return (
         <div className="min-h-screen bg-artisan-dark flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-artisan-grey animate-spin" />
         </div>
      )
   }

   const totalActivity = userTools.length + activeRentals.length
   const calculateLevel = (activity) => {
      if (activity >= 25) return { label: 'Master Artisan', roman: 'V' }
      if (activity >= 15) return { label: 'Senior Crafter', roman: 'IV' }
      if (activity >= 8) return { label: 'Adept Maker', roman: 'III' }
      if (activity >= 3) return { label: 'Skilled Apprentice', roman: 'II' }
      return { label: 'Novice Artisan', roman: 'I' }
   }
   const currentLevel = calculateLevel(totalActivity)

   const nameParts = user.name.split(' ')
   const firstName = nameParts[0]
   const lastName = nameParts.slice(1).join(' ')

   return (
      <>
         <div className="min-h-screen bg-artisan-dark bg-noise pt-24 md:pt-32 pb-24">
         <div className="container-custom">

            {/* PROFILE HEADER / HERO */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-end">
               <div className="lg:col-span-3 flex justify-center lg:justify-start">
                  <div className="relative">
                     <div className="w-48 h-48 md:w-64 md:h-64 bg-artisan-light/5 border-2 border-artisan-light/10 p-1 relative group overflow-hidden">
                        {user.avatar ? (
                           <img
                              src={user.avatar}
                              className="w-full h-full object-cover transition-all duration-700"
                              alt={user.name}
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-6xl md:text-8xl opacity-20">
                              👤
                           </div>
                        )}

                        {/* Image Actions Overlay */}
                        <div className="absolute inset-0 bg-artisan-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-10">
                           <label className="cursor-pointer text-[9px] font-mono font-bold text-artisan-light uppercase tracking-widest hover:text-artisan-grey">
                              Change Image
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                           </label>
                           {user.avatar && (
                              <button
                                 onClick={handleDeleteAvatar}
                                 className="text-[9px] font-mono font-bold text-red-500 uppercase tracking-widest hover:text-red-400"
                              >
                                 Remove
                              </button>
                           )}
                        </div>
                     </div>

                     {/* Badge */}
                     <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-artisan-grey flex items-center justify-center text-artisan-dark z-20 shadow-xl">
                        <UserCheck className="w-6 h-6" />
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-9 space-y-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <span className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.6em]">{currentLevel.label}</span>
                        <div className="h-px w-24 bg-artisan-light/10" />
                     </div>
                     <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold uppercase tracking-tighter leading-none text-artisan-light">
                        {firstName} <br />
                        {lastName && <span className="text-outline">{lastName}</span>}
                     </h1>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
                     <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-artisan-grey" />
                        <span className="text-xs font-mono font-bold text-artisan-light/60 uppercase tracking-widest">{user.onboardingData?.location?.address || 'Location Not Set'}</span>
                     </div>

                     {user.isAadharVerified ? (
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="w-4 h-4 text-green-500" />
                           <span className="text-xs font-mono font-bold text-green-500 uppercase tracking-widest">Verified Member</span>
                        </div>
                     ) : (
                        <Link to="/verification" className="flex items-center gap-3 group">
                           <ShieldCheck className="w-4 h-4 text-artisan-grey group-hover:text-artisan-light" />
                           <span className="text-xs font-mono font-bold text-artisan-light/40 uppercase tracking-widest group-hover:text-artisan-light transition-colors decoration-artisan-grey/30 underline underline-offset-4">Verify Identity</span>
                        </Link>
                     )}

                     <div className="flex items-center gap-3">
                        <Star className="w-4 h-4 text-artisan-grey fill-artisan-grey" />
                        <span className="text-xs font-mono font-bold text-artisan-light uppercase tracking-widest">
                           {user.averageRating?.toFixed(1) || '5.0'} Rating ({user.numReviews || 0})
                        </span>
                     </div>
                  </div>
               </div>
            </section>

            {/* QUICK STATS BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-artisan-light/10 border border-artisan-light/10 mb-24">
               {[
                  { label: 'My Tools', value: userTools.length.toString() },
                  { label: 'Borrowed', value: activeRentals.length.toString() },
                  { label: 'Total Activity', value: totalActivity.toString() },
                  { label: 'My Level', value: currentLevel.roman }
               ].map((stat, idx) => (
                  <div key={idx} className="bg-artisan-dark p-8 md:p-12 space-y-2">
                     <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-[0.4em]">{stat.label}</span>
                     <p className="text-4xl md:text-5xl font-display font-black text-artisan-light leading-none">{stat.value}</p>
                  </div>
               ))}
            </div>

            {/* MAIN PROFILE NAVIGATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

               {/* SIDEBAR NAVIGATION */}
               <aside className="lg:col-span-3 space-y-12">
                  <nav className="flex flex-col gap-4">
                     {[
                        { id: 'arsenal', label: 'My Tools', icon: Hammer, href: null },
                        { id: 'requests', label: 'Requests', icon: ShieldCheck, href: null },
                        { id: 'rentals', label: 'Borrowed Gear', icon: Box, href: null },
                        { id: 'history', label: 'Order History', icon: History, href: '/history' },
                        { id: 'settings', label: 'Settings', icon: Settings, href: null }
                     ].map((nav) => (
                        nav.href ? (
                           <Link
                              key={nav.id}
                              to={nav.href}
                              className="flex items-center gap-4 px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest transition-all text-artisan-light/40 hover:text-artisan-light hover:bg-artisan-light/5"
                           >
                              <nav.icon className="w-4 h-4" />
                              {nav.label}
                           </Link>
                        ) : (
                           <button
                              key={nav.id}
                              onClick={() => setActiveTab(nav.id)}
                              className={`flex items-center gap-4 px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${activeTab === nav.id
                                 ? 'bg-artisan-grey text-artisan-dark'
                                 : 'text-artisan-light/40 hover:text-artisan-light hover:bg-artisan-light/5'
                                 }`}
                           >
                              <nav.icon className="w-4 h-4" />
                              {nav.label}
                           </button>
                        )
                     ))}
                     <button
                        onClick={handleLogout}
                        className="hidden lg:flex items-center gap-4 px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-artisan-grey hover:bg-artisan-grey hover:text-artisan-dark transition-all mt-8 border border-artisan-grey/20"
                     >
                        <LogOut className="w-4 h-4" />
                        Log Out
                     </button>
                  </nav>

                  <div className="hidden lg:block p-8 bg-artisan-light/[0.02] border-l-2 border-artisan-grey space-y-4">
                     <h4 className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest italic">About Me</h4>
                     <p className="text-xs font-mono text-artisan-light/40 leading-relaxed uppercase whitespace-pre-line">
                        {user.bio || (user.onboardingData?.intent === 'renter' ? "Dedicated borrower looking for the best tools to complete my projects." :
                           user.onboardingData?.intent === 'owner' ? "Proud owner of high-quality tools, helping the artisan community thrive." :
                              "Versatile maker both borrowing and lending gear within the ForgeShare ecosystem.")}
                     </p>
                  </div>
               </aside>

               {/* CONTENT AREA */}
               <main className="lg:col-span-9">
                  <AnimatePresence mode="wait">

                     {/* ARSENAL TAB */}
                     {activeTab === 'arsenal' && (
                        <motion.div
                           key="arsenal"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="space-y-12"
                        >
                           <div className="flex justify-between items-end border-b border-artisan-light/5 pb-8">
                              <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">My <br /><span className="text-outline">Gear.</span></h2>
                              <Link to="/list" className="px-8 py-4 bg-artisan-light text-artisan-dark font-display font-black uppercase tracking-widest text-[10px] hover:bg-artisan-grey transition-all flex items-center gap-4">
                                 Add Tool <Plus className="w-4 h-4" />
                              </Link>
                           </div>

                           {loading ? (
                              <div className="flex justify-center py-24">
                                 <Loader2 className="w-8 h-8 text-artisan-grey animate-spin" />
                              </div>
                           ) : userTools.length === 0 ? (
                              <div className="py-24 text-center space-y-6 bg-artisan-light/[0.02] border border-dashed border-artisan-light/10">
                                 <Hammer className="w-12 h-12 text-artisan-light/10 mx-auto" />
                                 <p className="text-xs font-mono text-artisan-light/30 uppercase tracking-[0.4em]">Your arsenal is currently empty</p>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 {userTools.map((tool) => (
                                    <div key={tool._id} className="group border border-artisan-light/10 bg-artisan-light/[0.02] overflow-hidden">
                                       <div className="aspect-video relative overflow-hidden">
                                          <img src={tool.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'} className={`w-full h-full object-cover transition-all duration-700 ${!tool.isActive ? 'opacity-20 grayscale' : 'grayscale group-hover:grayscale-0'}`} alt={tool.title} />
                                          {!tool.isActive && (
                                             <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-artisan-grey">Disabled</span>
                                             </div>
                                          )}
                                          <div className="absolute top-4 left-4">
                                             <span className={`px-3 py-1 text-[8px] font-mono font-bold uppercase tracking-widest border ${tool.status === 'approved' ? 'bg-artisan-dark text-artisan-light border-artisan-light/10' : 'bg-artisan-grey text-artisan-dark border-artisan-grey'}`}>
                                                {tool.status}
                                             </span>
                                          </div>
                                       </div>
                                       <div className="p-8 space-y-6">
                                          <div className="flex justify-between items-start">
                                             <h4 className="text-xl font-display font-extrabold uppercase text-artisan-light group-hover:text-artisan-grey transition-colors">{tool.title}</h4>
                                             <span className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase">₹{tool.pricePerDay}/Day</span>
                                          </div>
                                          <div className="flex flex-col gap-4 pt-6 border-t border-artisan-light/5">
                                             <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                   <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Category</span>
                                                   <span className="text-xs font-display font-bold text-artisan-light uppercase">{tool.category}</span>
                                                </div>
                                                <button
                                                   onClick={() => setManagingTool(managingTool === tool._id ? null : tool._id)}
                                                   className="text-[10px] font-mono font-bold uppercase tracking-widest text-artisan-grey hover:text-artisan-light transition-all flex items-center gap-2"
                                                >
                                                   Manage <ArrowRight className={`w-4 h-4 transition-transform ${managingTool === tool._id ? 'rotate-90' : ''}`} />
                                                </button>
                                             </div>

                                             <AnimatePresence>
                                                {managingTool === tool._id && (
                                                   <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                                                      <div className="grid grid-cols-2 gap-4">
                                                         <button
                                                            onClick={() => handleToggleActive(tool._id, tool.isActive)}
                                                            className="flex items-center justify-center gap-3 py-4 border border-artisan-light/10 text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-artisan-light/5 text-artisan-light"
                                                         >
                                                            {tool.isActive ? <><EyeOff className="w-4 h-4" /> Disable</> : <><Eye className="w-4 h-4" /> Enable</>}
                                                         </button>
                                                         <button
                                                            onClick={() => handleDeleteTool(tool._id)}
                                                            className="flex items-center justify-center gap-3 py-4 border border-red-500/20 bg-red-500/5 text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-red-500 hover:text-artisan-dark text-red-500 transition-all"
                                                         >
                                                            <Trash2 className="w-4 h-4" /> Delete
                                                         </button>
                                                      </div>
                                                   </motion.div>
                                                )}
                                             </AnimatePresence>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </motion.div>
                     )}

                     {/* REQUESTS TAB */}
                     {activeTab === 'requests' && (
                        <motion.div
                           key="requests"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="space-y-12"
                        >
                           <div className="flex justify-between items-end border-b border-artisan-light/5 pb-8">
                              <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">Gear <br /><span className="text-outline">Requests.</span></h2>
                           </div>

                           {loading ? (
                              <div className="flex justify-center py-24">
                                 <Loader2 className="w-8 h-8 text-artisan-grey animate-spin" />
                              </div>
                           ) : incomingRequests.length === 0 ? (
                              <div className="py-24 text-center space-y-6 bg-artisan-light/[0.02] border border-dashed border-artisan-light/10">
                                 <ShieldCheck className="w-12 h-12 text-artisan-light/10 mx-auto" />
                                 <p className="text-xs font-mono text-artisan-light/30 uppercase tracking-[0.4em]">No pending gear requests</p>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 gap-8">
                                 {incomingRequests.map((req) => (
                                    <div key={req._id} className="group border border-artisan-light/10 bg-artisan-light/[0.02] flex flex-col md:flex-row">
                                       <div className="w-full md:w-64 aspect-video md:aspect-square shrink-0 overflow-hidden">
                                          <img src={req.listing.images?.[0] || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={req.listing.title} />
                                       </div>
                                       <div className="p-8 flex-1 flex flex-col justify-between">
                                          <div className="space-y-4">
                                             <div className="flex justify-between items-start">
                                                <h4 className="text-2xl font-display font-extrabold uppercase text-artisan-light group-hover:text-artisan-grey transition-colors">{req.listing.title}</h4>
                                                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest border px-2 py-1 ${req.status === 'pending' ? 'border-artisan-grey text-artisan-grey' : req.status === 'confirmed' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                                                   {req.status}
                                                </span>
                                             </div>
                                             <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-artisan-light/5 border border-artisan-light/10 flex items-center justify-center overflow-hidden">
                                                   <img src={req.renter.avatar || `https://i.pravatar.cc/100?u=${req.renter._id}`} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Requester</span>
                                                   <span className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest">{req.renter.name}</span>
                                                </div>
                                             </div>
                                          </div>
                                          <div className="flex justify-between items-center pt-8 border-t border-artisan-light/5 mt-8 md:mt-0">
                                             <div className="flex flex-col">
                                                <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Revenue: ₹{req.totalPrice}</span>
                                                <span className="text-xs font-display font-bold text-artisan-light uppercase">
                                                   {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                                                </span>
                                             </div>
                                             
                                             {req.status === 'pending' && (
                                                <div className="flex gap-4">
                                                   <button 
                                                      type="button"
                                                      onClick={() => handleUpdateBookingStatus(req._id, 'cancelled')}
                                                      className="px-6 py-3 border border-red-500/20 text-red-500 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-red-500 hover:text-artisan-dark transition-all"
                                                   >
                                                      Decline
                                                   </button>
                                                   <button 
                                                      type="button"
                                                      onClick={() => handleUpdateBookingStatus(req._id, 'confirmed')}
                                                      className="px-6 py-3 bg-artisan-light text-artisan-dark text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-artisan-grey transition-all"
                                                   >
                                                      Authorize
                                                   </button>
                                                </div>
                                             )}

                                             {req.status === 'confirmed' && (
                                                <button 
                                                   onClick={() => handleReturnBooking(req._id)}
                                                   className="px-6 py-3 bg-blue-500 text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
                                                >
                                                   Mark Returned
                                                </button>
                                             )}

                                             {req.status === 'returned' && (
                                                <button 
                                                   onClick={() => handleCompleteBooking(req._id)}
                                                   className="px-6 py-3 bg-green-500 text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-green-600 transition-all"
                                                >
                                                   Complete
                                                </button>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </motion.div>
                     )}

                     {/* RENTALS TAB */}
                     {activeTab === 'rentals' && (
                        <motion.div
                           key="rentals"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="space-y-12"
                        >
                           <div className="flex justify-between items-end border-b border-artisan-light/5 pb-8">
                              <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">Borrowed <br /><span className="text-outline">Gear.</span></h2>
                           </div>

                           {loading ? (
                              <div className="flex justify-center py-24">
                                 <Loader2 className="w-8 h-8 text-artisan-grey animate-spin" />
                              </div>
                           ) : activeRentals.length === 0 ? (
                              <div className="py-24 text-center space-y-6 bg-artisan-light/[0.02] border border-dashed border-artisan-light/10">
                                 <Box className="w-12 h-12 text-artisan-light/10 mx-auto" />
                                 <p className="text-xs font-mono text-artisan-light/30 uppercase tracking-[0.4em]">No active rentals found</p>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 gap-8">
                                 {activeRentals.map((rental) => (
                                    <div key={rental._id} className="group border border-artisan-light/10 bg-artisan-light/[0.02] flex flex-col md:flex-row">
                                       <div className="w-full md:w-64 aspect-video md:aspect-square shrink-0 overflow-hidden">
                                          <img src={rental.listing.images?.[0] || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={rental.listing.title} />
                                       </div>
                                       <div className="p-8 flex-1 flex flex-col justify-between">
                                          <div className="space-y-4">
                                             <div className="flex justify-between items-start">
                                                <h4 className="text-2xl font-display font-extrabold uppercase text-artisan-light group-hover:text-artisan-grey transition-colors">{rental.listing.title}</h4>
                                                <span className={`text-[8px] font-mono font-bold uppercase tracking-widest border px-2 py-1 ${
                                                   rental.status === 'confirmed' ? 'border-green-500 text-green-500' :
                                                   rental.status === 'returned' ? 'border-blue-500 text-blue-500' :
                                                   'border-artisan-grey text-artisan-grey'
                                                }`}>
                                                   {rental.status}
                                                </span>
                                             </div>
                                             <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-artisan-light/5 border border-artisan-light/10 flex items-center justify-center overflow-hidden">
                                                   <img src={rental.owner.avatar || `https://i.pravatar.cc/100?u=${rental.owner._id}`} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Owner</span>
                                                   <span className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest">{rental.owner.name}</span>
                                                </div>
                                             </div>
                                          </div>
                                          <div className="flex justify-between items-center pt-8 border-t border-artisan-light/5 mt-8 md:mt-0">
                                             <div className="flex flex-col">
                                                <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Rental Period</span>
                                                <span className="text-xs font-display font-bold text-artisan-light uppercase">
                                                   {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                                                </span>
                                             </div>
                                             <div className="flex gap-4">
                                                {rental.status === 'confirmed' && (
                                                   <button 
                                                      onClick={() => handleReturnBooking(rental._id)}
                                                      className="px-6 py-3 bg-blue-500 text-white text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-blue-600 transition-all"
                                                   >
                                                      Return Gear
                                                   </button>
                                                )}
                                                <button 
                                                   onClick={() => setViewingBooking(rental)}
                                                   className="px-6 py-3 border border-artisan-light/10 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-artisan-light/5 transition-all text-artisan-light"
                                                >
                                                   Details
                                                </button>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </motion.div>
                     )}

                     {/* SETTINGS TAB */}
                     {activeTab === 'settings' && (
                        <motion.div
                           key="settings"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="space-y-12"
                        >
                           <div className="flex justify-between items-end border-b border-artisan-light/5 pb-8">
                              <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">Profile <br /><span className="text-outline">Control.</span></h2>
                              <button
                                 onClick={() => setIsEditing(!isEditing)}
                                 className="text-[10px] font-mono font-bold uppercase tracking-widest text-artisan-grey hover:text-artisan-light transition-all flex items-center gap-2 mb-2"
                              >
                                 {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                              </button>
                           </div>

                           <AnimatePresence mode="wait">
                              {isEditing ? (
                                 <motion.form
                                    key="edit-form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handleUpdateProfile}
                                    className="space-y-8"
                                 >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                       <div className="space-y-6">
                                          <div className="space-y-2">
                                             <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">Public Name</label>
                                             <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-xs font-mono font-bold text-artisan-light uppercase outline-none focus:border-artisan-grey transition-all"
                                             />
                                          </div>
                                          <div className="space-y-2">
                                             <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">Workshop Location</label>
                                             <input
                                                type="text"
                                                value={editData.address}
                                                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                                className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-xs font-mono font-bold text-artisan-light uppercase outline-none focus:border-artisan-grey transition-all"
                                             />
                                          </div>
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">Artisan Bio</label>
                                          <textarea
                                             value={editData.bio}
                                             onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                             rows={5}
                                             className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-xs font-mono font-bold text-artisan-light uppercase outline-none focus:border-artisan-grey transition-all resize-none"
                                             placeholder="Describe your craft and workshop..."
                                          />
                                       </div>
                                    </div>
                                    <button
                                       type="submit"
                                       disabled={loading}
                                       className="w-full py-5 bg-artisan-grey text-artisan-dark font-display font-black uppercase tracking-widest text-[10px] hover:bg-artisan-light transition-all flex items-center justify-center gap-4"
                                    >
                                       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                                    </button>
                                 </motion.form>
                              ) : (
                                 <motion.div
                                    key="settings-view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-12"
                                 >
                                    <div className="space-y-8">
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">Account Details</label>
                                          <div className="p-6 bg-artisan-light/[0.02] border border-artisan-light/10 space-y-4">
                                             <div>
                                                <span className="text-[8px] font-mono text-artisan-light/30 uppercase">Email</span>
                                                <p className="text-xs font-mono font-bold text-artisan-light uppercase">{user.email}</p>
                                             </div>
                                             <div>
                                                <span className="text-[8px] font-mono text-artisan-light/30 uppercase">Member Since</span>
                                                <p className="text-xs font-mono font-bold text-artisan-light uppercase">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                                             </div>
                                          </div>
                                       </div>

                                       <button
                                          onClick={() => setIsEditing(true)}
                                          className="w-full py-5 bg-artisan-grey text-artisan-dark font-display font-black uppercase tracking-widest text-[10px] hover:bg-artisan-light transition-all"
                                       >
                                          Update Information
                                       </button>
                                    </div>

                                    <div className="space-y-8">
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">Security</label>
                                          <div className="p-6 bg-artisan-light/[0.02] border border-artisan-light/10 space-y-4">
                                             <div className="flex justify-between items-center">
                                                 <div className="flex flex-col">
                                                    <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Two-Factor Auth</span>
                                                    <p className="text-[10px] font-mono font-bold text-artisan-light/60 uppercase">Email OTP Protocol</p>
                                                 </div>
                                                 <button 
                                                   onClick={() => handleToggle2FA(!user.twoFactorEnabled)}
                                                   disabled={loading}
                                                   className={`px-3 py-1 text-[8px] font-mono font-bold uppercase tracking-widest border transition-colors ${user.twoFactorEnabled ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-artisan-grey/10 text-artisan-grey border-artisan-grey/20'}`}
                                                 >
                                                    {user.twoFactorEnabled ? 'Active' : 'Disabled'}
                                                 </button>
                                             </div>
                                             <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Login Alerts</span>
                                                <span className="text-[8px] font-mono font-bold text-green-500 uppercase tracking-widest px-2 py-1 bg-green-500/10">Active</span>
                                             </div>
                                          </div>
                                       </div>

                                        <button 
                                           onClick={() => setIsChangingPassword(true)}
                                           className="w-full py-5 border border-artisan-grey text-artisan-grey font-display font-black uppercase tracking-widest text-[10px] hover:bg-artisan-grey hover:text-artisan-dark transition-all"
                                        >
                                           Change Password
                                        </button>
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </motion.div>
                     )}

                  </AnimatePresence>

                  {/* MOBILE ONLY: ABOUT & LOGOUT */}
                  <div className="lg:hidden mt-24 space-y-12">
                     <div className="p-8 bg-artisan-light/[0.02] border-l-2 border-artisan-grey space-y-4">
                        <h4 className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest italic">About Me</h4>
                        <p className="text-xs font-mono text-artisan-light/40 leading-relaxed uppercase whitespace-pre-line">
                           {user.bio || (user.onboardingData?.intent === 'renter' ? "Dedicated borrower looking for the best tools to complete my projects." :
                              user.onboardingData?.intent === 'owner' ? "Proud owner of high-quality tools, helping the artisan community thrive." :
                                 "Versatile maker both borrowing and lending gear within the ForgeShare ecosystem.")}
                        </p>
                     </div>
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-4 px-6 py-5 text-[10px] font-mono font-bold uppercase tracking-widest text-artisan-grey hover:bg-artisan-grey hover:text-artisan-dark transition-all border border-artisan-grey/20"
                     >
                        <LogOut className="w-4 h-4" />
                        Log Out
                     </button>
                  </div>
               </main>

            </div>
         </div>
      </div>

      {/* CHANGE PASSWORD OVERLAY */}
      <AnimatePresence>
         {isChangingPassword && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsChangingPassword(false)}
                  className="absolute inset-0 bg-artisan-dark/95 backdrop-blur-sm"
               />
               <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-md bg-artisan-dark border border-artisan-light/10 p-12 space-y-12 overflow-hidden shadow-2xl"
               >
                  <div className="absolute top-0 left-0 w-1 h-full bg-artisan-grey" />
                  
                  <button 
                     onClick={() => setIsChangingPassword(false)}
                     className="absolute top-6 right-6 text-artisan-light/30 hover:text-artisan-light transition-colors"
                  >
                     <X className="w-5 h-5" />
                  </button>

                  <div className="space-y-4">
                     <h3 className="text-4xl font-display font-black uppercase tracking-tighter text-artisan-light">Update <br /><span className="text-outline">Security.</span></h3>
                     <p className="text-[10px] font-mono text-artisan-light/30 uppercase tracking-widest">Modify your access credentials</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-8">
                     <div className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">Current Password</label>
                           <div className="relative">
                              <input
                                 type={showPasswords.current ? "text" : "password"}
                                 required
                                 value={passwordData.currentPassword}
                                 onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                 className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-xs font-mono font-bold text-artisan-light uppercase outline-none focus:border-artisan-grey transition-all"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-artisan-light/30 hover:text-artisan-light"
                              >
                                 {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                           </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">New Password</label>
                           <div className="relative">
                              <input
                                 type={showPasswords.new ? "text" : "password"}
                                 required
                                 value={passwordData.newPassword}
                                 onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                 className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-xs font-mono font-bold text-artisan-light uppercase outline-none focus:border-artisan-grey transition-all"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-artisan-light/30 hover:text-artisan-light"
                              >
                                 {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                           </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">Confirm New Password</label>
                           <div className="relative">
                              <input
                                 type={showPasswords.confirm ? "text" : "password"}
                                 required
                                 value={passwordData.confirmPassword}
                                 onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                 className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-xs font-mono font-bold text-artisan-light uppercase outline-none focus:border-artisan-grey transition-all"
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-artisan-light/30 hover:text-artisan-light"
                              >
                                 {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                           </div>
                        </div>
                     </div>

                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-2 pt-4 border-t border-artisan-light/5 mb-8"
                     >
                        <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest">Security Code (Sent to Email)</label>
                        <input
                           type="text"
                           maxLength={6}
                           placeholder="000000"
                           value={passwordData.otp || ''}
                           onChange={(e) => setPasswordData({ ...passwordData, otp: e.target.value })}
                           className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-center text-2xl font-mono font-bold text-artisan-light tracking-[0.5em] outline-none focus:border-artisan-grey transition-all"
                        />
                     </motion.div>

                     <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-artisan-grey text-artisan-dark font-display font-black uppercase tracking-widest text-[10px] hover:bg-artisan-light transition-all flex items-center justify-center gap-4"
                     >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (passwordData.otp ? 'Authorize Update' : 'Request Security Code')}
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* BOOKING DETAILS MODAL */}
      <AnimatePresence>
         {viewingBooking && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setViewingBooking(null)}
                  className="absolute inset-0 bg-artisan-dark/95 backdrop-blur-sm"
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-2xl bg-artisan-dark border border-artisan-light/10 overflow-hidden shadow-2xl"
               >
                  {/* Modal Header */}
                  <div className="flex justify-between items-center p-6 border-b border-artisan-light/10">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-artisan-grey flex items-center justify-center text-artisan-dark">
                           <Box className="w-5 h-5" />
                        </div>
                        <div>
                           <h3 className="text-xs font-mono font-bold text-artisan-light uppercase tracking-[0.3em]">Order Manifest</h3>
                           <p className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">ID: {viewingBooking._id}</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setViewingBooking(null)}
                        className="w-10 h-10 flex items-center justify-center text-artisan-light/40 hover:text-artisan-light transition-colors"
                     >
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <div>
                              <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest block mb-2">Asset Details</span>
                              <h4 className="text-xl font-display font-extrabold uppercase text-artisan-light">{viewingBooking.listing.title}</h4>
                              <p className="text-[10px] font-mono text-artisan-light/40 uppercase mt-1">{viewingBooking.listing.category}</p>
                           </div>
                           <div>
                              <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest block mb-2">Deployment Timeline</span>
                              <p className="text-sm font-mono font-bold text-artisan-light uppercase">
                                 {new Date(viewingBooking.startDate).toLocaleDateString()} — {new Date(viewingBooking.endDate).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="p-6 bg-artisan-light/[0.02] border border-artisan-light/10 space-y-4">
                              <div className="flex justify-between items-center">
                                 <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Status</span>
                                 <span className="text-[8px] font-mono font-bold text-artisan-grey uppercase tracking-widest border border-artisan-grey px-2 py-1">{viewingBooking.status}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Payment</span>
                                 <span className="text-[8px] font-mono font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1">{viewingBooking.paymentStatus}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-artisan-light/10">
                        <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest block mb-6">Financial Forensic</span>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-artisan-light/40 uppercase">Rental Rate</span>
                              <span className="text-xs font-mono font-bold text-artisan-light uppercase">₹{viewingBooking.listing.pricePerDay} / DAY</span>
                           </div>
                           <div className="flex justify-between items-center pt-4 border-t border-artisan-light/5">
                              <span className="text-[10px] font-mono text-artisan-light/40 uppercase">Total Transaction</span>
                              <span className="text-2xl font-display font-black text-artisan-light uppercase">₹{viewingBooking.totalPrice}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 bg-artisan-light/[0.02] border-t border-artisan-light/10 flex justify-end gap-4">
                     <button 
                        onClick={() => setViewingBooking(null)}
                        className="px-8 py-4 border border-artisan-light/10 text-[10px] font-mono font-bold uppercase tracking-widest text-artisan-light hover:bg-artisan-light/5 transition-all"
                     >
                        Close Manifest
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* 2FA SETUP MODAL */}
      <AnimatePresence>
         {isSettingUp2FA && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSettingUp2FA(false)}
                  className="absolute inset-0 bg-artisan-dark/95 backdrop-blur-sm"
               />
               <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="relative w-full max-w-md bg-artisan-dark border border-artisan-light/10 p-12 space-y-12 overflow-hidden shadow-2xl"
               >
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                  
                  <button 
                     onClick={() => setIsSettingUp2FA(false)}
                     className="absolute top-6 right-6 text-artisan-light/30 hover:text-artisan-light transition-colors"
                  >
                     <X className="w-5 h-5" />
                  </button>

                  <div className="space-y-4">
                     <h3 className="text-4xl font-display font-black uppercase tracking-tighter text-artisan-light">2FA <br /><span className="text-outline">Protocol.</span></h3>
                     <p className="text-[10px] font-mono text-artisan-light/30 uppercase tracking-widest">Secure your communication terminal</p>
                  </div>

                  <div className="space-y-8">
                     <AnimatePresence mode="wait">
                        {twoFactorStep === 'initial' ? (
                           <motion.div 
                              key="step-1"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="space-y-6"
                           >
                              <div className="p-6 bg-artisan-light/[0.02] border border-artisan-light/10">
                                 <p className="text-xs font-mono text-artisan-light/60 leading-relaxed uppercase">
                                    Enabling Two-Factor Authentication adds an extra layer of security to your account. We will send a verification code to <span className="text-artisan-light font-bold">{user.email}</span> whenever you sign in or modify security keys.
                                 </p>
                              </div>
                              <button
                                 onClick={handleSetup2FA}
                                 disabled={loading}
                                 className="w-full py-5 bg-artisan-grey text-artisan-dark font-display font-black uppercase tracking-widest text-[10px] hover:bg-artisan-light transition-all flex items-center justify-center gap-4"
                              >
                                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Begin Synchronization'}
                              </button>
                           </motion.div>
                        ) : (
                           <motion.div 
                              key="step-2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-8"
                           >
                              <div className="space-y-2">
                                 <label className="text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest text-center block">Enter Synchronization Code</label>
                                 <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={twoFactorOTP}
                                    onChange={(e) => setTwoFactorOTP(e.target.value)}
                                    className="w-full bg-artisan-light/5 border border-artisan-light/10 p-6 text-center text-4xl font-mono font-bold text-artisan-light tracking-[0.5em] outline-none focus:border-green-500 transition-all"
                                 />
                              </div>
                              <button
                                 onClick={handleSetup2FA}
                                 disabled={loading || twoFactorOTP.length < 6}
                                 className="w-full py-5 bg-green-500 text-artisan-dark font-display font-black uppercase tracking-widest text-[10px] hover:bg-artisan-light transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                              >
                                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Protocol'}
                              </button>
                              <button 
                                 onClick={() => setTwoFactorStep('initial')}
                                 className="w-full text-[8px] font-mono text-artisan-light/30 hover:text-artisan-light uppercase tracking-widest"
                              >
                                 Resend Code
                              </button>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
      </>
   )
}
