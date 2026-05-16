import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Hammer,
  Shield,
  Zap,
  Loader2
} from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function BookingFlow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [step, setStep] = useState(1)
  const [tool, setTool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // FORM STATE
  const [dates, setDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  })
  const [days, setDays] = useState(1)
  const [reservationId, setReservationId] = useState('')

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/listings/${id}`)
        setTool(res.data.data)
      } catch (err) {
        console.error('Failed to fetch tool details', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTool()
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (dates.startDate && dates.endDate) {
      const start = new Date(dates.startDate)
      const end = new Date(dates.endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
      setDays(diffDays)
    }
  }, [dates])

  if (loading) {
    return (
      <div className="min-h-screen bg-artisan-dark flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-artisan-grey animate-spin" />
        <span className="text-[10px] font-mono text-artisan-light/20 uppercase tracking-widest">Accessing Arsenal...</span>
      </div>
    )
  }

  if (!tool) return null

  const serviceFee = Math.floor(tool.pricePerDay * 0.1)
  const insurance = 500
  const subtotal = tool.pricePerDay * days
  const total = subtotal + serviceFee + insurance

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      handleFinalize()
    }
  }

  const handleFinalize = async () => {
    setIsProcessing(true)
    try {
      const bookingData = {
        listing: tool._id,
        startDate: dates.startDate,
        endDate: dates.endDate,
        totalPrice: total
      }
      
      const res = await api.post('/bookings', bookingData)
      setReservationId(res.data.data._id.substring(res.data.data._id.length - 8).toUpperCase())
      setStep(4)
      window.scrollTo(0, 0)
    } catch (err) {
      console.error('Booking failed', err)
      // Optional: Add toast notification here
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickSelect = (d) => {
    const start = new Date(dates.startDate)
    const end = new Date(start.getTime() + (d * 86400000))
    setDates({
      ...dates,
      endDate: end.toISOString().split('T')[0]
    })
  }

  return (
    <div className="min-h-screen bg-artisan-dark bg-noise pt-24 pb-20">
      <div className="container-custom">
        
        {/* PROGRESS INDICATOR */}
        <div className="flex items-center justify-between mb-16 md:mb-24 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { id: 1, label: 'Dates', icon: Calendar },
            { id: 2, label: 'Identity', icon: ShieldCheck },
            { id: 3, label: 'Payment', icon: CreditCard },
            { id: 4, label: 'Done', icon: CheckCircle2 }
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center gap-4 shrink-0">
               <div className={`flex items-center gap-3 transition-all duration-500 ${step >= s.id ? 'opacity-100' : 'opacity-20'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center border-2 ${step >= s.id ? 'border-artisan-grey bg-artisan-grey text-artisan-dark' : 'border-artisan-light/10 text-artisan-light'}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Step 0{s.id}</span>
                    <span className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-[0.2em]">{s.label}</span>
                  </div>
               </div>
               {idx < 3 && <div className={`w-8 md:w-16 h-px bg-artisan-light/10 mx-2 md:mx-4 ${step > s.id ? 'bg-artisan-grey' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          
          {/* LEFT: SUMMARY (Sticky on Desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-8">
            <div className="group relative overflow-hidden border border-artisan-light/10 bg-artisan-light/[0.02]">
               <div className="aspect-[4/3] overflow-hidden bg-artisan-light/5">
                  {tool.images?.[0] ? (
                    <img src={tool.images[0]} alt={tool.title} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <Hammer className="w-12 h-12 text-artisan-light/10" />
                    </div>
                  )}
               </div>
               <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-artisan-grey uppercase tracking-widest">{tool.category}</span>
                      <h2 className="text-xl font-display font-extrabold uppercase tracking-tight text-artisan-light line-clamp-1">{tool.title}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-display font-bold text-artisan-light">₹{tool.pricePerDay}</span>
                      <span className="text-[8px] font-mono text-artisan-light/30 uppercase block">Per Day</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-artisan-light/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-artisan-light/5 border border-artisan-light/10 flex items-center justify-center overflow-hidden">
                       {tool.owner?.avatar ? (
                         <img src={tool.owner.avatar} className="w-full h-full object-cover grayscale" />
                       ) : (
                         <div className="w-full h-full bg-artisan-grey flex items-center justify-center text-[10px] font-bold text-artisan-dark">
                           {tool.owner?.name?.[0]}
                         </div>
                       )}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Owner</span>
                       <span className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest">{tool.owner?.name}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="border border-artisan-light/10 bg-artisan-dark p-6 md:p-8 space-y-6">
               <h3 className="text-xs font-mono font-bold text-artisan-light uppercase tracking-[0.4em] mb-6">Price Summary</h3>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-artisan-light/40">Rental ({days} {days === 1 ? 'Day' : 'Days'})</span>
                    <span className="text-artisan-light font-bold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-artisan-light/40">Service Fee</span>
                    <span className="text-artisan-light font-bold">₹{serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="text-artisan-light/40">Security Insurance</span>
                    <span className="text-artisan-light font-bold">₹{insurance}</span>
                  </div>
                  <div className="h-px bg-artisan-light/10 my-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.3em]">Total</span>
                    <span className="text-3xl font-display font-extrabold text-artisan-light tracking-tight">₹{total}</span>
                  </div>
               </div>
            </div>
          </aside>

          {/* RIGHT: MAIN CONTENT */}
          <main className="lg:col-span-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: DATES */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">
                      Choose your <br />
                      <span className="text-outline">Dates.</span>
                    </h1>
                    <p className="text-lg text-artisan-light/40 font-display font-medium uppercase tracking-widest max-w-xl">
                      Select the duration for your project. Extended rentals may qualify for the Artisan discount.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-artisan-light/[0.02] border border-artisan-light/10 p-8 md:p-12">
                     <div className="space-y-4">
                        <label className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-widest">Pickup Date</label>
                        <div className="relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-2">
                           <input 
                            type="date" 
                            value={dates.startDate}
                            onChange={(e) => setDates({...dates, startDate: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-transparent outline-none text-xl md:text-2xl font-display font-bold uppercase text-artisan-light appearance-none" 
                           />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-widest">Return Date</label>
                        <div className="relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-2">
                           <input 
                            type="date" 
                            value={dates.endDate}
                            onChange={(e) => setDates({...dates, endDate: e.target.value})}
                            min={dates.startDate}
                            className="w-full bg-transparent outline-none text-xl md:text-2xl font-display font-bold uppercase text-artisan-light appearance-none" 
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <span className="text-[10px] font-mono text-artisan-light/30 uppercase tracking-widest">Quick Selection</span>
                     <div className="flex flex-wrap gap-4">
                        {[1, 3, 7, 14].map(d => (
                          <button 
                            key={d}
                            onClick={() => handleQuickSelect(d)}
                            className={`px-8 py-4 text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${days === d ? 'bg-artisan-grey border-artisan-grey text-artisan-dark' : 'border-artisan-light/10 text-artisan-light hover:border-artisan-light/30'}`}
                          >
                            {d} {d === 1 ? 'Day' : 'Days'}
                          </button>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: IDENTITY */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">
                      Identity <br />
                      <span className="text-outline">Verify.</span>
                    </h1>
                    <p className="text-lg text-artisan-light/40 font-display font-medium uppercase tracking-widest max-w-xl">
                      ForgeShare maintains high trust. Your verified artisan ID status is pre-validated for this rental.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                       { label: 'Artisan Badge', icon: Shield, desc: user?.isAadharVerified ? 'Identity Verified' : 'Pending Verification' },
                       { label: 'Insurance Info', icon: Hammer, desc: 'Coverage Included' },
                       { label: 'Escrow Lock', icon: Zap, desc: 'Funds Protected' },
                       { label: 'Guild Status', icon: Info, desc: 'Pro Member' }
                     ].map((item, idx) => (
                       <div key={idx} className="flex items-center gap-6 p-6 border border-artisan-light/10 bg-artisan-light/[0.02]">
                          <div className="w-12 h-12 bg-artisan-light/5 flex items-center justify-center border border-artisan-light/10 text-artisan-grey">
                             <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="text-xs font-mono font-bold text-artisan-light uppercase tracking-widest">{item.label}</h4>
                             <p className="text-[9px] font-mono text-artisan-light/30 uppercase tracking-widest">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="p-8 border border-artisan-grey/20 bg-artisan-grey/[0.02] space-y-4">
                     <p className="text-[10px] font-mono text-artisan-grey uppercase tracking-widest leading-relaxed">
                       "By proceeding, you agree to the ForgeShare Artisan Protocol and confirm you have the skills required to operate this specific gear safely."
                     </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">
                      Confirm <br />
                      <span className="text-outline">Payment.</span>
                    </h1>
                    <p className="text-lg text-artisan-light/40 font-display font-medium uppercase tracking-widest max-w-xl">
                      Funds are held in escrow. The artisan will be paid only after you confirm equipment condition.
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                      <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">Card Number</label>
                      <input type="text" className="w-full bg-transparent outline-none text-2xl font-display font-bold uppercase text-artisan-light" placeholder="XXXX XXXX XXXX XXXX" />
                    </div>
                    <div className="grid grid-cols-2 gap-12">
                      <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                        <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">Expiry</label>
                        <input type="text" className="w-full bg-transparent outline-none text-xl font-display font-bold uppercase text-artisan-light" placeholder="MM/YY" />
                      </div>
                      <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                        <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">CVV</label>
                        <input type="password" size="3" className="w-full bg-transparent outline-none text-xl font-display font-bold uppercase text-artisan-light" placeholder="***" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS */}
              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-12 py-20"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-32 h-32 bg-artisan-grey flex items-center justify-center"
                  >
                     <CheckCircle2 className="w-16 h-16 text-artisan-dark" />
                  </motion.div>
                  
                  <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tighter text-artisan-light leading-none">
                      SUCCESSFUL <br />
                      <span className="text-outline">FORGED.</span>
                    </h1>
                    <p className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.6em]">Reservation #{reservationId}</p>
                  </div>

                  <div className="max-w-md mx-auto space-y-8">
                     <p className="text-artisan-light/40 font-display font-medium uppercase tracking-widest leading-relaxed">
                       Your request has been broadcast to the owner. You will receive pickup instructions once confirmed.
                     </p>
                     
                     <Link 
                       to="/rent" 
                       className="inline-flex items-center gap-4 px-12 py-6 bg-artisan-light text-artisan-dark font-display font-black uppercase tracking-widest hover:bg-artisan-grey transition-all"
                     >
                       Back to Marketplace
                       <ArrowRight className="w-5 h-5" />
                     </Link>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* NAVIGATION ACTIONS */}
            {step < 4 && (
              <div className="mt-16 pt-8 border-t border-artisan-light/10 flex flex-col sm:flex-row items-center justify-between gap-8">
                <button 
                  onClick={() => step > 1 && setStep(step - 1)}
                  className={`text-[10px] font-mono font-bold uppercase tracking-[0.5em] transition-all ${step > 1 ? 'text-artisan-light/40 hover:text-artisan-grey' : 'opacity-0 pointer-events-none'}`}
                >
                  Go Back
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-12 py-6 bg-artisan-grey text-artisan-dark font-display font-black uppercase tracking-[0.4em] text-xs hover:bg-artisan-light transition-all flex items-center justify-center gap-6 group relative overflow-hidden"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-artisan-dark border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <>
                      {step === 3 ? 'Authorize Forge' : 'Continue Forward'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  )
}
