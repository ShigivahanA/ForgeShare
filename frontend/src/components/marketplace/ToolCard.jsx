import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Shield, ArrowUpRight, Star, Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function ToolCard({ tool, idx }) {
  const { user, toggleWishlist } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  
  const displayImage = tool.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  const displayRating = tool.averageRating || '5.0'
  const isWishlisted = user?.wishlist?.includes(tool._id)

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      addToast('Please login to save items', 'info')
      navigate('/login')
      return
    }

    try {
      await toggleWishlist(tool._id)
      addToast(isWishlisted ? 'Removed from collection' : 'Saved to collection', 'success')
    } catch (err) {
      addToast('Failed to update collection', 'error')
    }
  }

  return (
    <Link to={`/tool/${tool._id}`} className="block h-full">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.6, delay: idx * 0.05 }}
        className="group flex flex-col bg-artisan-light/[0.02] border border-artisan-light/5 hover:border-artisan-grey transition-all duration-700 h-full relative"
      >
        {/* Tool ID Badge */}
        <div className="absolute top-0 right-0 z-10 px-3 py-1 bg-artisan-grey text-artisan-dark text-[8px] font-mono font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Item #{tool._id.slice(-6).toUpperCase()}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 left-4 z-20 w-8 h-8 backdrop-blur-md border flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${isWishlisted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-artisan-dark/80 border-artisan-light/10 text-artisan-light hover:text-artisan-grey'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Image Area */}
        <div className="relative aspect-[16/11] overflow-hidden bg-artisan-dark">
          <img
            src={displayImage}
            alt={tool.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out "
          />

          {/* Category Floating Label */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="px-2 py-1 bg-artisan-dark/80 backdrop-blur-md text-[8px] font-mono text-artisan-grey border border-artisan-light/10 uppercase tracking-widest">
              {tool.category}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl md:text-2xl font-display font-extrabold uppercase tracking-tight text-artisan-light group-hover:text-artisan-grey transition-colors duration-500 flex-1 pr-4">
                {tool.title}
              </h3>
              <div className="flex items-center gap-1 text-artisan-grey shrink-0">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-mono font-bold">{displayRating}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-artisan-light/40">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-artisan-grey" />
                <span className="text-[9px] font-mono uppercase tracking-widest">
                  {tool.location?.city}, {tool.location?.state}
                </span>
              </div>
              <div className="w-1 h-1 rounded-full bg-artisan-light/10" />
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-artisan-grey" />
                <span className="text-[9px] font-mono uppercase tracking-widest">Verified</span>
              </div>
            </div>
          </div>

          {/* Pricing & Action */}
          <div className="pt-6 border-t border-artisan-light/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-display font-extrabold text-artisan-light tracking-tighter">
                ₹{tool.pricePerDay?.toLocaleString()}
              </span>
              <span className="text-[8px] font-mono text-artisan-grey uppercase tracking-widest">Daily Rate</span>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 border border-artisan-light/10 group-hover:border-artisan-grey group-hover:bg-artisan-grey group-hover:text-artisan-dark transition-all duration-500 text-[10px] font-display font-bold uppercase tracking-widest">
              Rent
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
          <div className="absolute bottom-2 right-2 w-px h-2 bg-artisan-light/5 group-hover:bg-artisan-grey transition-colors" />
          <div className="absolute bottom-2 right-2 h-px w-2 bg-artisan-light/5 group-hover:bg-artisan-grey transition-colors" />
        </div>
      </motion.div>
    </Link>
  )
}
