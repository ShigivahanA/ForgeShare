import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import api from '../../services/api'

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [current, setCurrent] = useState(0)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/listings/reviews/landing')
        setReviews(res.data.data)
      } catch (err) {
        console.error('Failed to fetch landing reviews', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const next = () => setCurrent((prev) => (prev + 1) % reviews.length)
  const prev = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length)

  if (loading) {
    return (
      <div className="bg-artisan-dark py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-artisan-grey animate-spin" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <section id="testimonials" className="bg-artisan-dark bg-noise border-b-2 border-artisan-light">
        <div className="container-custom py-24 lg:py-48 text-center">
           <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase text-artisan-light/20">
             Yet to review.
           </h2>
           <p className="text-[10px] font-mono text-artisan-grey uppercase tracking-widest mt-4">Be the first to leave a legacy.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="bg-artisan-dark bg-noise border-b-2 border-artisan-light">
      <div className="container-custom py-24 lg:py-48">
        
        {/* Header */}
        <div className="mb-20 lg:mb-32 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-1 bg-artisan-grey" />
              <span className="text-sm font-mono font-bold uppercase tracking-[0.4em] text-artisan-grey">The Testimony</span>
            </motion.div>
            
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-artisan-light">
              Artisan <br />
              <span className="text-outline">Voice.</span>
            </h2>
          </div>
          
          {/* Index Counter */}
          <div className="text-artisan-light font-display font-extrabold text-5xl lg:text-7xl opacity-10">
            0{current + 1} <span className="text-2xl lg:text-3xl">/ 0{reviews.length}</span>
          </div>
        </div>

        {/* Single Testimonial Display */}
        <div ref={ref} className="relative border-2 border-artisan-light p-10 lg:p-24 min-h-[500px] flex flex-col justify-center overflow-hidden">
          
          {/* Background Decorative Quote */}
          <div className="absolute -top-20 -left-10 text-[20rem] font-display font-extrabold text-artisan-light/[0.03] pointer-events-none">
             "
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="relative z-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Quote Text */}
                <div className="lg:col-span-9">
                  <p className="text-3xl md:text-4xl lg:text-6xl font-display font-extrabold uppercase text-artisan-light leading-[1.05]">
                    "{reviews[current].text || reviews[current].comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="lg:col-span-3 lg:border-l-2 border-artisan-light/10 lg:pl-12 pt-8 lg:pt-0">
                  <div className="text-2xl font-display font-extrabold text-artisan-grey uppercase mb-2">
                    {reviews[current].user?.name}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-artisan-light/40 uppercase tracking-[0.3em]">
                    {reviews[current].user?.role || 'Verified Artisan'} <br /> {reviews[current].user?.onboardingData?.location || 'Collective Member'}
                  </div>
                  
                  {/* Small Inverted Quote Icon */}
                  <div className="mt-12 w-12 h-12 bg-artisan-grey flex items-center justify-center">
                    <Quote className="w-6 h-6 text-artisan-dark" />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls Integrated into Border */}
          {reviews.length > 1 && (
            <div className="absolute bottom-0 right-0 flex border-t-2 border-l-2 border-artisan-light">
               <button 
                 onClick={prev}
                 className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center border-r-2 border-artisan-light hover:bg-artisan-grey hover:text-artisan-dark transition-colors duration-300"
               >
                 <ChevronLeft className="w-8 h-8" />
               </button>
               <button 
                 onClick={next}
                 className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center hover:bg-artisan-grey hover:text-artisan-dark transition-colors duration-300"
               >
                 <ChevronRight className="w-8 h-8" />
               </button>
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-12 flex justify-between items-center px-4 opacity-40">
           <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-artisan-light">Verified Craft Testimony</span>
           <div className="flex gap-2">
             {reviews.map((_, i) => (
               <div key={i} className={`h-1 transition-all duration-500 ${i === current ? 'w-12 bg-artisan-grey' : 'w-4 bg-artisan-light/20'}`} />
             ))}
           </div>
        </div>
      </div>
    </section>
  )
}
