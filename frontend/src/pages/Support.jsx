import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Minus, Mail, MessageCircle, Phone } from 'lucide-react'

const faqs = [
  {
    q: 'How do I pick up my gear?',
    a: 'Once your rental is confirmed, you will receive the precise workshop location and pickup instructions. You\'ll meet the tool owner for a quick safety walkthrough.'
  },
  {
    q: 'What if I damage a tool?',
    a: 'Don\'t panic. Every rental includes ForgeGuard protection. Report the damage through the app immediately, and our team will handle the repair process with the owner.'
  },
  {
    q: 'Can I extend my rental?',
    a: 'Yes, if the tool is available. You can request an extension through your "Active Rentals" dashboard. The owner must approve the new return date.'
  },
  {
    q: 'Is my personal data safe?',
    a: 'We use industrial-grade encryption for all personal data and identity verification. Your privacy is protected by the ForgeShare Security Protocol.'
  }
]

export default function Support() {
  const [openIdx, setOpenIdx] = useState(null)

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
                Help Center
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl lg:text-[10rem] font-display font-extrabold uppercase tracking-tighter leading-[0.85] text-artisan-light"
              >
                GET <br />
                <span className="text-outline">SUPPORT.</span>
              </motion.h1>
              
              <div className="relative max-w-2xl pt-12 group">
                 <Search className="absolute left-6 top-[72px] w-6 h-6 text-artisan-light/20 group-focus-within:text-artisan-grey transition-colors" />
                 <input 
                   type="text" 
                   placeholder="HOW CAN WE HELP YOU TODAY?" 
                   className="w-full bg-artisan-light/[0.02] border-2 border-artisan-light/10 p-8 pl-16 text-xs font-mono font-bold text-artisan-light uppercase tracking-widest outline-none focus:border-artisan-grey transition-all"
                 />
              </div>
           </div>
        </header>

        {/* CONTACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           {[
             { title: 'Email Us', icon: Mail, value: 'support@forgeshare.com' },
             { title: 'Live Chat', icon: MessageCircle, value: 'Available 24/7' },
             { title: 'Call Center', icon: Phone, value: '+1 (800) FORGE-01' }
           ].map((item, idx) => (
             <div key={idx} className="p-10 border border-artisan-light/10 bg-artisan-light/[0.02] space-y-6 group hover:border-artisan-grey transition-all">
                <div className="w-12 h-12 bg-artisan-grey flex items-center justify-center text-artisan-dark">
                   <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xs font-mono font-bold text-artisan-light/40 uppercase tracking-widest">{item.title}</h3>
                   <p className="text-xl font-display font-black text-artisan-light uppercase tracking-tight">{item.value}</p>
                </div>
             </div>
           ))}
        </div>

        {/* FAQ SECTION */}
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="flex items-center gap-6">
              <h2 className="text-3xl font-display font-extrabold uppercase tracking-widest text-artisan-light">Common Questions</h2>
              <div className="h-px flex-1 bg-artisan-light/10" />
           </div>

           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-artisan-light/10 bg-artisan-dark">
                   <button 
                     onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                     className="w-full p-8 flex items-center justify-between text-left group"
                   >
                      <span className="text-lg font-display font-bold uppercase tracking-tight text-artisan-light group-hover:text-artisan-grey transition-colors">{faq.q}</span>
                      {openIdx === idx ? <Minus className="w-5 h-5 text-artisan-grey" /> : <Plus className="w-5 h-5 text-artisan-light/20" />}
                   </button>
                   <AnimatePresence>
                      {openIdx === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                           <div className="p-8 pt-0 text-sm font-mono text-artisan-light/40 uppercase tracking-widest leading-loose">
                              {faq.a}
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  )
}
