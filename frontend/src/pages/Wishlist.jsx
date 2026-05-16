import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Hammer, 
  MapPin, 
  Star,
  ExternalLink
} from 'lucide-react'

const initialWishlist = [
  {
    id: 'T1',
    name: 'Precision Wood Lathe',
    category: 'Woodworking',
    price: 4500,
    location: 'Brooklyn, NY',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'T3',
    name: '3D Printing Array',
    category: 'Digital Fabrication',
    price: 3000,
    location: 'Manhattan, NY',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'T5',
    name: 'Oscilloscope X-200',
    category: 'Electronics',
    price: 4000,
    location: 'Jersey City, NJ',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
  }
]

export default function Wishlist() {
  const [items, setItems] = useState(initialWishlist)

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-artisan-dark bg-noise pt-24 md:pt-32 pb-24">
      <div className="container-custom">
        
        {/* HEADER SECTION */}
        <header className="mb-16 md:mb-24">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                 <motion.span 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.6em] block"
                 >
                   Personal Collection
                 </motion.span>
                 <motion.h1 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-6xl md:text-8xl lg:text-[10rem] font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-artisan-light"
                 >
                   THE <br />
                   <span className="text-outline">VAULT.</span>
                 </motion.h1>
              </div>

              <div className="flex items-center gap-12 border-t md:border-t-0 border-artisan-light/5 pt-8 md:pt-0">
                 <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Saved Items</span>
                    <span className="text-2xl font-display font-black text-artisan-light">{items.length}</span>
                 </div>
                 <div className="w-px h-12 bg-artisan-light/10" />
                 <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Total Value</span>
                    <span className="text-2xl font-display font-black text-artisan-grey">₹{items.reduce((acc, curr) => acc + curr.price, 0)}</span>
                 </div>
              </div>
           </div>
        </header>

        {/* WISHLIST GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <main className="lg:col-span-12">
            <AnimatePresence mode="popLayout">
              {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="group relative bg-artisan-light/[0.02] border border-artisan-light/10 hover:border-artisan-grey transition-all duration-700 overflow-hidden"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                         <img 
                           src={item.image} 
                           alt={item.name} 
                           className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                         />
                         <div className="absolute inset-0 bg-artisan-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <Link 
                              to={`/tool/${item.id}`}
                              className="w-12 h-12 bg-artisan-light text-artisan-dark flex items-center justify-center hover:bg-artisan-grey transition-colors"
                            >
                               <ExternalLink className="w-5 h-5" />
                            </Link>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="w-12 h-12 bg-artisan-grey text-artisan-dark flex items-center justify-center hover:bg-artisan-light transition-colors"
                            >
                               <Trash2 className="w-5 h-5" />
                            </button>
                         </div>
                         
                         {/* Category Badge */}
                         <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-artisan-dark text-[8px] font-mono font-bold text-artisan-light uppercase tracking-widest border border-artisan-light/10">
                               {item.category}
                            </span>
                         </div>
                      </div>

                      {/* Info Container */}
                      <div className="p-6 md:p-8 space-y-6">
                         <div className="flex justify-between items-start gap-4">
                            <h3 className="text-xl md:text-2xl font-display font-extrabold uppercase tracking-tight text-artisan-light group-hover:text-artisan-grey transition-colors leading-tight">
                               {item.name}
                            </h3>
                            <div className="flex items-center gap-1 shrink-0">
                               <Star className="w-3 h-3 fill-artisan-grey text-artisan-grey" />
                               <span className="text-[10px] font-mono font-bold text-artisan-light">{item.rating}</span>
                            </div>
                         </div>

                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-artisan-light/40">
                               <MapPin className="w-3 h-3" />
                               <span className="text-[10px] font-mono uppercase tracking-widest">{item.location}</span>
                            </div>
                         </div>

                         <div className="pt-6 border-t border-artisan-light/5 flex items-center justify-between">
                            <div className="flex flex-col">
                               <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-widest">Rate</span>
                               <span className="text-xl font-display font-black text-artisan-light tracking-tight">₹{item.price}</span>
                            </div>
                            
                            <Link 
                              to={`/checkout/${item.id}`}
                              className="flex items-center gap-3 px-6 py-3 bg-artisan-light text-artisan-dark font-display font-black uppercase tracking-widest text-[10px] hover:bg-artisan-grey transition-all"
                            >
                               Rent Now
                               <ArrowRight className="w-4 h-4" />
                            </Link>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center text-center py-40 space-y-8"
                >
                   <div className="w-24 h-24 bg-artisan-light/5 border border-artisan-light/10 flex items-center justify-center text-artisan-light/10">
                      <ShoppingBag className="w-12 h-12" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">
                        The Vault is <br />
                        <span className="text-outline">Empty.</span>
                      </h2>
                      <p className="text-xs font-mono font-bold text-artisan-light/30 uppercase tracking-[0.4em]">Start saving gear for your next project</p>
                   </div>
                   <Link 
                     to="/rent" 
                     className="px-12 py-6 bg-artisan-grey text-artisan-dark font-display font-black uppercase tracking-widest hover:bg-artisan-light transition-all"
                   >
                      Browse Tools
                   </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  )
}
