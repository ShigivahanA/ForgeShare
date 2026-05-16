import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import api from '../../services/api'

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [platformStats, setPlatformStats] = useState({ users: 0, listings: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/listings/stats')
        setPlatformStats(res.data.data)
      } catch (err) {
        console.error('Failed to fetch platform stats', err)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    { 
      value: platformStats.users > 0 ? `${platformStats.users}` : '1.2K', 
      label: 'Artisans', 
      description: 'Our growing community of verified professional makers.' 
    },
    { 
      value: platformStats.listings > 0 ? `${platformStats.listings}` : '4.5K', 
      label: 'Tools', 
      description: 'A curated inventory of high-grade industrial equipment.' 
    },
    { value: '98%', label: 'Trust', description: 'Consistent excellence across our rental network.' },
    { value: '24H', label: 'Support', description: 'Always available assistance for our craft community.' },
  ]

  return (
    <section ref={ref} className="bg-artisan-dark bg-noise border-b border-artisan-light">
      <div className="container-custom py-24 lg:py-48">
        
        {/* Header */}
        <div className="mb-20 lg:mb-32 max-w-2xl">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-artisan-grey mb-6 block">Metrics of Craft</span>
          <h2 className="text-5xl lg:text-7xl font-display font-extrabold uppercase tracking-tighter leading-none text-artisan-light">
            Proven <br />
            <span className="text-outline">Authority.</span>
          </h2>
        </div>

        {/* Massive Stat Rows */}
        <div className="flex flex-col border-t-2 border-artisan-light">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group border-b-2 border-artisan-light py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:bg-artisan-grey transition-colors duration-500"
            >
              {/* Value Column */}
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                  className="text-8xl md:text-[10rem] lg:text-[12rem] font-display font-extrabold leading-none text-artisan-grey group-hover:text-artisan-dark transition-colors duration-500 tracking-tighter"
                >
                  {stat.value}
                </motion.div>
              </div>

              {/* Label & Description Column */}
              <div className="lg:col-span-4">
                <h3 className="text-3xl lg:text-5xl font-display font-extrabold uppercase text-artisan-light group-hover:text-artisan-dark transition-colors duration-500 mb-4">
                  {stat.label}
                </h3>
              </div>

              {/* Description Column */}
              <div className="lg:col-span-3">
                <p className="text-sm lg:text-base font-body text-artisan-light/60 group-hover:text-artisan-dark/80 transition-colors duration-500 leading-relaxed font-medium">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
