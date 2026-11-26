import { HeartPulse, ShieldCheck } from 'lucide-react';
import { NavSectionId } from './Navbar';

interface FooterProps {
  onNavigate: (sectionId: NavSectionId | 'project-info' | 'model-comparison') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white">
              <HeartPulse className="h-5 w-5 text-teal-400" aria-hidden="true" />
              <span>CardioPredict AI</span>
            </div>
            <p className="mt-3 max-w-xl text-sm font-medium text-slate-200">
              Academic Capstone Project – Early Prediction of Heart Disease Using Lifestyle and
              Health Indicators.
            </p>
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-slate-800 bg-navy-900/60 p-4 text-xs leading-relaxed text-slate-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
              <p>
                <span className="font-semibold text-white">Medical Disclaimer:</span> This
                application is intended for academic and educational purposes only. It is not a
                medical diagnostic tool and must not replace professional medical advice.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:flex lg:justify-end">
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Navigation
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a
                      href="#home"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('home');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('about');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      About Project
                    </a>
                  </li>
                  <li>
                    <a
                      href="#prediction"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('prediction');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Risk Assessment
                    </a>
                  </li>
                  <li>
                    <a
                      href="#analytics"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('analytics');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Analytics Dashboard
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Research & Models
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a
                      href="#methodology"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('methodology');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      ML Methodology
                    </a>
                  </li>
                  <li>
                    <a
                      href="#model-comparison"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('model-comparison');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Model Comparison
                    </a>
                  </li>
                  <li>
                    <a
                      href="#project-info"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('project-info');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Project Information
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex sm:items-center sm:justify-between">
          <p>B.Tech Computer Science Capstone · CardioPredict AI</p>
          <p className="mt-2 sm:mt-0">
            Kaggle Cardiovascular Disease Schema · Python Scikit-Learn API Ready
          </p>
        </div>
      </div>
    </footer>
  );
}
