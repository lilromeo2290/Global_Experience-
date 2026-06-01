'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    q: 'How do I apply for a placement?',
    a: 'Simply navigate to our Contact page and fill out the application form. Select your preferred program type, indicate your availability, and our team will review your application within 48 hours. You can also email us directly at placements@globalvolunteer.org for a more personalized consultation.',
  },
  {
    q: 'What is included in the placement fee?',
    a: 'Our placement fee covers airport pickup and drop-off, local orientation, accommodation, feeding and welfare support, placement organization and coordination, 24/7 on-ground support, and a comprehensive pre-departure information pack. The fee varies depending on the program duration and type.',
  },
  {
    q: 'Do I need previous experience to volunteer?',
    a: 'While some placements require specific qualifications (such as medical or law placements), many of our volunteer opportunities welcome participants of all experience levels. We provide comprehensive training and orientation to ensure you are prepared for your role regardless of your background.',
  },
  {
    q: 'How long do placements typically last?',
    a: 'Placement durations vary from 2 weeks to 6 months depending on the program type. Short-term volunteer programs range from 2-8 weeks, while professional internships and placements typically run 8-24 weeks. We can also customize durations to fit your schedule.',
  },
  {
    q: 'Is it safe to volunteer in Africa?',
    a: 'Absolutely. Safety is our top priority. We provide 24/7 on-ground support, vetted accommodations, comprehensive travel insurance, local coordinators, and thorough safety briefings during orientation. We continuously monitor local conditions and have robust emergency protocols in place.',
  },
  {
    q: 'Can I get academic credit for my placement?',
    a: 'Yes, many of our programs qualify for academic credit. We work closely with universities and educational institutions worldwide to ensure our placements meet their requirements. We provide all necessary documentation, supervisor evaluations, and certificates upon completion.',
  },
  {
    q: 'What happens after I submit my application?',
    a: 'After submitting your application, our team reviews it within 48 hours. You will then be invited for an informal interview (via video call) to discuss your preferences and goals. Once matched with a placement, you will receive a comprehensive pre-departure pack with all the information you need.',
  },
  {
    q: 'Are there age restrictions for volunteering?',
    a: 'Participants must be at least 18 years old. There is no upper age limit — we welcome volunteers of all ages who are in good health and have the enthusiasm to contribute. Some specialized placements may have additional requirements which will be clearly communicated.',
  },
  {
    q: 'How are donations used?',
    a: '90% of all donations go directly to our programs and community projects. This includes funding placements for students who cannot afford fees, building infrastructure like schools and water systems, purchasing medical supplies, and supporting community development initiatives. We publish annual financial reports for full transparency.',
  },
  {
    q: 'Can I bring a group or organize a team trip?',
    a: 'Yes, we welcome group placements! Whether it is a university group, corporate team, or friends traveling together, we can customize a program that fits your group size, interests, and schedule. Group placements often have additional benefits including discounted fees and tailored activities.',
  },
]

export default function FAQSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-vogue font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-cornell mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-charcoal leading-relaxed">
            Find answers to the most common questions about our programs, placements, and volunteer opportunities.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={`faq-${i}`} className="bg-white rounded-xl border border-border px-6 shadow-sm hover:border-vogue/20 transition-colors">
                <AccordionTrigger className="text-left text-cornell font-semibold hover:no-underline text-sm py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-charcoal text-sm leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
