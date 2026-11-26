import { useState } from 'react';
import { BarChart3, Info } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ILLUSTRATIVE_ACTIVITY_ANALYSIS,
  ILLUSTRATIVE_AGE_DISTRIBUTION,
  ILLUSTRATIVE_ALCOHOL_ANALYSIS,
  ILLUSTRATIVE_BMI_DISTRIBUTION,
  ILLUSTRATIVE_BP_ANALYSIS,
  ILLUSTRATIVE_CARDIO_DISTRIBUTION,
  ILLUSTRATIVE_SMOKING_ANALYSIS,
} from '../data/illustrativeAnalytics';

type AnalyticsFilter = 'all' | 'vitals' | 'lifestyle';

const NAVY_COLOR = '#16335e';
const TEAL_COLOR = '#0f766e';

export default function AnalyticsSection() {
  const [filter, setFilter] = useState<AnalyticsFilter>('all');

  const showVitals = filter === 'all' || filter === 'vitals';
  const showLifestyle = filter === 'all' || filter === 'lifestyle';

  return (
    <section id="analytics" className="border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + Filter Controls */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Exploratory Data Analysis Preview
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Analytics Dashboard
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Visual breakdown across cardiovascular target classes, age groups, Body Mass Index,
              blood pressure stages, and lifestyle risk indicators.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter analytics charts"
            className="inline-flex items-center gap-1 self-start rounded-lg bg-slate-100 p-1 md:self-auto"
          >
            {(
              [
                { id: 'all', label: 'All 7 Charts' },
                { id: 'vitals', label: 'Demographics & Vitals' },
                { id: 'lifestyle', label: 'Lifestyle Factors' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-navy-950 shadow-sm'
                    : 'text-slate-600 hover:text-navy-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mandatory Illustrative Sample Label */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
          <p>
            <span className="font-semibold text-navy-950">
              Illustrative Sample Visualization Notice:
            </span>{' '}
            The charts below present illustrative sample cohort distributions structured around the
            70,000-record Kaggle Cardiovascular Disease schema to demonstrate the Exploratory Data
            Analysis (EDA) layout. They are illustrative only and do not represent live computed
            statistics from an active dataset file.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 1. Cardiovascular Disease Distribution */}
          {showVitals && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-navy-950">
                    01. Cardiovascular Disease Distribution
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Target balance: cardio = 0 vs cardio = 1 · Illustrative sample
                  </p>
                </div>
                <BarChart3 className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
              </div>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ILLUSTRATIVE_CARDIO_DISTRIBUTION}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={96}
                      paddingAngle={3}
                    >
                      {ILLUSTRATIVE_CARDIO_DISTRIBUTION.map((entry) => (
                        <Cell key={entry.label} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [
                        `${Number(val ?? 0).toLocaleString()} records (illustrative)`,
                        'Count',
                      ]}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 2. Age Distribution */}
          {showVitals && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div>
                <h3 className="text-base font-semibold text-navy-950">
                  02. Age Distribution by Cardio Outcome
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Converted adult age brackets (years) · Illustrative sample
                </p>
              </div>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={ILLUSTRATIVE_AGE_DISTRIBUTION}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="bracket" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="noCvd"
                      name="No CVD (0)"
                      stroke={TEAL_COLOR}
                      fill={TEAL_COLOR}
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="cvd"
                      name="CVD Recorded (1)"
                      stroke={NAVY_COLOR}
                      fill={NAVY_COLOR}
                      fillOpacity={0.22}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 3. BMI Distribution */}
          {showVitals && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div>
                <h3 className="text-base font-semibold text-navy-950">
                  03. BMI Category Distribution
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Derived BMI = Weight / Height² (kg/m²) · Illustrative sample
                </p>
              </div>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ILLUSTRATIVE_BMI_DISTRIBUTION}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="noCvd" name="No CVD (0)" fill={TEAL_COLOR} radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="cvd"
                      name="CVD Recorded (1)"
                      fill={NAVY_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 4. Blood Pressure Analysis */}
          {showVitals && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div>
                <h3 className="text-base font-semibold text-navy-950">
                  04. Blood Pressure Stage Analysis
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Systolic (ap_hi) / Diastolic (ap_lo) groupings · Illustrative sample
                </p>
              </div>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ILLUSTRATIVE_BP_ANALYSIS}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="noCvd" name="No CVD (0)" fill={TEAL_COLOR} radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="cvd"
                      name="CVD Recorded (1)"
                      fill={NAVY_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 5. Smoking Analysis */}
          {showLifestyle && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div>
                <h3 className="text-base font-semibold text-navy-950">
                  05. Smoking Status Analysis
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Comparison by smoke flag (0 vs 1) · Illustrative sample
                </p>
              </div>
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ILLUSTRATIVE_SMOKING_ANALYSIS}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="noCvd" name="No CVD (0)" fill={TEAL_COLOR} radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="cvd"
                      name="CVD Recorded (1)"
                      fill={NAVY_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 6. Alcohol Consumption Analysis */}
          {showLifestyle && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div>
                <h3 className="text-base font-semibold text-navy-950">
                  06. Alcohol Consumption Analysis
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Comparison by alcohol flag (alco = 0 vs 1) · Illustrative sample
                </p>
              </div>
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ILLUSTRATIVE_ALCOHOL_ANALYSIS}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="noCvd" name="No CVD (0)" fill={TEAL_COLOR} radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="cvd"
                      name="CVD Recorded (1)"
                      fill={NAVY_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 7. Physical Activity Analysis */}
          {showLifestyle && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
              <div>
                <h3 className="text-base font-semibold text-navy-950">
                  07. Physical Activity Analysis
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Comparison by self-reported physical activity (active = 1 vs 0) · Illustrative
                  sample
                </p>
              </div>
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ILLUSTRATIVE_ACTIVITY_ANALYSIS}
                    margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="noCvd" name="No CVD (0)" fill={TEAL_COLOR} radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="cvd"
                      name="CVD Recorded (1)"
                      fill={NAVY_COLOR}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
