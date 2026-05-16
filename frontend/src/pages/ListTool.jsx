import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  Hammer, 
  MapPin, 
  Clock, 
  Camera,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  ShieldCheck,
  Package,
  Wrench,
  Loader2,
  Calendar,
  ShieldAlert
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import api from '../services/api'

const CATEGORIES = ['Woodworking', 'Metalworking', 'Digital Fabrication', 'Traditional Arts', 'Electronics', 'Textiles']
const CONDITIONS = ['Brand New', 'Like New', 'Used', 'Vintage']
const TYPES = ['tool', 'workshop']
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export default function ListTool() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Woodworking',
    type: 'tool',
    condition: 'Brand New',
    pricePerDay: '',
    pricePerHour: '',
    securityDeposit: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipcode: ''
    },
    availability: [], // { day, startTime, endTime }
    rules: [],
    images: [] // Base64 strings
  })

  const [currentRule, setCurrentRule] = useState('')

  // Redirect if not verified
  useEffect(() => {
    if (user && !user.isAadharVerified) {
      addToast('Please verify your identity to list tools', 'info')
      navigate('/verification')
    }
  }, [user, navigate, addToast])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + formData.images.length > 5) {
      addToast('Maximum 5 images allowed', 'warning')
      return
    }

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addRule = () => {
    if (!currentRule.trim()) return
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, currentRule.trim()]
    }))
    setCurrentRule('')
  }

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }))
  }

  const toggleDay = (day) => {
    const exists = formData.availability.find(a => a.day === day)
    if (exists) {
      setFormData(prev => ({
        ...prev,
        availability: prev.availability.filter(a => a.day !== day)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, { day, startTime: '09:00', endTime: '18:00' }]
      }))
    }
  }

  const updateTime = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.map(a => a.day === day ? { ...a, [field]: value } : a)
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await api.post('/listings', formData)
      addToast('Tool submitted for approval', 'success')
      navigate('/marketplace')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to list tool', 'error')
    } finally {
      setLoading(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <div className="min-h-screen bg-artisan-dark text-artisan-light font-display bg-noise selection:bg-artisan-grey selection:text-artisan-dark pt-24 pb-20">
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-artisan-light/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-artisan-grey shadow-[0_0_15px_rgba(154,154,154,0.5)]"
        />
      </div>

      <div className="container-custom max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
             <span className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-[0.6em]">Create New Listing</span>
             <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter leading-[0.85]">
                LIST YOUR <br />
                <span className="text-outline">TOOL.</span>
             </h1>
          </div>
          <div className="flex items-center gap-6 pb-2">
             <div className="text-right">
                <span className="text-[8px] font-mono text-artisan-grey uppercase tracking-widest block">Step</span>
                <span className="text-2xl font-display font-black text-artisan-light">0{step}/03</span>
             </div>
             <div className="w-12 h-12 rounded-full border border-artisan-light/10 flex items-center justify-center">
                {step === 1 ? <Package className="w-5 h-5 text-artisan-grey" /> : step === 2 ? <Clock className="w-5 h-5 text-artisan-grey" /> : <ShieldCheck className="w-5 h-5 text-artisan-grey" />}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-10"
                >
                  {/* Title & Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                      <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">Tool Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-transparent outline-none text-xl md:text-2xl font-display font-bold uppercase text-artisan-light placeholder:text-artisan-light/[0.02]" 
                        placeholder="E.G. WOOD LATHE" 
                      />
                    </div>
                    <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                      <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">Listing Type</label>
                      <div className="flex gap-4">
                        {TYPES.map(t => (
                          <button 
                            key={t}
                            onClick={() => setFormData({...formData, type: t})}
                            className={`px-6 py-2 text-[10px] font-mono font-bold uppercase tracking-widest border transition-all ${formData.type === t ? 'bg-artisan-grey text-artisan-dark border-artisan-grey' : 'border-artisan-light/10 text-artisan-light/40 hover:border-artisan-grey'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category & Condition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Category</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-[10px] font-mono font-bold uppercase tracking-widest text-artisan-light outline-none focus:border-artisan-grey transition-all appearance-none"
                        >
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                     </div>
                     <div className="space-y-4">
                        <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Condition</label>
                        <select 
                          value={formData.condition}
                          onChange={(e) => setFormData({...formData, condition: e.target.value})}
                          className="w-full bg-artisan-light/5 border border-artisan-light/10 p-4 text-[10px] font-mono font-bold uppercase tracking-widest text-artisan-light outline-none focus:border-artisan-grey transition-all appearance-none"
                        >
                          {CONDITIONS.map(con => <option key={con} value={con}>{con}</option>)}
                        </select>
                     </div>
                  </div>

                  {/* Description */}
                  <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                    <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">Description</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-transparent outline-none text-base md:text-lg font-display font-medium text-artisan-light placeholder:text-artisan-light/[0.02] min-h-[120px] resize-none" 
                      placeholder="Tell us more about your tool..." 
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  {/* Pricing & Deposit */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                      <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">Daily Rent (₹)</label>
                      <div className="flex items-center gap-3">
                        <IndianRupee className="w-4 h-4 text-artisan-light/20 group-focus-within:text-artisan-grey transition-colors" />
                        <input 
                          type="number" 
                          required
                          value={formData.pricePerDay}
                          onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                          className="w-full bg-transparent outline-none text-xl font-display font-black text-artisan-light" 
                          placeholder="00" 
                        />
                      </div>
                    </div>
                    <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                      <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">Security Deposit (₹)</label>
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-4 h-4 text-artisan-light/20 group-focus-within:text-artisan-grey transition-colors" />
                        <input 
                          type="number" 
                          required
                          value={formData.securityDeposit}
                          onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                          className="w-full bg-transparent outline-none text-xl font-display font-black text-artisan-light" 
                          placeholder="00" 
                        />
                      </div>
                    </div>
                    <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                      <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em] mb-4 group-focus-within:text-artisan-grey transition-colors">Hourly Rent (Opt)</label>
                      <div className="flex items-center gap-3">
                        <IndianRupee className="w-4 h-4 text-artisan-light/20 group-focus-within:text-artisan-grey transition-colors" />
                        <input 
                          type="number" 
                          value={formData.pricePerHour}
                          onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                          className="w-full bg-transparent outline-none text-xl font-display font-black text-artisan-light" 
                          placeholder="00" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <Calendar className="w-4 h-4 text-artisan-grey" />
                       <label className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-[0.4em]">Availability</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {DAYS.map(day => {
                          const isActive = formData.availability.find(a => a.day === day)
                          return (
                            <div key={day} className={`flex flex-col gap-2 p-3 border transition-all ${isActive ? 'border-artisan-grey bg-artisan-grey/5' : 'border-artisan-light/5 bg-artisan-light/[0.01]'}`}>
                               <button 
                                 onClick={() => toggleDay(day)}
                                 className={`text-[9px] font-mono font-bold uppercase tracking-widest text-left ${isActive ? 'text-artisan-light' : 'text-artisan-light/20'}`}
                               >
                                 {day}
                               </button>
                               {isActive && (
                                 <div className="flex gap-2 items-center">
                                    <input 
                                      type="time" 
                                      value={isActive.startTime}
                                      onChange={(e) => updateTime(day, 'startTime', e.target.value)}
                                      className="bg-transparent border-b border-artisan-light/20 text-[8px] font-mono text-artisan-light outline-none"
                                    />
                                    <span className="text-[8px] font-mono text-artisan-light/20">-</span>
                                    <input 
                                      type="time" 
                                      value={isActive.endTime}
                                      onChange={(e) => updateTime(day, 'endTime', e.target.value)}
                                      className="bg-transparent border-b border-artisan-light/20 text-[8px] font-mono text-artisan-light outline-none"
                                    />
                                 </div>
                               )}
                            </div>
                          )
                       })}
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <MapPin className="w-4 h-4 text-artisan-grey" />
                       <label className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-[0.4em]">Pickup Location</label>
                    </div>
                    <div className="space-y-6">
                      <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                        <label className="block text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest mb-2">Street Address</label>
                        <input 
                          type="text" 
                          required
                          value={formData.location.address}
                          onChange={(e) => setFormData({...formData, location: { ...formData.location, address: e.target.value }})}
                          className="w-full bg-transparent outline-none text-lg font-display font-bold uppercase text-artisan-light" 
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                         <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                            <label className="block text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest mb-2">City</label>
                            <input 
                              type="text" 
                              required
                              value={formData.location.city}
                              onChange={(e) => setFormData({...formData, location: { ...formData.location, city: e.target.value }})}
                              className="w-full bg-transparent outline-none text-base font-display font-bold uppercase text-artisan-light" 
                            />
                         </div>
                         <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                            <label className="block text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest mb-2">State</label>
                            <input 
                              type="text" 
                              required
                              value={formData.location.state}
                              onChange={(e) => setFormData({...formData, location: { ...formData.location, state: e.target.value }})}
                              className="w-full bg-transparent outline-none text-base font-display font-bold uppercase text-artisan-light" 
                            />
                         </div>
                         <div className="group relative border-b-2 border-artisan-light/10 focus-within:border-artisan-grey transition-all pb-4">
                            <label className="block text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest mb-2">Zipcode</label>
                            <input 
                              type="text" 
                              required
                              value={formData.location.zipcode}
                              onChange={(e) => setFormData({...formData, location: { ...formData.location, zipcode: e.target.value }})}
                              className="w-full bg-transparent outline-none text-base font-display font-bold uppercase text-artisan-light" 
                            />
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                   {/* Tool Rules */}
                   <div className="space-y-6">
                      <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Usage Rules</label>
                      <div className="flex gap-4">
                         <input 
                           type="text" 
                           value={currentRule}
                           onChange={(e) => setCurrentRule(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && addRule()}
                           className="flex-1 bg-artisan-light/5 border border-artisan-light/10 p-4 text-[10px] font-mono font-bold uppercase tracking-widest text-artisan-light outline-none focus:border-artisan-grey"
                           placeholder="E.G. WEAR SAFETY GLASSES"
                         />
                         <button 
                           onClick={addRule}
                           className="px-6 bg-artisan-light text-artisan-dark flex items-center justify-center hover:bg-artisan-grey transition-all"
                         >
                            <Plus className="w-4 h-4" />
                         </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {formData.rules.map((rule, i) => (
                           <div key={i} className="flex items-center gap-3 px-4 py-2 bg-artisan-light/5 border border-artisan-light/10">
                              <span className="text-[9px] font-mono text-artisan-light uppercase tracking-widest">{rule}</span>
                              <button onClick={() => removeRule(i)} className="text-artisan-grey hover:text-red-500">
                                 <Trash2 className="w-3 h-3" />
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Visual Registry */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <label className="block text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-[0.3em]">Photos (Up to 5)</label>
                         <span className="text-[10px] font-mono text-artisan-grey">{formData.images.length}/5 Images</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                         {formData.images.map((img, idx) => (
                           <div key={idx} className="relative aspect-square border border-artisan-light/10 bg-artisan-light/5 group overflow-hidden">
                              <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                              <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 p-1.5 bg-artisan-dark/80 text-artisan-light opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                                 <Trash2 className="w-3 h-3" />
                              </button>
                           </div>
                         ))}
                         {formData.images.length < 5 && (
                           <label className="aspect-square border-2 border-dashed border-artisan-light/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-artisan-grey hover:bg-artisan-light/[0.02] transition-all group">
                              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                              <Camera className="w-6 h-6 text-artisan-light/10 group-hover:text-artisan-grey" />
                              <span className="text-[8px] font-mono text-artisan-light/20 uppercase tracking-widest">Add Photo</span>
                           </label>
                         )}
                      </div>
                   </div>

                   <div className="p-8 bg-artisan-light/[0.02] border border-artisan-light/10 space-y-6">
                      <div className="flex items-start gap-4">
                         <AlertCircle className="w-5 h-5 text-artisan-grey shrink-0 mt-0.5" />
                         <div className="space-y-1">
                            <p className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest">Verification Process</p>
                            <p className="text-[10px] font-mono text-artisan-light/40 uppercase leading-relaxed">Your listing will be reviewed by our team. Once approved, it will be visible in the marketplace.</p>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-12 border-t border-artisan-light/5">
              <button 
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="flex items-center gap-3 text-[10px] font-mono font-bold text-artisan-light/30 uppercase tracking-widest hover:text-artisan-light disabled:opacity-0 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              
              {step < 3 ? (
                <button 
                  onClick={() => setStep(prev => prev + 1)}
                  className="px-10 py-5 bg-artisan-light text-artisan-dark font-display font-black uppercase tracking-[0.3em] text-xs hover:bg-artisan-grey transition-all flex items-center gap-4"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-10 py-5 bg-artisan-grey text-artisan-dark font-display font-black uppercase tracking-[0.3em] text-xs hover:bg-artisan-light transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Finish & List <CheckCircle className="w-4 h-4" /></>}
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-8">
               <div className="p-8 border border-artisan-light/5 bg-artisan-light/[0.01] space-y-6">
                  <div className="w-12 h-12 bg-artisan-grey/10 flex items-center justify-center">
                     <ShieldCheck className="w-6 h-6 text-artisan-grey" />
                  </div>
                  <h3 className="text-xl font-display font-black uppercase text-artisan-light">Trust & Safety</h3>
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <p className="text-[9px] font-mono font-bold text-artisan-grey uppercase tracking-widest">Security Deposit</p>
                        <p className="text-[10px] font-mono text-artisan-light/30 uppercase leading-relaxed">Protect your gear. Deposits are held securely during the rental period.</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-mono font-bold text-artisan-grey uppercase tracking-widest">Usage Rules</p>
                        <p className="text-[10px] font-mono text-artisan-light/30 uppercase leading-relaxed">Be clear about how to use your tool safely. These rules help protect your gear.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
