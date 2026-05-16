import React from 'react'
import { motion } from 'framer-motion'
import { Gavel, Hammer, AlertTriangle, Scale, CheckSquare } from 'lucide-react'

export default function Terms() {
  const clauses = [
    {
      title: "User Responsibility",
      icon: Hammer,
      content: "All members must verify their identity and maintain accurate records. Borrowers are responsible for the safe handling and timely return of all rented equipment in its original condition."
    },
    {
      title: "Transaction Integrity",
      icon: Scale,
      content: "All payments must be processed through the ForgeShare terminal. Any attempt to bypass platform fees or engage in off-platform transactions will result in permanent account termination."
    },
    {
      title: "Asset Liability",
      icon: AlertTriangle,
      content: "Owners warrant that their tools are safe and functional. While ForgeShare provides insurance frameworks, the primary liability for tool performance rests with the listing owner."
    },
    {
      title: "Community Conduct",
      icon: Gavel,
      content: "The ForgeShare network is built on trust and artisanal excellence. We maintain a zero-tolerance policy for harassment, fraud, or intentional damage to community assets."
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
              <Gavel className="w-5 h-5 text-artisan-dark" />
            </div>
            <span className="text-[10px] font-mono font-bold text-artisan-grey uppercase tracking-[0.4em]">Service Protocol</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter leading-[0.8] text-artisan-light mb-8">
            TERMS OF <span className="text-outline">FORGE.</span>
          </h1>
          <p className="max-w-2xl text-lg text-artisan-light/40 font-body leading-relaxed">
            These terms define the governance of the ForgeShare network. By accessing our platform, you agree to abide by these artisanal standards and legal mandates.
          </p>
        </div>

        {/* Content Stack */}
        <div className="space-y-6">
          {clauses.map((clause, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row border border-artisan-light/10 hover:border-artisan-grey transition-all duration-500 overflow-hidden"
            >
              <div className="w-full md:w-24 bg-artisan-light/[0.02] flex items-center justify-center p-8 group-hover:bg-artisan-grey group-hover:text-artisan-dark transition-colors">
                <clause.icon className="w-8 h-8" />
              </div>
              
              <div className="flex-1 p-10 bg-artisan-dark/50">
                <h3 className="text-2xl font-display font-black uppercase text-artisan-light mb-4 tracking-tight group-hover:text-artisan-grey transition-colors">
                  {idx + 1}.0 {clause.title}
                </h3>
                <p className="text-base font-body text-artisan-light/40 leading-relaxed max-w-3xl">
                  {clause.content}
                </p>
              </div>

              <div className="hidden lg:flex items-center px-10 bg-artisan-light/[0.01]">
                <div className="w-12 h-12 rounded-full border border-artisan-light/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckSquare className="w-5 h-5 text-artisan-grey" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Agreement Note */}
        <div className="mt-16 p-10 border border-artisan-grey/20 bg-artisan-grey/[0.02] text-center">
          <p className="text-[11px] font-mono text-artisan-grey font-bold uppercase tracking-[0.4em]">
            FAILURE TO ADHERE TO THESE TERMS MAY RESULT IN ASSET SEIZURE OR NETWORK BAN.
          </p>
        </div>

        {/* Legal Version */}
        <div className="mt-20 pt-10 border-t border-artisan-light/5 flex justify-between items-center">
          <p className="text-[10px] font-mono text-artisan-light/20 uppercase tracking-[0.5em]">
            Last Modified: May 16, 2026 / Version 2.1.0
          </p>
          <div className="flex gap-8">
             <span className="text-[10px] font-mono text-artisan-light/40 uppercase tracking-widest cursor-pointer hover:text-artisan-light transition-colors">Download PDF</span>
             <span className="text-[10px] font-mono text-artisan-light/40 uppercase tracking-widest cursor-pointer hover:text-artisan-light transition-colors">Archived Versions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
