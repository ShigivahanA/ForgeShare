import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Hammer, Zap, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react'

const steps = [
  {
    id: '01',
    title: 'Find Your Tool',
    desc: 'Browse our curated collection of industrial-grade equipment. From wood lathes to plasma cutters.',
    icon: Hammer
  },
  {
    id: '02',
    title: 'Book the Forge',
    desc: 'Select your dates and verify your artisan status. We handle the insurance and security.',
    icon: Zap
  },
  {
    id: '03',
    title: 'Craft & Create',
    desc: 'Pick up your gear from a local maker workshop and bring your vision to life.',
    icon: ShieldCheck
  },
  {
    id: '04',
    title: 'Return & Review',
    desc: 'Give the tool back, share your results, and help the community grow.',
    icon: ShoppingBag
  }
]

export default function HowItWorks() {
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
                The Process
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl lg:text-[10rem] font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-artisan-light"
              >
                HOW IT <br />
                <span className="text-outline">WORKS.</span>
              </motion.h1>
              <p className="text-xl md:text-2xl text-artisan-light/40 font-display font-medium uppercase tracking-widest leading-relaxed max-w-2xl">
                We've built the ultimate loop for makers. Access high-end gear without the high-end cost.
              </p>
           </div>
        </header>

        {/* STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-artisan-light/10 border border-artisan-light/10 mb-32">
           {steps.map((step, idx) => (
             <div key={idx} className="bg-artisan-dark p-8 md:p-12 space-y-8 group hover:bg-artisan-light/[0.02] transition-all">
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 bg-artisan-light/5 border border-artisan-light/10 flex items-center justify-center text-artisan-grey group-hover:bg-artisan-grey group-hover:text-artisan-dark transition-all duration-500">
                      <step.icon className="w-6 h-6" />
                   </div>
                   <span className="text-[10px] font-mono font-bold text-artisan-light/20 uppercase tracking-widest">{step.id}</span>
                </div>
                <div className="space-y-4">
                   <h3 className="text-2xl font-display font-black text-artisan-light uppercase tracking-tight group-hover:text-artisan-grey transition-colors">{step.title}</h3>
                   <p className="text-xs font-mono text-artisan-light/40 leading-relaxed uppercase tracking-wider">{step.desc}</p>
                </div>
             </div>
           ))}
        </div>

        {/* CALL TO ACTION */}
        <section className="border border-artisan-grey/20 bg-artisan-grey/[0.02] p-12 md:p-20 text-center space-y-10 relative overflow-hidden">
           <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
              <Hammer className="w-64 h-64 text-artisan-grey" />
           </div>
           
           <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter text-artisan-light leading-none">
                Ready to <br />
                <span className="text-outline text-artisan-grey">Start Forging?</span>
              </h2>
              <p className="text-xs font-mono font-bold text-artisan-light/30 uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">
                Join the largest network of professional tool owners and makers in the country.
              </p>
           </div>

           <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/rent" 
                className="px-12 py-6 bg-artisan-light text-artisan-dark font-display font-black uppercase tracking-widest hover:bg-artisan-grey transition-all"
              >
                 Browse Gear
              </Link>
              <Link 
                to="/list" 
                className="px-12 py-6 border-2 border-artisan-light/10 text-artisan-light font-display font-black uppercase tracking-widest hover:bg-artisan-light/5 transition-all flex items-center justify-center gap-4"
              >
                 Share Your Tools
                 <ArrowRight className="w-5 h-5" />
              </Link>
           </div>
        </section>

      </div>
    </div>
  )
}
