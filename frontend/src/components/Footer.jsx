import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Hammer, Globe, Phone, BookOpen, ArrowUp } from 'lucide-react'

const footerLinks = {
  Platform: [
    { label: 'Browse Tools', href: '/marketplace' },
    { label: 'List Your Gear', href: '/list' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'The Craft', href: '/the-craft' },
  ],
  Community: [
    { label: 'Our Makers', href: '/our-makers' },
    { label: 'Maker Stories', href: '/maker-stories' },
    { label: 'Safety & Trust', href: '/safety' },
    { label: 'Insurance', href: '/insurance' },
  ],
  Company: [
    { label: 'About ForgeShare', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Press Room', href: '/press' },
    { label: 'Support', href: '/support' },
  ],
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-artisan-light bg-noise border-t-2 border-artisan-grey relative overflow-hidden">
      <div className="container-custom pt-24 pb-12">

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24 lg:mb-40">

          {/* Brand Intro */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-artisan-grey flex items-center justify-center">
                <Hammer className="w-6 h-6 text-artisan-dark" />
              </div>
              <span className="text-3xl font-display font-extrabold uppercase tracking-tighter text-artisan-dark">
                FORGE<span className="text-artisan-grey">SHARE</span>
              </span>
            </div>
            <p className="text-lg text-artisan-dark/60 leading-relaxed mb-12 max-w-md font-body">
              The premier marketplace for specialized artisan tools. Connecting world-class makers with the quality equipment they need to build their best work.
            </p>

            {/* Social Links */}
            <div className="flex gap-6">
              {[
                { icon: Globe, label: 'INSTAGRAM' },
                { icon: Phone, label: 'TWITTER' },
                { icon: BookOpen, label: 'LINKEDIN' }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ scale: 1.1, color: '#B90504' }}
                  className="text-[10px] font-mono font-bold tracking-[0.3em] text-artisan-dark/40 hover:text-artisan-grey transition-colors"
                >
                  {social.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Directory Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-xs font-mono font-bold text-artisan-grey uppercase tracking-[0.4em] mb-8">{title}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm font-display font-extrabold uppercase text-artisan-dark/60 hover:text-artisan-grey transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Massive Logo Finale */}
        <div className="relative border-t-2 border-artisan-dark/5 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-[15vw] font-display font-extrabold uppercase tracking-[-0.05em] leading-none text-artisan-dark select-none opacity-[0.03] lg:opacity-[0.05] mb-8"
          >
            FORGESHARE
          </motion.div>

          {/* Legal & Back to Top */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex flex-wrap justify-center md:justify-start gap-x-12 gap-y-4">
              <span className="text-[10px] font-mono font-bold text-artisan-dark/30 uppercase tracking-[0.2em]">© 2026 FORGESHARE</span>
              <Link to="/privacy" className="text-[10px] font-mono font-bold text-artisan-dark/30 hover:text-artisan-grey uppercase tracking-[0.2em] transition-colors">Privacy</Link>
              <Link to="/terms" className="text-[10px] font-mono font-bold text-artisan-dark/30 hover:text-artisan-grey uppercase tracking-[0.2em] transition-colors">Terms</Link>
            </div>

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-4 text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]"
            >
              BACK TO TOP
              <div className="w-10 h-10 border-2 border-artisan-grey flex items-center justify-center group-hover:bg-artisan-grey group-hover:text-artisan-dark transition-all">
                <ArrowUp className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
