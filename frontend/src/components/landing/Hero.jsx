import { motion } from 'framer-motion'
import { ArrowRight, Hammer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Hero() {
  const { user } = useAuth()

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-artisan-dark bg-noise pt-20"
    >
      {/* Structural Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-artisan-light/5" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-artisan-light/5" />
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-8 px-4 py-2 bg-artisan-grey/10 border border-artisan-grey/20"
          >
            <Hammer className="w-4 h-4 text-artisan-grey" />
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-artisan-grey">
              Quality Guaranteed
            </span>
          </motion.div>

          {/* Masterpiece Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold uppercase tracking-tighter leading-[0.85] mb-10 text-artisan-light"
          >
            Forge <span className="text-outline">Your</span> <br />
            Legacy <br />
            <span className="text-artisan-grey">Online.</span>
          </motion.h1>

          {/* Refined Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-artisan-light/70 max-w-2xl mx-auto mb-12 leading-relaxed font-normal"
          >
            Access a curated collection of premium artisan tools. 
            Rent from the best, for the best. No compromise.
          </motion.p>

          {/* Action Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/rent" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-14 py-6 bg-artisan-grey text-artisan-dark font-display font-extrabold uppercase tracking-widest text-xs hover:bg-artisan-light transition-colors duration-300 relative group overflow-hidden"
              >
                <span className="relative z-10">{user ? 'Explore Arsenal' : 'Start Renting'}</span>
                <div className="absolute inset-0 bg-artisan-light translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>
            </Link>

            <Link to={user ? '/list-tool' : '/signup'} className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full px-14 py-6 border-2 border-artisan-light text-artisan-light font-display font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-artisan-light hover:text-artisan-dark transition-all duration-300"
              >
                {user ? 'List Your Gear' : 'Join the Guild'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
