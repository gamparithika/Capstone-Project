import { useState } from 'react';
import { ArrowDown, ArrowRight, Check, GitBranch } from 'lucide-react';
import { METHODOLOGY_PIPELINE } from '../data/illustrativeAnalytics';

export default function MethodologySection() {
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);
  const selectedStep = METHODOLOGY_PIPELINE[selectedStepIdx];

  return (
    <section
      id="methodology"
      className="border-b border-slate-200 bg-slate-50/60 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            End-to-End Machine Learning Workflow
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            Machine Learning Methodology
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Select any stage in the nine-step pipeline below to inspect preprocessing rules,
            feature engineering formulas, training splits, and evaluation criteria.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left: Interactive Visual 9-Step Workflow */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                <GitBranch className="h-4 w-4 text-teal-700" aria-hidden="true" />
                <span>Pipeline Sequence</span>
              </h3>
              <span className="font-mono text-xs text-slate-500">9 Stages</span>
            </div>

            <ol className="mt-5 flex flex-col items-stretch">
              {METHODOLOGY_PIPELINE.map((step, idx) => {
                const isSelected = idx === selectedStepIdx;
                const isLast = idx === METHODOLOGY_PIPELINE.length - 1;
                return (
                  <li key={step.stepNumber} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedStepIdx(idx)}
                      aria-current={isSelected ? 'step' : undefined}
                      className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left transition-colors duration-150 cursor-pointer ${
                        isSelected
                          ? 'border-navy-900 bg-navy-900 text-white'
                          : 'border-slate-200 bg-white text-navy-950 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums shrink-0 ${
                            isSelected ? 'text-teal-300' : 'text-teal-800'
                          }`}
                        >
                          {step.stepNumber}
                        </span>
                        <span className="truncate text-sm font-semibold">
                          {step.shortLabel}
                        </span>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 shrink-0 ${
                          isSelected ? 'text-teal-300' : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {!isLast && (
                      <div
                        aria-hidden="true"
                        className="flex h-6 items-center justify-center text-slate-400"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right: Selected Stage Technical Details */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="font-mono text-xs font-semibold text-teal-800">
                  Stage {selectedStep.stepNumber} of 09
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {selectedStep.shortLabel}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold text-navy-950">{selectedStep.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {selectedStep.summary}
              </p>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Implementation Specifications
                </p>
                <ul className="mt-3 space-y-3">
                  {selectedStep.technicalDetails.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-teal-700"
                        aria-hidden="true"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                <button
                  type="button"
                  disabled={selectedStepIdx === 0}
                  onClick={() => setSelectedStepIdx((i) => Math.max(0, i - 1))}
                  className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-navy-950 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous Stage
                </button>
                <button
                  type="button"
                  disabled={selectedStepIdx === METHODOLOGY_PIPELINE.length - 1}
                  onClick={() =>
                    setSelectedStepIdx((i) =>
                      Math.min(METHODOLOGY_PIPELINE.length - 1, i + 1)
                    )
                  }
                  className="rounded-lg bg-navy-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next Stage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
