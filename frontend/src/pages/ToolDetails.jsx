import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
   ArrowLeft,
   Star,
   MessageSquare,
   ArrowUpRight,
   Plus,
   Minus,
   UserCheck,
   ChevronLeft,
   ChevronRight,
   ShieldCheck,
   Award,
   Info,
   MapPin,
   Heart,
   Loader2
} from 'lucide-react'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function ToolDetails() {
   const { id } = useParams()
   const { addToast } = useToast()
   const { user, toggleWishlist: contextToggleWishlist } = useAuth()
   const navigate = useNavigate()
   const [tool, setTool] = useState(null)
   const [loading, setLoading] = useState(true)
   const [activeImage, setActiveImage] = useState(0)
   const [quantity, setQuantity] = useState(1)
   const [similarGear, setSimilarGear] = useState([])
   const [isWishlisted, setIsWishlisted] = useState(false)

   useEffect(() => {
      const fetchToolDetails = async () => {
         try {
            setLoading(true)
            const res = await api.get(`/listings/${id}`)
            setTool(res.data.data)

            // Check if tool is in user's wishlist
            if (user && user.wishlist) {
               setIsWishlisted(user.wishlist.includes(id))
            }

            // Fetch similar gear in the same category
            const similarRes = await api.get('/listings', {
               params: { category: res.data.data.category, limit: 3 }
            })
            setSimilarGear(similarRes.data.data.filter(t => t._id !== id))

         } catch (err) {
            addToast('Failed to load gear details', 'error')
            navigate('/marketplace')
         } finally {
            setLoading(false)
         }
      }

      fetchToolDetails()
      window.scrollTo(0, 0)
   }, [id, addToast, navigate, user])

   const toggleWishlist = async () => {
      if (!user) {
         addToast('Please login to save items', 'info')
         navigate('/login')
         return
      }

      try {
         await contextToggleWishlist(id)
         addToast(!isWishlisted ? 'Saved to collection' : 'Removed from collection', 'success')
      } catch (err) {
         addToast('Failed to update collection', 'error')
      }
   }

   if (loading) return (
      <div className="min-h-screen bg-artisan-dark flex flex-col items-center justify-center space-y-4">
         <Loader2 className="w-12 h-12 text-artisan-grey animate-spin" />
         <span className="text-[10px] font-mono text-artisan-light/20 uppercase tracking-widest">Accessing artisan records...</span>
      </div>
   )

   if (!tool) return null

   const displayRating = tool.averageRating || '5.0'
   const specs = [
      { label: 'Condition', value: tool.condition },
      { label: 'Category', value: tool.category },
      { label: 'Type', value: tool.type },
      { label: 'Address', value: tool.location?.address },
      { label: 'Zipcode', value: tool.location?.zipcode },
      { label: 'ID', value: tool._id.slice(-6).toUpperCase() },
      { label: 'City', value: tool.location?.city }
   ]

   return (
      <div className="min-h-screen bg-artisan-dark text-artisan-light font-display bg-noise selection:bg-artisan-grey selection:text-artisan-dark pt-20 pb-20">

         <div className="container-custom max-w-5xl mx-auto space-y-10 md:space-y-12 pt-8">

            {/* 01. COMPACT HEADER */}
            <section className="space-y-4">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]">{tool.category}</span>
                        <span className="w-1 h-1 bg-artisan-light/20 rounded-full" />
                        <span className="text-[10px] font-mono font-bold text-artisan-light/60 uppercase tracking-[0.2em] flex items-center gap-1">
                           <MapPin className="w-3 h-3" /> {tool.location?.city}, {tool.location?.state}
                        </span>
                     </div>
                     <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold uppercase tracking-tight leading-none">{tool.title}</h1>
                  </div>
                  <div className="flex flex-col md:items-end border-t border-artisan-light/10 pt-4 md:pt-0 md:border-0">
                     <span className="text-3xl md:text-4xl font-display font-extrabold text-artisan-light tracking-tight">₹{tool.pricePerDay?.toLocaleString()}</span>
                     <span className="text-[9px] font-mono text-artisan-grey uppercase tracking-widest font-bold">Daily Rate</span>
                  </div>
               </div>
            </section>

            {/* 02. COMPACT UTILITY GALLERY */}
            <section className="flex flex-col items-center py-4">
               <div className="relative group w-[240px] md:w-[280px]">
                  <div className="relative aspect-square bg-artisan-dark border border-artisan-light/10 overflow-hidden">
                     <AnimatePresence mode="wait">
                        <motion.img
                           key={activeImage}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                           transition={{ duration: 0.3 }}
                           src={tool.images?.[activeImage] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200'}
                           className="w-full h-full object-cover"
                        />
                     </AnimatePresence>

                     {/* Clean Overlays */}
                     {tool.images?.length > 1 && (
                        <>
                           <button
                              onClick={() => setActiveImage(prev => (prev - 1 + tool.images.length) % tool.images.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-artisan-dark/60 backdrop-blur-md border border-artisan-light/10 flex items-center justify-center text-artisan-light hover:bg-artisan-grey hover:text-artisan-dark transition-all"
                           >
                              <ChevronLeft className="w-4 h-4" />
                           </button>
                           <button
                              onClick={() => setActiveImage(prev => (prev + 1) % tool.images.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-artisan-dark/60 backdrop-blur-md border border-artisan-light/10 flex items-center justify-center text-artisan-light hover:bg-artisan-grey hover:text-artisan-dark transition-all"
                           >
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </>
                     )}
                  </div>

                  {/* Minimalist Selection Dots */}
                  {tool.images?.length > 1 && (
                     <div className="mt-4 flex justify-center gap-1.5">
                        {tool.images.map((_, i) => (
                           <button
                              key={i}
                              onClick={() => setActiveImage(i)}
                              className={`h-1 rounded-full transition-all duration-300 ${activeImage === i ? 'bg-artisan-grey w-6' : 'bg-artisan-light/10 w-2'}`}
                           />
                        ))}
                     </div>
                  )}
               </div>
            </section>

            {/* 03. INDUSTRIAL COMMAND CENTER */}
            <section className="relative z-20">
               <div className="bg-artisan-grey border border-artisan-grey p-1 shadow-2xl">
                  <div className="bg-artisan-dark border border-artisan-light/10 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">

                     <div className="flex flex-wrap items-center gap-12 w-full lg:w-auto">
                        {/* Rating Block */}
                        <div className="space-y-3">
                           <span className="text-[10px] font-mono font-extrabold text-artisan-grey uppercase tracking-[0.3em] block">Guild Rating</span>
                           <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                 {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(displayRating) ? 'fill-artisan-light' : 'fill-artisan-light/20 text-transparent'}`} />
                                 ))}
                              </div>
                              <span className="text-2xl font-display font-black text-artisan-light leading-none">{displayRating}</span>
                           </div>
                        </div>

                        <div className="hidden md:block w-px h-12 bg-artisan-light/10" />

                        {/* Quantity Block */}
                        <div className="space-y-3">
                           <span className="text-[10px] font-mono font-extrabold text-artisan-grey uppercase tracking-[0.3em] block">Rental Days</span>
                           <div className="flex items-center gap-6">
                              <div className="flex border border-artisan-light/10 p-1 bg-artisan-light/5">
                                 <button
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-artisan-light/10 transition-colors text-artisan-light"
                                 >
                                    <Minus className="w-4 h-4" />
                                 </button>
                                 <div className="w-12 h-10 flex items-center justify-center text-xl font-mono font-bold border-x border-artisan-light/10">
                                    {quantity}
                                 </div>
                                 <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-artisan-light/10 transition-colors text-artisan-light"
                                 >
                                    <Plus className="w-4 h-4" />
                                 </button>
                              </div>
                              <div className="hidden sm:block">
                                 <span className="text-[10px] font-mono text-artisan-light/30 uppercase tracking-widest italic">Total: ₹{(tool.pricePerDay * quantity).toLocaleString()}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Actions Block */}
                     <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:min-w-[450px]">
                        <Link
                           to={`/checkout/${tool._id}?days=${quantity}`}
                           className="flex-[2] py-5 px-8 bg-artisan-light text-artisan-dark font-display font-black uppercase tracking-[0.3em] text-sm hover:bg-artisan-grey transition-all flex items-center justify-center gap-4 group"
                        >
                           Rent Now
                           <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                        <button className="flex-1 py-5 px-8 border-2 border-artisan-light/10 text-artisan-light font-display font-black uppercase tracking-[0.3em] text-sm hover:bg-artisan-light/5 transition-all flex items-center justify-center gap-3">
                           <MessageSquare className="w-4 h-4" />
                           Talk
                        </button>
                        <button
                           onClick={toggleWishlist}
                           className={`w-full sm:w-16 py-5 border-2 transition-all flex items-center justify-center ${isWishlisted ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-artisan-light/10 text-artisan-light hover:text-artisan-grey hover:border-artisan-grey'}`}
                        >
                           <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                     </div>
                  </div>
               </div>
            </section>

            {/* 04. REDESIGNED STORY SECTION */}
            <section className="py-6 space-y-6">
               <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]">The Story</h2>
                  <div className="h-px bg-artisan-light/10 flex-1" />
               </div>

               <div className="bg-artisan-light/[0.02] border-l-2 border-artisan-grey p-6 md:p-10">
                  <p className="text-xl md:text-2xl font-display font-medium text-artisan-light/80 leading-relaxed md:leading-loose">
                     {tool.description}
                  </p>
               </div>
            </section>

            {/* 05. TECHNICAL SPECS GRID */}
            <section className="py-6 space-y-6">
               <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]">Specifications</h2>
                  <div className="h-px bg-artisan-light/10 flex-1" />
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-artisan-light/10 border border-artisan-light/10">
                  {specs.map((spec, i) => (
                     <div key={i} className="p-6 md:p-8 bg-artisan-dark space-y-2">
                        <span className="text-[9px] font-mono text-artisan-grey uppercase tracking-widest">{spec.label}</span>
                        <p className="text-sm md:text-base font-display font-bold uppercase text-artisan-light">{spec.value}</p>
                     </div>
                  ))}
               </div>
            </section>

            {/* 06. REDESIGNED ARTISAN PROFILE */}
            <section className="py-10">
               <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-[11px] font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]">Owner Identity</h2>
                  <div className="h-px bg-artisan-light/10 flex-1" />
               </div>

               <div className="border border-artisan-light/10 bg-artisan-dark p-6 md:p-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                     {/* Avatar */}
                     <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-artisan-light/5 border border-artisan-light/10 p-1">
                        <div className="w-full h-full bg-artisan-dark flex items-center justify-center text-3xl">
                           {tool.owner?.avatar ? <img src={tool.owner.avatar} className="w-full h-full object-cover grayscale" /> : '👤'}
                        </div>
                     </div>

                     {/* Info */}
                     <div className="flex-1 space-y-3">
                        <div>
                           <div className="flex items-center gap-3">
                              <h3 className="text-2xl font-display font-extrabold uppercase text-artisan-light tracking-tight">{tool.owner?.name}</h3>
                              {tool.owner?.isAadharVerified && (
                                 <span className="bg-artisan-light/10 px-2 py-1 rounded text-[8px] font-mono uppercase tracking-widest flex items-center gap-1">
                                    <UserCheck className="w-3 h-3" /> Verified
                                 </span>
                              )}
                           </div>
                           <p className="text-[10px] font-mono text-artisan-grey uppercase tracking-widest mt-1">Artisan Guild Member</p>
                        </div>
                        <p className="text-xs font-mono text-artisan-light/60 leading-relaxed max-w-2xl">
                           A verified member of the ForgeShare artisan collective, committed to the highest standards of tool maintenance and community integrity.
                        </p>
                     </div>

                     {/* Action */}
                     <div className="w-full md:w-auto pt-4 md:pt-0 border-t border-artisan-light/10 md:border-0">
                        <Link to={`/profile/${tool.owner?._id}`} className="w-full md:w-auto inline-flex items-center justify-center gap-3 py-3 px-6 border border-artisan-light/20 text-[10px] font-mono font-bold text-artisan-light hover:bg-artisan-light/5 transition-all uppercase tracking-[0.2em]">
                           View Portfolio <ArrowUpRight className="w-4 h-4" />
                        </Link>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-start gap-6 mt-6 px-2 opacity-40">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4" />
                     <span className="text-[9px] font-mono uppercase tracking-widest">Escrow Protected</span>
                  </div>
                  <div className="w-px h-3 bg-artisan-light/40" />
                  <div className="flex items-center gap-2">
                     <Award className="w-4 h-4" />
                     <span className="text-[9px] font-mono uppercase tracking-widest">Guild Inspected</span>
                  </div>
               </div>
            </section>

            {/* 07. SIMILAR GEAR & BOTTOM NAVIGATION */}
            <section className="pt-12 pb-8 space-y-12">
               <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]">Similar Gear</h2>
                  <div className="h-px bg-artisan-light/10 flex-1" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {similarGear.map(t => (
                     <Link to={`/tool/${t._id}`} key={t._id} className="group border border-artisan-light/10 bg-artisan-light/[0.02] hover:bg-artisan-light/5 transition-all flex items-center gap-4 p-4">
                        <div className="w-20 h-20 bg-artisan-light/5 shrink-0 overflow-hidden border border-artisan-light/10">
                           <img src={t.images?.[0]} alt={t.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="flex-1 space-y-1">
                           <span className="text-[8px] font-mono font-bold text-artisan-grey uppercase tracking-widest block">{t.category}</span>
                           <h4 className="text-sm md:text-base font-display font-bold uppercase text-artisan-light tracking-tight line-clamp-1">{t.title}</h4>
                           <span className="text-[10px] font-mono font-bold text-artisan-light/60 uppercase tracking-widest">₹{t.pricePerDay?.toLocaleString()}/day</span>
                        </div>
                     </Link>
                  ))}
               </div>

               <div className="flex justify-center pt-8 mb-10 border-t border-artisan-light/10">
                  <Link to="/rent" className="group inline-flex items-center justify-center gap-3 text-[10px] font-mono font-bold text-artisan-light hover:text-artisan-dark hover:bg-artisan-light transition-all uppercase tracking-[0.4em] border border-artisan-light/10 py-4 px-12">
                     <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                     Return to Collection
                  </Link>
               </div>
            </section>

         </div>

      </div>
   )
}
