import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const STATIC_CATEGORIES = [
  { name: 'Woodworking', code: 'WD-01', size: 'lg:col-span-5' },
  { name: 'Measuring', code: 'MT-02', size: 'lg:col-span-4' },
  { name: 'Outdoor', code: 'PW-03', size: 'lg:col-span-3' },
  { name: 'Hand Tools', code: 'HD-04', size: 'lg:col-span-4' },
  { name: 'Metal working', code: 'MS-05', size: 'lg:col-span-4' },
  { name: 'Finishing', code: 'FN-06', size: 'lg:col-span-4' },
  { name: 'Digital Fabrication', code: 'OD-07', size: 'lg:col-span-8' },
  { name: 'Specialty', code: 'SP-08', size: 'lg:col-span-4' },
]

export default function Categories() {
  const ref = useRef(null)
  const navigate = useNavigate()
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [counts, setCounts] = useState({})

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get('/listings/categories')
        const countsMap = res.data.data.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {})
        setCounts(countsMap)
      } catch (err) {
        console.error('Failed to fetch category counts', err)
      }
    }
    fetchCounts()
  }, [])

  const handleCategoryClick = (categoryName) => {
    navigate(`/rent?category=${categoryName}`)
  }

  return (
    <section id="categories" className="bg-artisan-dark bg-noise border-b-2 border-artisan-light">
      <div className="container-custom py-24 lg:py-48">

        {/* Header */}
        <div className="mb-20 lg:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-artisan-grey mb-6 block">Classification</span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold uppercase tracking-tighter leading-[0.8] text-artisan-light">
              Craft <br />
              <span className="text-outline">Taxonomy.</span>
            </h2>
          </motion.div>
          <p className="md:max-w-xs text-artisan-light/40 font-mono text-xs uppercase tracking-[0.2em] leading-loose">
            Organized by specialized trade and engineering requirements. Select your discipline.
          </p>
        </div>

        {/* Asymmetric Category Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 border-t-2 border-l-2 border-artisan-light">
          {STATIC_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className={`group relative p-8 md:p-10 lg:p-14 border-r-2 border-b-2 border-artisan-light flex flex-col items-start text-left overflow-hidden transition-all duration-700 hover:bg-artisan-light col-span-1 md:col-span-3 ${cat.size}`}
            >
              <div className="w-full flex justify-between items-start mb-12 md:mb-16 relative z-10">
                <span className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-widest">{cat.code}</span>
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-artisan-light group-hover:text-artisan-dark group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
              </div>

              <div className="relative z-10 w-full">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold uppercase text-artisan-light group-hover:text-artisan-dark transition-colors duration-500 mb-2 leading-[0.9] break-keep hyphens-none">
                  {cat.name}
                </h3>
                <p className="text-[9px] md:text-[10px] font-mono font-bold text-artisan-light/40 group-hover:text-artisan-dark/60 uppercase tracking-widest transition-colors duration-500">
                  {counts[cat.name] || 0} AVAILABLE ITEMS
                </p>
              </div>

              {/* Hover Graphic Reveal (Scaled for mobile) */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 text-8xl md:text-[10rem] font-display font-extrabold text-artisan-light/[0.02] group-hover:text-artisan-dark/[0.05] pointer-events-none transition-all duration-700 uppercase">
                {cat.name.substring(0, 3)}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
