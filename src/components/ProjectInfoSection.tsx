import { BookMarked, Cpu, Database, FileText, Target, AlertOctagon } from 'lucide-react';
import { DATASET_FEATURE_DICTIONARY } from '../data/illustrativeAnalytics';

export default function ProjectInfoSection() {
  return (
    <section
      id="project-info"
      className="border-b border-slate-200 bg-slate-50/60 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Academic Capstone Documentation
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Project Information
          </h2>
          <p className="mt-2 text-base font-medium text-navy-900">
            Early Prediction of Heart Disease Using Lifestyle and Health Indicators
          </p>
        </div>

        {/* Structured Documentation Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Problem Statement */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-navy-950">
              <FileText className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>Problem Statement</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Cardiovascular diseases remain a leading cause of global morbidity and mortality, yet
              early-stage risk factors frequently go unrecognized outside specialist clinics.
              Conventional clinical risk scoring often overlooks complex interactions between daily
              lifestyle habits and routine physiological indicators. This project addresses the
              challenge of building an accessible, reproducible machine learning pipeline to classify
              cardiovascular risk early using non-invasive demographic, health, and lifestyle
              measurements.
            </p>
          </div>

          {/* Objectives */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-navy-950">
              <Target className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>Project Objectives</span>
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li>
                01. Clean and preprocess the 70,000-record Kaggle Cardiovascular Disease Dataset,
                converting age from days to years and engineering Body Mass Index (BMI).
              </li>
              <li>
                02. Conduct exploratory analysis across blood pressure, BMI, metabolic levels, and
                modifiable lifestyle behaviors.
              </li>
              <li>
                03. Train and benchmark Logistic Regression, Decision Tree, and Random Forest
                classifiers using held-out test metrics.
              </li>
              <li>
                04. Deliver a web-based screening interface ready to connect to the trained Python
                prediction API.
              </li>
            </ul>
          </div>

          {/* Dataset Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-navy-950">
              <Database className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>Dataset Information</span>
            </h3>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <div className="flex justify-between py-2">
                <dt className="text-slate-600">Source Dataset</dt>
                <dd className="font-medium text-navy-950">Kaggle Cardiovascular Disease Dataset</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-slate-600">Original Sample Size</dt>
                <dd className="font-mono font-medium text-navy-950 tabular-nums">70,000 records</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-slate-600">Original Input Indicators</dt>
                <dd className="font-mono font-medium text-navy-950 tabular-nums">11 features</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-slate-600">Engineered Indicator</dt>
                <dd className="font-medium text-navy-950">BMI (Weight / Height²)</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-slate-600">Target Column</dt>
                <dd className="font-mono font-medium text-navy-950">
                  cardio (0 = Absent, 1 = Recorded)
                </dd>
              </div>
            </dl>
          </div>

          {/* Machine Learning Algorithms */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-navy-950">
              <Cpu className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>Machine Learning Algorithms</span>
            </h3>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
              <div>
                <p className="font-semibold text-navy-950">Logistic Regression</p>
                <p>
                  Interpretable linear baseline estimating log-odds probabilities across scaled
                  clinical and lifestyle features.
                </p>
              </div>
              <div>
                <p className="font-semibold text-navy-950">Decision Tree Classifier</p>
                <p>
                  Non-parametric hierarchical splitting model capturing threshold rules across
                  blood pressure, age, and cholesterol.
                </p>
              </div>
              <div>
                <p className="font-semibold text-navy-950">Random Forest Classifier</p>
                <p>
                  Bootstrap-aggregated ensemble of decision trees reducing variance and improving
                  generalization on tabular clinical data.
                </p>
              </div>
            </div>
          </div>

          {/* Expected Outcomes */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-navy-950">
              <BookMarked className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>Expected Outcomes</span>
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li>
                • Transparent empirical comparison identifying which classifier achieves the strongest
                trade-off across Accuracy, Recall, F1 Score, and ROC-AUC.
              </li>
              <li>
                • Reproducible preprocessing pipeline converting raw measurements into validated
                model feature vectors including BMI.
              </li>
              <li>
                • Responsive clinical web application separating live Python ML inference from
                explicitly labelled Demo Mode states.
              </li>
            </ul>
          </div>

          {/* Limitations */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-navy-950">
              <AlertOctagon className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>Study Limitations</span>
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
              <li>
                • Lifestyle variables (smoking, alcohol intake, physical activity) are self-reported
                and binary, without capturing dosage, duration, or intensity.
              </li>
              <li>
                • Cross-sectional dataset records single-point observations rather than longitudinal
                time-to-event follow-up.
              </li>
              <li>
                • Intended strictly for academic research and educational demonstration; clinical
                diagnosis requires physician evaluation and comprehensive testing.
              </li>
            </ul>
          </div>
        </div>

        {/* Complete Input Features Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
            <h3 className="text-base font-semibold text-navy-950">
              Input Feature Dictionary (11 Original Indicators + 1 Target)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3 font-semibold">Column</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Format / Unit</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {DATASET_FEATURE_DICTIONARY.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/60">
                    <td className="px-6 py-3 font-mono text-xs font-semibold text-navy-950">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-teal-800">{row.category}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{row.rawUnit}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
