import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react'

export default function Privacy() {
  const sections = [
    {
      title: "Data Collection Protocol",
      icon: Eye,
      content: "We collect only the essential data required to facilitate tool rentals and maintain community security. This includes your identification, contact details, and transaction history within the ForgeShare network."
    },
    {
      title: "Security & Encryption",
      icon: Lock,
      content: "Your data is protected by industry-standard encryption protocols. Personal information, including Aadhar data and financial records, is encrypted at rest and in transit."
    },
    {
      title: "Information Disclosure",
      icon: Shield,
      content: "ForgeShare does not sell user data. We only share necessary information with lenders/borrowers to facilitate the rental process and with legal authorities when required by mandate."
    },
    {
      title: "Your Rights",
      icon: FileText,
      content: "You maintain full sovereignty over your data. You may request a complete data export or the permanent termination of your account and associated records at any time."
    }
  ]

  return (
    <div className="min-h-screen bg-artisan-dark bg-noise pt-32 pb-24">
      <div className="container-custom">
        {/* Header Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-10 h-10 bg-artisan-grey flex items-center justify-center">
              <Shield className="w-5 h-5 text-artisan-dark" />
            </div>
            <span className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]">Privacy Policy</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-[0.8] text-artisan-light mb-8">
            DATA <span className="text-outline">SOVEREIGNTY.</span>
          </h1>
          <p className="max-w-2xl text-lg text-artisan-light/40 font-body leading-relaxed">
            At ForgeShare, we treat your data as a critical asset. Our privacy protocols are designed to ensure transparency, security, and absolute user control.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 bg-artisan-light/[0.02] border border-artisan-light/10 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <section.icon className="w-24 h-24 text-artisan-light" />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-2 bg-artisan-grey" />
                <h3 className="text-xl font-display font-black uppercase text-artisan-light tracking-tight">{section.title}</h3>
              </div>
              
              <p className="text-sm font-body text-artisan-light/50 leading-relaxed relative z-10">
                {section.content}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-[9px] font-mono font-bold text-artisan-grey uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                LEARN MORE <ChevronRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Last Updated Footer */}
        <div className="mt-20 pt-10 border-t border-artisan-light/5">
          <p className="text-[10px] font-mono text-artisan-light/20 uppercase tracking-[0.5em]">
            Last Modified: May 16, 2026 / Version 1.4.0
          </p>
        </div>
      </div>
    </div>
  )
}
