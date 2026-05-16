import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Hammer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function CTA() {
  const ref = useRef(null)
  const { user } = useAuth()
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-artisan-grey bg-noise py-24 lg:py-48 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 p-12 opacity-10">
        <Hammer className="w-64 h-64 text-artisan-dark" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-artisan-dark mb-8 block">Final Step</span>
            <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-extrabold uppercase tracking-tighter leading-[0.8] text-artisan-dark">
              Ready to <br />
              <span className="text-artisan-dark/40">Build?</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-artisan-dark/80 max-w-2xl mb-16 font-body leading-relaxed"
          >
            Join the most exclusive network of professional artisans. Rent precision tools or list your own inventory to start earning today.
          </motion.p>

          {/* Large Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link to={user ? '/list-tool' : '/signup'} className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-16 py-8 bg-artisan-dark text-artisan-light font-display font-extrabold uppercase tracking-widest text-sm hover:bg-artisan-light hover:text-artisan-dark transition-all duration-500 shadow-2xl flex items-center justify-center gap-4"
              >
                {user ? 'List Your Gear' : 'Get Started Now'}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link to="/rent" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full px-16 py-8 border-2 border-artisan-dark text-artisan-dark font-display font-extrabold uppercase tracking-widest text-sm hover:bg-artisan-dark hover:text-artisan-light transition-all duration-500 flex items-center justify-center"
              >
                Explore Collection
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-20 pt-10 border-t border-artisan-dark/10 flex flex-wrap gap-x-12 gap-y-6"
          >
             <div className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-artisan-dark/40">NO CREDIT CARD REQUIRED</div>
             <div className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-artisan-dark/40">FULLY INSURED RENTALS</div>
             <div className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-artisan-dark/40">24/7 ARTISAN SUPPORT</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
