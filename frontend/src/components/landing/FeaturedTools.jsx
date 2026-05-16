import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Star, MapPin, Wrench, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const CATEGORIES = ['All', 'Woodworking', 'Metalworking', 'Digital Fabrication', 'Hand Tools', 'Finishing']

export default function FeaturedTools() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedTools = async () => {
      try {
        setLoading(true)
        const params = {
          limit: 6,
          sort: '-averageRating',
          status: 'approved',
          isActive: true
        }
        if (activeCategory !== 'All') {
          params.category = activeCategory
        }
        const res = await api.get('/listings', { params })
        setTools(res.data.data)
      } catch (err) {
        console.error('Failed to fetch featured tools', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedTools()
  }, [activeCategory])

  return (
    <section id="featured-tools" className="bg-artisan-dark bg-noise border-b-2 border-artisan-light">
      <div className="container-custom py-24 lg:py-48">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-16 mb-24 lg:mb-40">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-artisan-grey mb-8 block">Tool Inventory</span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold uppercase tracking-tighter leading-[0.8] text-artisan-light">
              Premium <br />
              <span className="text-outline">Selection.</span>
            </h2>
          </motion.div>

          {/* Categories Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-2 lg:gap-4 lg:max-w-md justify-start xl:justify-end"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 border-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-all duration-500 ${
                  activeCategory === cat
                    ? 'bg-artisan-grey text-artisan-dark border-artisan-grey'
                    : 'text-artisan-light border-artisan-light hover:bg-artisan-light hover:text-artisan-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Tools Catalog Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-artisan-light min-h-[600px]">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-48">
              <Loader2 className="w-12 h-12 text-artisan-grey animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {tools.length > 0 ? (
                tools.map((tool, i) => (
                  <motion.div
                    key={tool._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="bg-artisan-dark p-10 lg:p-16 border-r-2 border-b-2 border-artisan-light flex flex-col group transition-all duration-700 hover:bg-artisan-grey relative overflow-hidden"
                  >
                    {/* Visual Label */}
                    <div className="flex justify-between items-start mb-16 relative z-10">
                      <span className="text-[10px] font-mono font-bold text-artisan-grey group-hover:text-artisan-dark uppercase tracking-widest">{tool.category}</span>
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-artisan-light group-hover:text-artisan-dark uppercase">
                        <Star className="w-3 h-3 fill-current" />
                        {tool.averageRating || '5.0'}
                      </div>
                    </div>

                    {/* Tool Image/Graphic */}
                    <div className="mb-16 relative z-10 aspect-square w-full overflow-hidden border border-artisan-light/5 group-hover:border-artisan-dark/20 transition-colors duration-500 bg-artisan-light/5">
                      {tool.images?.[0] ? (
                        <img 
                          src={tool.images[0]} 
                          alt={tool.title} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Wrench className="w-10 h-10 text-artisan-grey group-hover:text-artisan-dark transition-colors duration-500" />
                        </div>
                      )}
                    </div>

                    <div className="mt-auto relative z-10">
                      <h3 className="text-3xl md:text-4xl font-display font-extrabold uppercase text-artisan-light group-hover:text-artisan-dark mb-4 leading-tight transition-colors duration-500 line-clamp-2">
                        {tool.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-artisan-light/40 group-hover:text-artisan-dark/60 uppercase tracking-widest mb-10 transition-colors duration-500">
                        <MapPin className="w-3 h-3" />
                        {tool.location?.city || 'Brooklyn'}, {tool.location?.state || 'NY'}
                      </div>

                      <div className="flex items-center justify-between pt-10 border-t border-artisan-light/10 group-hover:border-artisan-dark/20 transition-colors duration-500">
                        <div>
                          <span className="text-4xl font-display font-extrabold text-artisan-grey group-hover:text-artisan-dark transition-colors duration-500">₹{tool.pricePerDay?.toLocaleString()}</span>
                          <span className="text-[10px] font-mono font-bold text-artisan-light/40 group-hover:text-artisan-dark/60 ml-2 uppercase transition-colors duration-500">/ DAY</span>
                        </div>
                        <Link to={`/tool/${tool._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="w-14 h-14 bg-artisan-light text-artisan-dark flex items-center justify-center hover:bg-artisan-dark hover:text-artisan-light transition-colors duration-300"
                          >
                            <ArrowUpRight className="w-6 h-6" />
                          </motion.button>
                        </Link>
                      </div>
                    </div>

                    {/* Industrial Grid Lines (Decorative) */}
                    <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-artisan-light/5 pointer-events-none" />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-48 text-center border-r-2 border-b-2 border-artisan-light">
                  <p className="text-xs font-mono text-artisan-light/20 uppercase tracking-[0.4em]">No gear discovered in this sector yet.</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Catalog Footer */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={isInView ? { opacity: 1 } : {}}
           transition={{ delay: 0.8 }}
           className="mt-20 flex justify-center"
        >
          <Link to="/rent">
            <button className="px-16 py-6 bg-artisan-light text-artisan-dark font-display font-extrabold uppercase tracking-widest text-xs hover:bg-artisan-grey hover:text-artisan-dark transition-all duration-500">
              View Complete Inventory
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
