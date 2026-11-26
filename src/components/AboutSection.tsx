import { useState } from 'react';
import { Activity, HeartPulse, ShieldAlert, Stethoscope, TrendingUp } from 'lucide-react';

const INDICATOR_GROUPS = [
  {
    index: '01',
    title: 'What Is Cardiovascular Disease?',
    icon: HeartPulse,
    body: 'Cardiovascular disease (CVD) encompasses disorders of the heart and blood vessels, including coronary artery disease, hypertension-induced heart strain, and cerebrovascular events. Because structural vascular changes often progress silently over years, many individuals remain asymptomatic until an acute clinical event occurs.',
  },
  {
    index: '02',
    title: 'Why Early Risk Assessment Matters',
    icon: ShieldAlert,
    body: 'Identifying elevated risk profiles early allows clinicians and individuals to initiate preventive lifestyle modifications and targeted diagnostic follow-up before irreversible complications develop. Screening models built on routine vitals enable accessible, low-cost triage.',
  },
  {
    index: '03',
    title: 'Role of Lifestyle Indicators',
    icon: Activity,
    body: 'Modifiable daily behaviors—tobacco smoking, alcohol consumption, and regular physical activity—directly influence endothelial health, systemic inflammation, and arterial stiffness. Recording these binary indicators captures behavioral risk context beyond laboratory snapshots.',
  },
  {
    index: '04',
    title: 'Role of Clinical Health Indicators',
    icon: Stethoscope,
    body: 'Objective measurements including age, gender, derived Body Mass Index (BMI), systolic and diastolic blood pressure, serum cholesterol, and fasting glucose levels reflect cumulative physiological load on the cardiovascular system.',
  },
];

export default function AboutSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="about" className="border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              About The Project
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl [text-wrap:balance]">
              Connecting Lifestyle Habits and Clinical Vitals with Machine Learning
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              This B.Tech Computer Science capstone investigates how supervised machine learning
              classifiers evaluate multi-factor cardiovascular risk from routine outpatient
              measurements and patient-reported habits.
            </p>

            {/* Clinical Workspace Image */}
            <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {!imageError ? (
                <img
                  src="/src/assets/images/about_clinical_research_1794818083676.jpg"
                  alt="Modern cardiology diagnostic desk with stethoscope and telemetry monitor"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center bg-slate-50 p-6 text-center">
                  <Stethoscope className="h-12 w-12 text-navy-800" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold text-navy-950">
                    Preventive Cardiovascular Screening
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Pillars + ML Support */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
              {INDICATOR_GROUPS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.index} className="p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-navy-900">
                        <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-navy-950">
                          {item.index}. {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 05. How Machine Learning Supports Risk Classification */}
              <div className="bg-slate-50/70 p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
                    <TrendingUp className="h-5 w-5 text-teal-300" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-950">
                      05. How Machine Learning Supports Risk Classification
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                      Instead of relying on single-threshold rules in isolation, supervised
                      classifiers—Logistic Regression, Decision Tree, and Random Forest—learn
                      non-linear interactions across all 11 input features and derived BMI. On
                      unseen records, the trained model outputs both a binary class prediction (
                      <span className="font-mono text-xs font-semibold text-navy-900">
                        cardio = 0
                      </span>{' '}
                      or{' '}
                      <span className="font-mono text-xs font-semibold text-navy-900">
                        cardio = 1
                      </span>
                      ) and an estimated probability for Class 1 to support transparent risk
                      stratification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
