import { motion } from 'framer-motion'
import { Hammer, Zap, Globe, Shield } from 'lucide-react'

export default function TheCraft() {
  return (
    <div className="min-h-screen bg-artisan-dark bg-noise pt-24 md:pt-32 pb-24">
      <div className="container-custom">
        
        {/* HERO SECTION */}
        <header className="mb-24 md:mb-32">
           <div className="max-w-4xl space-y-8">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.6em] block"
              >
                Philosophy of Work
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl lg:text-[10rem] font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-artisan-light"
              >
                THE <br />
                <span className="text-outline">CRAFT.</span>
              </motion.h1>
           </div>
        </header>

        {/* CONTENT SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-32">
           <div className="space-y-12">
              <div className="space-y-6">
                 <h2 className="text-4xl font-display font-black text-artisan-light uppercase tracking-tight">Respect the Tool.</h2>
                 <p className="text-lg text-artisan-light/40 font-display font-medium uppercase tracking-widest leading-relaxed">
                    Craft is more than production. It is a dialogue between the artisan and the instrument. At ForgeShare, we treat every piece of gear with the reverence it deserves.
                 </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <Zap className="w-8 h-8 text-artisan-grey" />
                    <h4 className="text-xs font-mono font-bold text-artisan-light uppercase tracking-widest">Precision</h4>
                    <p className="text-[10px] font-mono text-artisan-light/30 uppercase leading-relaxed tracking-wider">The difference between a tool and a masterpiece is a millimeter.</p>
                 </div>
                 <div className="space-y-4">
                    <Globe className="w-8 h-8 text-artisan-grey" />
                    <h4 className="text-xs font-mono font-bold text-artisan-light uppercase tracking-widest">Legacy</h4>
                    <p className="text-[10px] font-mono text-artisan-light/30 uppercase leading-relaxed tracking-wider">Building things that outlast their makers is our ultimate goal.</p>
                 </div>
              </div>
           </div>

           <div className="bg-artisan-light/5 h-[600px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" alt="Craftsmanship" className="w-full h-full object-cover grayscale" />
           </div>
        </div>

        {/* MANIFESTO */}
        <section className="border-t border-artisan-light/10 pt-32 pb-12">
           <div className="max-w-4xl mx-auto text-center space-y-12">
              <span className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-[0.8em]">Our Manifesto</span>
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold uppercase tracking-tighter text-artisan-light leading-none">
                GOOD GEAR SHOULDN'T <br />
                <span className="text-outline">COLLECT DUST.</span>
              </h3>
              <p className="text-sm font-mono text-artisan-light/40 uppercase tracking-[0.4em] leading-loose max-w-2xl mx-auto">
                 "WE BELIEVE IN THE UTILITY OF BEAUTY AND THE BEAUTY OF UTILITY. TOOLS WERE MEANT TO BE USED, SHARED, AND HONORED THROUGH THE WORK THEY CREATE."
              </p>
           </div>
        </section>

      </div>
    </div>
  )
}
