import { motion } from 'framer-motion'
import { Hammer, Users, Globe, Target } from 'lucide-react'

const stats = [
  { label: 'Artisans', value: '15K+' },
  { label: 'Workshops', value: '800+' },
  { label: 'Tools Listed', value: '50K+' },
  { label: 'Cities', value: '120+' }
]

export default function About() {
  return (
    <div className="min-h-screen bg-artisan-dark bg-noise pt-24 md:pt-32 pb-24">
      <div className="container-custom">
        
        {/* HERO SECTION */}
        <header className="mb-24 md:mb-32">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8 space-y-8">
                 <motion.span 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.6em] block"
                 >
                   Our Origin
                 </motion.span>
                 <motion.h1 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-6xl md:text-8xl lg:text-[10rem] font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-artisan-light"
                 >
                   FORGE <br />
                   <span className="text-outline">SHARE.</span>
                 </motion.h1>
              </div>
              <div className="lg:col-span-4 pb-4">
                 <p className="text-lg text-artisan-light/40 font-display font-medium uppercase tracking-widest leading-relaxed">
                   Democratizing industrial-grade tools for the modern creator. No barriers, just better gear.
                 </p>
              </div>
           </div>
        </header>

        {/* MISSION SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
           {[
             { title: 'Community', icon: Users, desc: 'Connecting tool owners with those who have a vision but lack the equipment.' },
             { title: 'Quality', icon: Hammer, desc: 'We only list the best. Industrial-grade gear that won\'t let you down.' },
             { title: 'Access', icon: Globe, desc: 'Making high-end workshops available to everyone, regardless of their location.' }
           ].map((item, idx) => (
             <div key={idx} className="space-y-6">
                <div className="w-12 h-12 bg-artisan-light/5 border border-artisan-light/10 flex items-center justify-center text-artisan-grey">
                   <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-extrabold uppercase text-artisan-light">{item.title}</h3>
                <p className="text-xs font-mono text-artisan-light/40 uppercase tracking-widest leading-loose">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-artisan-light/10 border border-artisan-light/10 mb-32">
           {stats.map((stat, idx) => (
             <div key={idx} className="bg-artisan-dark p-12 text-center space-y-2">
                <span className="text-[8px] font-mono text-artisan-light/30 uppercase tracking-[0.4em]">{stat.label}</span>
                <p className="text-5xl font-display font-black text-artisan-light tracking-tighter">{stat.value}</p>
             </div>
           ))}
        </div>

        {/* VISION */}
        <section className="bg-artisan-light/[0.02] border border-artisan-light/10 p-12 md:p-24 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <Target className="w-64 h-64 text-artisan-grey" />
           </div>
           <div className="max-w-2xl space-y-12 relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-artisan-light">A World Without <br /><span className="text-outline">Limits.</span></h2>
              <div className="space-y-6 text-sm font-mono text-artisan-light/40 uppercase tracking-widest leading-loose">
                 <p>We believe that the only thing standing between a maker and their masterpiece should be their own creativity—not the price tag of a milling machine.</p>
                 <p>ForgeShare was founded to break the monopoly of industrial access, turning every neighborhood into a high-powered manufacturing hub.</p>
              </div>
           </div>
        </section>

      </div>
    </div>
  )
}
