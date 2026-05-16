import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, Share2, RefreshCcw, ArrowRight } from 'lucide-react'
import api from '../services/api'

export default function StoryDetail() {
   const { id } = useParams()
   const navigate = useNavigate()
   const [story, setStory] = useState(null)
   const [moreStories, setMoreStories] = useState([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchStory = async () => {
         try {
            setLoading(true)
            // Fetch specific story
            const res = await api.get(`/content/${id}`)
            setStory(res.data.data)

            // Fetch other stories for 'More Stories'
            const moreRes = await api.get('/content?type=story')
            setMoreStories(moreRes.data.data.filter(s => s._id !== id).slice(0, 3))
         } catch (err) {
            console.error('Failed to fetch story', err)
         } finally {
            setLoading(false)
         }
      }
      fetchStory()
      window.scrollTo(0, 0)
   }, [id])

   if (loading) {
      return (
         <div className="min-h-screen bg-artisan-dark flex flex-col items-center justify-center space-y-6">
            <RefreshCcw className="w-12 h-12 text-artisan-grey animate-spin" />
            <p className="text-[10px] font-mono text-artisan-light/20 uppercase tracking-[0.4em]">Deciphering Chronicles...</p>
         </div>
      )
   }

   if (!story) {
      return (
         <div className="min-h-screen bg-artisan-dark flex flex-col items-center justify-center space-y-8">
            <h2 className="text-4xl font-display font-black text-artisan-light uppercase tracking-tighter text-outline">Chronicle Missing.</h2>
            <Link to="/maker-stories" className="px-8 py-4 bg-artisan-light text-artisan-dark font-display font-black uppercase tracking-widest text-[10px]">
               Return to Journal
            </Link>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-artisan-dark bg-noise pb-32">
         {/* Cinematic Hero */}
         <div className="relative h-[70vh] lg:h-[90vh] w-full overflow-hidden">
            <motion.img
               initial={{ scale: 1.1, opacity: 0 }}
               animate={{ scale: 1, opacity: 0.6 }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               src={story.image && story.image !== 'no-photo.jpg' ? story.image : 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1600'}
               className="w-full h-full object-cover grayscale"
               alt={story.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-artisan-dark via-artisan-dark/20 to-transparent" />

            <div className="absolute inset-0 flex items-end">
               <div className="container-custom pb-16 lg:pb-24">
                  <div className="max-w-5xl space-y-8">


                     <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-5xl md:text-8xl lg:text-[10rem] font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-artisan-light"
                     >
                        {story.title}
                     </motion.h1>
                  </div>
               </div>
            </div>
            
            {/* Top Navigation / Back Button */}
            <div className="absolute top-8 left-8 z-[100]">
               <button 
                  onClick={() => navigate('/maker-stories')}
                  className="w-12 h-12 border border-artisan-light/20 flex items-center justify-center text-artisan-light hover:bg-artisan-light hover:text-artisan-dark transition-all"
               >
                  <ArrowLeft className="w-5 h-5" />
               </button>
            </div>
         </div>

         {/* Main Content Body */}
         <div className="container-custom mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
               {/* Story Content */}
               <div className="lg:col-span-8 space-y-12">
                  {/* Content Meta */}
                  <div className="flex flex-wrap items-center gap-8 pb-12 border-b border-artisan-light/10 mb-12">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-artisan-grey flex items-center justify-center text-artisan-dark font-display font-black text-xs">
                           {story.author?.[0] || 'A'}
                        </div>
                        <div className="space-y-0.5">
                           <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest block">AUTHOR</span>
                           <span className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest">{story.author || 'Forge Collective'}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-artisan-grey" />
                        <div className="space-y-0.5">
                           <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest block">DATE</span>
                           <span className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest">
                              {new Date(story.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </span>
                        </div>
                     </div>
                     <button className="ml-auto w-12 h-12 border border-artisan-light/10 flex items-center justify-center text-artisan-light/40 hover:text-artisan-grey transition-colors">
                        <Share2 className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="prose prose-invert max-w-none">
                     <p className="text-xl md:text-2xl text-artisan-light/80 font-display font-medium uppercase tracking-widest leading-relaxed mb-16 border-l-4 border-artisan-grey pl-8">
                        {story.subtitle || "Every masterpiece begins with a single strike of the hammer."}
                     </p>

                     <div className="text-lg md:text-xl text-artisan-light/60 font-body leading-[1.8] space-y-8 whitespace-pre-wrap">
                        {story.content}
                     </div>
                  </div>

                  {/* Back Button at Bottom */}
                  <div className="pt-24 border-t border-artisan-light/5 flex items-center justify-between">
                     <button
                        onClick={() => navigate('/maker-stories')}
                        className="group flex items-center gap-4 text-[10px] font-mono font-bold text-artisan-grey hover:text-artisan-light uppercase tracking-[0.4em] transition-all"
                     >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                        Back to Stories
                     </button>

                     <div className="flex gap-4">
                        <Share2 className="w-4 h-4 text-artisan-light/20" />
                     </div>
                  </div>

                  {/* Decorative Quote/Break */}
                  <div className="py-24 border-y border-artisan-light/5 relative overflow-hidden">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-display font-black text-artisan-light/[0.02] pointer-events-none select-none">
                        FORGE
                     </div>
                     <blockquote className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
                        <p className="text-xl md:text-2xl font-display font-extrabold uppercase tracking-widest text-artisan-light italic">
                           "Precision is not an act, it is a habit."
                        </p>
                        <footer className="text-[10px] font-mono text-artisan-grey uppercase tracking-[0.4em]">— THE ARTISAN MANIFESTO</footer>
                     </blockquote>
                  </div>
               </div>

               {/* Sidebar / Meta */}
               <div className="lg:col-span-4 space-y-12">
                  <div className="bg-artisan-light/[0.02] border border-artisan-light/5 p-10 space-y-8 sticky top-32">
                     <h4 className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.4em] border-b border-artisan-light/10 pb-6">Journal Details</h4>

                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-mono text-artisan-light/30 uppercase tracking-widest">Category</span>
                           <span className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest">Mastery</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-mono text-artisan-light/30 uppercase tracking-widest">Read Time</span>
                           <span className="text-[10px] font-mono font-bold text-artisan-light uppercase tracking-widest">6 MIN</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-mono text-artisan-light/30 uppercase tracking-widest">Authority</span>
                           <span className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-widest">Verified</span>
                        </div>
                     </div>

                     <div className="pt-8">
                        <button className="w-full py-5 bg-artisan-grey text-artisan-dark font-display font-black uppercase tracking-[0.4em] text-[10px] hover:bg-artisan-light transition-all flex items-center justify-center gap-3 group">
                           SUBSCRIBE TO JOURNAL
                           <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* More Stories */}
         {moreStories.length > 0 && (
            <div className="container-custom mt-40">
               <div className="flex justify-between items-end mb-16 border-b border-artisan-light/10 pb-8">
                  <div className="space-y-4">
                     <span className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]">Next Reading</span>
                     <h2 className="text-4xl md:text-6xl font-display font-black text-artisan-light uppercase tracking-tighter">MORE <span className="text-outline">CHRONICLES.</span></h2>
                  </div>
                  <Link to="/maker-stories" className="text-[10px] font-mono font-bold text-artisan-grey hover:text-artisan-light uppercase tracking-widest mb-2 transition-colors">
                     View All Stories —
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {moreStories.map((s) => (
                     <Link to={`/story/${s._id}`} key={s._id} className="group space-y-6">
                        <div className="aspect-[4/5] overflow-hidden bg-artisan-light/5">
                           <img
                              src={s.image && s.image !== 'no-photo.jpg' ? s.image : 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=800'}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                              alt={s.title}
                           />
                        </div>
                        <div className="space-y-3">
                           <span className="text-[8px] font-mono text-artisan-grey uppercase tracking-widest block">Entry {s._id.slice(-4)}</span>
                           <h3 className="text-2xl font-display font-black text-artisan-light uppercase tracking-tight group-hover:text-artisan-grey transition-colors line-clamp-2">{s.title}</h3>
                           <div className="flex items-center gap-4 text-[9px] font-mono text-artisan-light/30 uppercase tracking-widest pt-4 border-t border-artisan-light/5">
                              <span className="flex items-center gap-2"><User className="w-3 h-3" /> {s.author || 'Collective'}</span>
                              <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> 6 min read</span>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         )}
      </div>
   )
}
