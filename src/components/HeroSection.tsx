import { useState } from 'react';
import { ArrowRight, BookOpen, HeartPulse, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { NavSectionId } from './Navbar';

interface HeroSectionProps {
  onNavigate: (sectionId: NavSectionId | 'project-info') => void;
}

const DATASET_STATS = [
  {
    value: '70,000',
    label: 'Original Records',
    detail: 'De-identified adult records from the Kaggle Cardiovascular Disease Dataset',
  },
  {
    value: '11',
    label: 'Original Input Indicators',
    detail: 'Demographic, clinical measurement, and self-reported lifestyle attributes',
  },
  {
    value: '1',
    label: 'Prediction Target',
    detail: 'Binary classification target (cardio: 0 = not recorded, 1 = recorded)',
  },
];

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="home"
      className="relative border-b border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {/* Two-column balanced hero split */}
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Core Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-7"
          >
            <p className="text-xs font-medium tracking-wide text-teal-800 sm:text-sm">
              B.Tech Computer Science Capstone Project · Cardiovascular Risk Analytics
            </p>

            <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-navy-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1] [text-wrap:balance]">
              Understand Your Heart Health Better
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Explore early cardiovascular disease risk prediction using lifestyle and health
              indicators. Designed around the 70,000-record Kaggle Cardiovascular Disease schema,
              this platform pairs clinical feature validation with a Python machine learning
              inference interface.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('prediction')}
                className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Start Risk Assessment</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-navy-950 transition-colors duration-150 hover:border-navy-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-teal-700" aria-hidden="true" />
                <span>Explore Project</span>
              </button>
            </div>

            {/* Academic Research Disclaimer directly in hero */}
            <div className="mt-8 flex items-start gap-2.5 border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
              <p>
                <span className="font-semibold text-navy-950">Academic Research Notice:</span> This
                application is developed solely as an academic Computer Science research interface.
                It is not a clinical diagnostic tool and connects to an external Python ML model
                for inference (running in Demo Mode when disconnected).
              </p>
            </div>
          </motion.div>

          {/* Right Column: High-Fidelity Medical Heart Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {!imageError ? (
                <img
                  src="/src/assets/images/hero_cardiac_illustration_1794818082917.jpg"
                  alt="Scientific 3D anatomical heart illustration with navy blue and clinical teal vascular accents"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50/60 p-8 text-center">
                  <HeartPulse className="h-16 w-16 text-teal-700" aria-hidden="true" />
                  <p className="mt-4 text-sm font-semibold text-navy-950">
                    Cardiovascular Risk Modeling
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-slate-500">
                    Anatomical and hemodynamic indicator analysis
                  </p>
                </div>
              )}
              <div className="border-t border-slate-200 bg-white/95 px-4 py-3 text-xs text-slate-600 backdrop-blur-sm lg:absolute lg:inset-x-0 lg:bottom-0">
                <span className="font-semibold text-navy-950">Research Focus:</span>{' '}
                Non-invasive risk screening via blood pressure, BMI, metabolic markers, and
                lifestyle habits.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 3-Column Dataset Statistics Strip Below Hero Split */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {DATASET_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-colors duration-150 hover:border-slate-300"
            >
              <p className="font-mono text-3xl font-bold tracking-tight text-navy-950 tabular-nums sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-teal-800">{stat.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
