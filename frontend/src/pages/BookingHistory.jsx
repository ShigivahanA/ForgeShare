import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  History, 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Wallet,
  Zap,
  Loader2,
  RefreshCcw,
  Activity
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../services/api'

export default function BookingHistory() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // all, lent, borrowed
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await api.get('/bookings')
      setBookings(res.data.data)
    } catch (err) {
      addToast('Failed to retrieve transmission history', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.listing.title.toLowerCase().includes(search.toLowerCase()) || 
                         b._id.toLowerCase().includes(search.toLowerCase())
    
    const isBorrowed = b.renter._id === user?._id || b.renter === user?._id
    const isLent = b.owner._id === user?._id || b.owner === user?._id
    
    const matchesType = typeFilter === 'all' || 
                       (typeFilter === 'borrowed' && isBorrowed) || 
                       (typeFilter === 'lent' && isLent)
    
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleReturn = async (id) => {
    try {
      await api.put(`/bookings/${id}/return`)
      addToast('Gear marked as returned. Waiting for owner confirmation.', 'success')
      fetchBookings()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to return gear', 'error')
    }
  }

  const handleComplete = async (id) => {
    try {
      await api.put(`/bookings/${id}/complete`)
      addToast('Booking completed. Gear received safely.', 'success')
      fetchBookings()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to complete booking', 'error')
    }
  }

  // Analytics Calculations
  const validStatuses = ['confirmed', 'returned', 'completed']

  const totalSpent = bookings
    .filter(b => (b.renter._id === user?._id || b.renter === user?._id) && validStatuses.includes(b.status))
    .reduce((acc, curr) => acc + curr.totalPrice, 0)
  
  const totalEarned = bookings
    .filter(b => (b.owner._id === user?._id || b.owner === user?._id) && validStatuses.includes(b.status))
    .reduce((acc, curr) => acc + curr.totalPrice, 0)

  return (
    <div className="min-h-screen bg-artisan-dark bg-noise pt-32 pb-24">
      <div className="container-custom">
        
        {/* HEADER & STATS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/profile" className="inline-flex items-center gap-3 group">
              <div className="w-8 h-8 border border-artisan-light/10 flex items-center justify-center group-hover:bg-artisan-light group-hover:text-artisan-dark transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold text-artisan-light/40 uppercase tracking-[0.4em] group-hover:text-artisan-light transition-colors">Back to Profile</span>
            </Link>
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-[0.8] text-artisan-light">
                MY <span className="text-outline">HISTORY.</span>
              </h1>
              <p className="text-[11px] font-mono text-artisan-light/20 uppercase tracking-[0.5em] pl-2">History of your tool rentals and earnings</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="p-8 bg-artisan-light/[0.02] border border-artisan-light/10 min-w-[240px] relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-8 h-8 text-red-500" />
               </div>
               <span className="text-[9px] font-mono text-artisan-light/30 uppercase tracking-[0.3em] block mb-4">Total Outflow</span>
               <p className="text-4xl font-display font-black text-red-500">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-8 bg-artisan-light/[0.02] border border-artisan-light/10 min-w-[240px] relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-100 transition-opacity">
                  <ArrowDownLeft className="w-8 h-8 text-green-500" />
               </div>
               <span className="text-[9px] font-mono text-artisan-light/30 uppercase tracking-[0.3em] block mb-4">Total Revenue</span>
               <p className="text-4xl font-display font-black text-green-500">₹{totalEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8">
             <div className="relative group">
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-artisan-grey/20 group-focus-within:border-artisan-grey transition-all" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-artisan-grey/20 group-focus-within:border-artisan-grey transition-all" />
                
                <div className="flex items-center bg-artisan-light/[0.01] border border-artisan-light/10 group-focus-within:border-artisan-grey/30 transition-all">
                   <div className="w-20 h-20 border-r border-artisan-light/10 flex items-center justify-center bg-artisan-light/[0.02]">
                      <Search className="w-5 h-5 text-artisan-light/20 group-focus-within:text-artisan-grey transition-colors" />
                   </div>
                   <input 
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="SEARCH BOOKINGS BY TOOL OR ID..."
                      className="flex-1 bg-transparent py-8 px-8 text-[11px] font-mono text-artisan-light uppercase tracking-[0.3em] outline-none placeholder:text-artisan-light/5"
                   />
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
             <div className="grid grid-cols-3 gap-2">
                {['all', 'borrowed', 'lent'].map(type => (
                   <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`py-3 border-2 text-[8px] font-mono font-bold uppercase tracking-widest transition-all ${
                         typeFilter === type ? 'border-artisan-grey bg-artisan-grey text-artisan-dark' : 'border-artisan-light/10 text-artisan-light/30 hover:border-artisan-light/20'
                      }`}
                   >
                      {type === 'all' ? 'All' : type}
                   </button>
                ))}
             </div>
             <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-artisan-light/[0.02] border border-artisan-light/10 p-4 text-[9px] font-mono text-artisan-light uppercase tracking-[0.2em] outline-none focus:border-artisan-grey appearance-none cursor-pointer"
             >
                 <option value="all">ALL STATUSES</option>
                 <option value="pending">PENDING</option>
                 <option value="confirmed">CONFIRMED (IN USE)</option>
                 <option value="returned">RETURNED (WAITING)</option>
                 <option value="completed">COMPLETED (ARCHIVED)</option>
                 <option value="cancelled">CANCELLED</option>
              </select>
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="border border-artisan-light/10 bg-artisan-dark/50 shadow-2xl overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-artisan-light/10 bg-artisan-light/[0.03]">
                       <th className="px-8 py-8 text-left text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Order ID</th>
                       <th className="px-8 py-8 text-left text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Tool Details</th>
                       <th className="px-8 py-8 text-left text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Your Role</th>
                       <th className="px-8 py-8 text-left text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Rental Dates</th>
                       <th className="px-8 py-8 text-right text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Amount</th>
                       <th className="px-8 py-8 text-center text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Status</th>
                       <th className="px-8 py-8 text-right text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-artisan-light/5">
                    {loading ? (
                       Array(5).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                             <td colSpan="7" className="px-8 py-12 bg-artisan-light/[0.01]" />
                          </tr>
                       ))
                    ) : filteredBookings.length === 0 ? (
                       <tr>
                          <td colSpan="7" className="px-8 py-32 text-center">
                             <Activity className="w-16 h-16 text-artisan-light/5 mx-auto mb-6" />
                             <p className="text-[11px] font-mono text-artisan-light/20 uppercase tracking-[0.5em]">No bookings found</p>
                          </td>
                       </tr>
                    ) : (
                       filteredBookings.map((booking) => {
                          const isBorrowed = booking.renter._id === user?._id || booking.renter === user?._id
                          const isOwner = booking.owner._id === user?._id || booking.owner === user?._id
                          return (
                             <tr key={booking._id} className="group hover:bg-artisan-light/[0.03] transition-all duration-300">
                                <td className="px-8 py-10">
                                   <div className="flex flex-col">
                                      <span className="text-[10px] font-mono text-artisan-grey font-black tracking-tighter">#{booking._id.slice(-8).toUpperCase()}</span>
                                      <span className="text-[7px] font-mono text-artisan-light/10 uppercase tracking-widest mt-1">ID: {booking._id.slice(0, 8)}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-10">
                                   <div className="flex items-center gap-6">
                                      <div className="w-16 h-16 bg-artisan-light/5 border border-artisan-light/10 overflow-hidden shrink-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
                                         <img src={booking.listing.images?.[0]} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex flex-col">
                                         <span className="text-lg font-display font-black text-artisan-light uppercase tracking-tight group-hover:text-artisan-grey transition-colors leading-tight">{booking.listing.title}</span>
                                         <span className="text-[8px] font-mono text-artisan-light/20 uppercase tracking-widest mt-1">{booking.listing.category}</span>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-10">
                                   <div className={`inline-flex items-center gap-3 px-4 py-2 border-2 ${isBorrowed ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-green-500/20 bg-green-500/[0.02]'}`}>
                                      {isBorrowed ? (
                                         <ArrowUpRight className="w-3 h-3 text-red-500" />
                                      ) : (
                                         <ArrowDownLeft className="w-3 h-3 text-green-500" />
                                      )}
                                      <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] ${isBorrowed ? 'text-red-500' : 'text-green-500'}`}>
                                         {isBorrowed ? 'Borrower' : 'Lender'}
                                      </span>
                                   </div>
                                </td>
                                <td className="px-8 py-10">
                                   <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                         <Calendar className="w-3 h-3 text-artisan-light/20" />
                                         <span className="text-[10px] font-mono text-artisan-light uppercase">{new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}</span>
                                      </div>
                                      <div className="h-[2px] w-full bg-artisan-light/5 relative overflow-hidden">
                                         <motion.div 
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '0%' }}
                                            transition={{ duration: 1 }}
                                            className="absolute inset-0 bg-artisan-grey/20"
                                         />
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-10 text-right">
                                   <div className="flex flex-col items-end">
                                      <span className={`text-xl font-display font-black tracking-tighter group-hover:text-artisan-grey transition-colors ${isBorrowed ? 'text-red-500' : 'text-green-500'}`}>
                                         {isBorrowed ? '-' : '+'}₹{booking.totalPrice.toLocaleString()}
                                      </span>
                                      <span className="text-[7px] font-mono text-artisan-light/20 uppercase tracking-widest mt-1">
                                         {isBorrowed ? 'Total Spending' : 'Total Revenue'}
                                      </span>
                                   </div>
                                </td>
                                <td className="px-8 py-10">
                                   <div className="flex justify-center">
                                       <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.2em] px-4 py-1.5 border-2 flex items-center gap-2 ${
                                          booking.status === 'completed' ? 'border-artisan-light text-artisan-light bg-artisan-light/10' :
                                          booking.status === 'confirmed' ? 'border-green-500 text-green-500 bg-green-500/5' :
                                          booking.status === 'returned' ? 'border-blue-500 text-blue-500 bg-blue-500/5' :
                                          booking.status === 'pending' ? 'border-artisan-grey text-artisan-grey' :
                                          'border-red-500 text-red-500 bg-red-500/5'
                                       }`}>
                                          {booking.status === 'confirmed' && <Activity className="w-3 h-3 animate-pulse" />}
                                          {booking.status === 'returned' && <Clock className="w-3 h-3" />}
                                          {booking.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                          {booking.status}
                                       </span>
                                   </div>
                                </td>
                                <td className="px-8 py-10 text-right">
                                   <div className="flex justify-end gap-3">
                                      {(isBorrowed || isOwner) && booking.status === 'confirmed' && (
                                         <button 
                                            onClick={() => handleReturn(booking._id)}
                                            className="px-4 py-2 bg-blue-500 text-white text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 group"
                                         >
                                            <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                                            {isOwner ? 'Confirm Return' : 'Return Gear'}
                                         </button>
                                      )}
                                      {isOwner && booking.status === 'returned' && (
                                         <button 
                                            onClick={() => handleComplete(booking._id)}
                                            className="px-4 py-2 bg-green-500 text-white text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2 group"
                                         >
                                            <CheckCircle2 className="w-3 h-3 group-hover:scale-125 transition-transform" />
                                            Complete Booking
                                         </button>
                                      )}
                                      {booking.status === 'completed' && (
                                         <div className="flex items-center gap-2 text-[9px] font-mono text-artisan-light/20 uppercase tracking-widest">
                                            <Zap className="w-3 h-3" />
                                            Archived
                                         </div>
                                      )}
                                   </div>
                                </td>
                             </tr>
                          )
                       })
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  )
}
