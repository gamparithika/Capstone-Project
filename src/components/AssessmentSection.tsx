import { useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Copy,
  Database,
  HeartPulse,
  Link2,
  RotateCcw,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AssessmentFormData,
  AssessmentFormErrors,
  AssessmentSubmissionResult,
} from '../types/cardio';
import {
  buildClinicalReferenceSummary,
  buildPredictionPayload,
  calculateBmi,
  getBmiCategory,
  INITIAL_FORM_DATA,
  SAMPLE_TEST_PROFILE,
  validateAssessmentForm,
} from '../utils/clinicalCalculations';
import {
  PYTHON_FASTAPI_CONTRACT,
  requestPredictionFromPythonApi,
  saveApiUrl,
  testPythonApiConnection,
} from '../services/predictionApi';

interface AssessmentSectionProps {
  apiUrl: string;
  onApiUrlChange: (url: string) => void;
}

export default function AssessmentSection({
  apiUrl,
  onApiUrlChange,
}: AssessmentSectionProps) {
  const [formData, setFormData] = useState<AssessmentFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<AssessmentFormErrors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentSubmissionResult | null>(null);

  // Python API configuration panel state
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [draftApiUrl, setDraftApiUrl] = useState(apiUrl);
  const [apiTestStatus, setApiTestStatus] = useState<{
    state: 'idle' | 'testing' | 'ok' | 'error';
    message: string;
  }>({ state: 'idle', message: '' });
  const [copiedCode, setCopiedCode] = useState(false);

  const liveBmi = useMemo(
    () => calculateBmi(formData.height, formData.weight),
    [formData.height, formData.weight]
  );

  const liveBmiCategory = useMemo(
    () => (liveBmi !== null ? getBmiCategory(liveBmi) : null),
    [liveBmi]
  );

  const updateField = <K extends keyof AssessmentFormData>(
    field: K,
    value: AssessmentFormData[K]
  ) => {
    const nextData = { ...formData, [field]: value };
    setFormData(nextData);
    if (submittedOnce) {
      setErrors(validateAssessmentForm(nextData));
    } else if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleClearForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmittedOnce(false);
    setResult(null);
  };

  const handleLoadSample = () => {
    setFormData(SAMPLE_TEST_PROFILE);
    setErrors({});
    setSubmittedOnce(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOnce(true);

    const validationErrors = validateAssessmentForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    const payload = buildPredictionPayload(formData);
    const clinicalSummary = buildClinicalReferenceSummary(formData);
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const apiOutcome = await requestPredictionFromPythonApi(apiUrl, payload);

    if (apiOutcome.ok && apiOutcome.data) {
      setResult({
        mode: 'live_api',
        submittedAt: timestamp,
        inputs: { ...formData },
        payload,
        clinicalSummary,
        apiResponse: apiOutcome.data,
      });
    } else {
      setResult({
        mode: 'demo_mode',
        submittedAt: timestamp,
        inputs: { ...formData },
        payload,
        clinicalSummary,
        apiErrorMessage: apiOutcome.error,
      });
    }

    setIsSubmitting(false);
  };

  const handleSaveAndTestApi = async () => {
    const clean = draftApiUrl.trim();
    saveApiUrl(clean);
    onApiUrlChange(clean);

    if (!clean) {
      setApiTestStatus({
        state: 'idle',
        message: 'API URL cleared. Application will operate in Demo Mode.',
      });
      return;
    }

    setApiTestStatus({ state: 'testing', message: 'Checking Python API /health...' });
    const check = await testPythonApiConnection(clean);
    setApiTestStatus({
      state: check.ok ? 'ok' : 'error',
      message: check.message,
    });
  };

  const handleCopyContract = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_FASTAPI_CONTRACT);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Clipboard blocked in restricted browser contexts
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <section id="prediction" className="border-b border-slate-200 bg-slate-50/60 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header + Python API Connection Toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Cardiovascular Risk Screening & Inference
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Health Assessment Form
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Enter all 11 personal, clinical, and lifestyle indicators. Body Mass Index (BMI) is
              computed automatically and validated prior to sending inputs to your Python ML
              prediction endpoint.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <span className="text-xs font-medium text-slate-600">
              Mode:{' '}
              <span className="font-semibold text-navy-950">
                {apiUrl ? 'Python API Configured' : 'Demo Mode (No API Connected)'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setShowApiPanel((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-navy-950 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Link2 className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <span>{showApiPanel ? 'Hide API Settings' : 'Connect Python ML API'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Python ML API Connection & FastAPI Contract Drawer */}
        {showApiPanel && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h3 className="flex items-center gap-2 text-base font-semibold text-navy-950">
                  <Database className="h-4 w-4 text-teal-700" aria-hidden="true" />
                  <span>Python Machine Learning API Configuration</span>
                </h3>
                <p className="mt-1.5 text-sm text-slate-600">
                  Provide the base URL of your running Python FastAPI or Flask inference server
                  (for example{' '}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-navy-900">
                    http://localhost:8000
                  </code>
                  ). When left blank or unreachable, CardioPredict AI stays in clearly labelled
                  Demo Mode and never fabricates predictions.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label htmlFor="python-api-url" className="sr-only">
                    Python ML API Base URL
                  </label>
                  <input
                    id="python-api-url"
                    type="url"
                    value={draftApiUrl}
                    onChange={(e) => setDraftApiUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-mono text-sm text-navy-950 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none sm:max-w-md"
                  />
                  <button
                    type="button"
                    onClick={handleSaveAndTestApi}
                    className="inline-flex items-center justify-center rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Save & Test Connection
                  </button>
                </div>

                {apiTestStatus.message && (
                  <p
                    className={`mt-2.5 flex items-center gap-1.5 text-xs font-medium ${
                      apiTestStatus.state === 'ok'
                        ? 'text-teal-800'
                        : apiTestStatus.state === 'error'
                          ? 'text-rose-700'
                          : 'text-slate-600'
                    }`}
                  >
                    {apiTestStatus.state === 'ok' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>{apiTestStatus.message}</span>
                  </p>
                )}
              </div>

              <div className="lg:w-[480px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-navy-950">
                    <Code2 className="h-4 w-4 text-teal-700" aria-hidden="true" />
                    <span>Expected Python FastAPI Contract</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyContract}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="mt-2 max-h-52 overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-slate-200">
                  {PYTHON_FASTAPI_CONTRACT}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Main Split: Form (Left 7 cols) + Prediction Results (Right 5 cols) */}
        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT: Assessment Input Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-navy-950">
                  Patient Indicators Input
                </h3>
                <p className="text-xs text-slate-500">
                  All fields are mandatory · Units follow clinical Kaggle schema
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-navy-900 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                <span>Fill Sample Inputs</span>
              </button>
            </div>

            {submittedOnce && errorCount > 0 && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-hidden="true" />
                <p>
                  Please fix {errorCount} validation {errorCount === 1 ? 'issue' : 'issues'}{' '}
                  highlighted below before submitting.
                </p>
              </div>
            )}

            {/* Group 1: Personal Information */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-navy-950">
                1. Personal Information
              </h4>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-xs font-medium text-slate-700">
                    Age (years)
                  </label>
                  <input
                    id="age"
                    type="number"
                    min={18}
                    max={110}
                    step="1"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                    placeholder="e.g. 52"
                    aria-invalid={Boolean(errors.age)}
                    className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 font-mono text-sm text-navy-950 tabular-nums focus:outline-none ${
                      errors.age
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-teal-700'
                    }`}
                  />
                  {errors.age && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.age}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-xs font-medium text-slate-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      updateField('gender', e.target.value as AssessmentFormData['gender'])
                    }
                    aria-invalid={Boolean(errors.gender)}
                    className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none ${
                      errors.gender
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-teal-700'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.gender}</p>
                  )}
                </div>

                {/* Height */}
                <div>
                  <label htmlFor="height" className="block text-xs font-medium text-slate-700">
                    Height (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    min={100}
                    max={250}
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => updateField('height', e.target.value)}
                    placeholder="e.g. 172"
                    aria-invalid={Boolean(errors.height)}
                    className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 font-mono text-sm text-navy-950 tabular-nums focus:outline-none ${
                      errors.height
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-teal-700'
                    }`}
                  />
                  {errors.height && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.height}</p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label htmlFor="weight" className="block text-xs font-medium text-slate-700">
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    min={25}
                    max={300}
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                    placeholder="e.g. 76"
                    aria-invalid={Boolean(errors.weight)}
                    className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 font-mono text-sm text-navy-950 tabular-nums focus:outline-none ${
                      errors.weight
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-teal-700'
                    }`}
                  />
                  {errors.weight && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.weight}</p>
                  )}
                </div>
              </div>

              {/* Automatic Live BMI Readout */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-navy-950">
                    Automatically Calculated Body Mass Index (BMI)
                  </p>
                  <p className="text-xs text-slate-500">
                    Formula: Weight (kg) / (Height (m) × Height (m))
                  </p>
                </div>
                <div className="text-right">
                  {liveBmi !== null ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold text-navy-950 tabular-nums">
                        {liveBmi.toFixed(1)}
                      </span>
                      <span className="font-mono text-xs text-slate-500">kg/m²</span>
                      <span className="text-xs font-semibold text-teal-800">
                        · {liveBmiCategory}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-sm text-slate-400 tabular-nums">
                      Enter height & weight
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Group 2: Health Indicators */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h4 className="text-sm font-semibold text-navy-950">
                2. Clinical Health Indicators
              </h4>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Systolic BP */}
                <div>
                  <label htmlFor="systolicBp" className="block text-xs font-medium text-slate-700">
                    Systolic Blood Pressure (mmHg)
                  </label>
                  <input
                    id="systolicBp"
                    type="number"
                    min={60}
                    max={260}
                    step="1"
                    value={formData.systolicBp}
                    onChange={(e) => updateField('systolicBp', e.target.value)}
                    placeholder="e.g. 120"
                    aria-invalid={Boolean(errors.systolicBp)}
                    className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 font-mono text-sm text-navy-950 tabular-nums focus:outline-none ${
                      errors.systolicBp
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-teal-700'
                    }`}
                  />
                  {errors.systolicBp && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.systolicBp}</p>
                  )}
                </div>

                {/* Diastolic BP */}
                <div>
                  <label htmlFor="diastolicBp" className="block text-xs font-medium text-slate-700">
                    Diastolic Blood Pressure (mmHg)
                  </label>
                  <input
                    id="diastolicBp"
                    type="number"
                    min={35}
                    max={180}
                    step="1"
                    value={formData.diastolicBp}
                    onChange={(e) => updateField('diastolicBp', e.target.value)}
                    placeholder="e.g. 80"
                    aria-invalid={Boolean(errors.diastolicBp)}
                    className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 font-mono text-sm text-navy-950 tabular-nums focus:outline-none ${
                      errors.diastolicBp
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-teal-700'
                    }`}
                  />
                  {errors.diastolicBp && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.diastolicBp}</p>
                  )}
                </div>

                {/* Cholesterol */}
                <div>
                  <label htmlFor="cholesterol" className="block text-xs font-medium text-slate-700">
                    Cholesterol Level
                  </label>
                  <select
                    id="cholesterol"
                    value={formData.cholesterol}
                    onChange={(e) =>
                      updateField('cholesterol', e.target.value as AssessmentFormData['cholesterol'])
                    }
                    aria-invalid={Boolean(errors.cholesterol)}
                    className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none ${
                      errors.cholesterol
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-teal-700'
                    }`}
                  >
                    <option value="">Select cholesterol level</option>
                    <option value="1">1 — Normal</option>
                    <option value="2">2 — Above Normal</option>
                    <option value="3">3 — Well Above Normal</option>
                  </select>
                  {errors.cholesterol && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.cholesterol}</p>
                  )}
                </div>

                {/* Glucose */}
                <div>
                  <label htmlFor="glucose" className="block text-xs font-medium text-slate-700">
                    Glucose Level
                  </label>
                  <select
                    id="glucose"
                    value={formData.glucose}
                    onChange={(e) =>
                      updateField('glucose', e.target.value as AssessmentFormData['glucose'])
                    }
                    aria-invalid={Boolean(errors.glucose)}
                    className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none ${
                      errors.glucose
                        ? 'border-rose-400 bg-rose-50/40 focus:border-rose-600'
                        : 'border-slate-300 bg-white focus:border-teal-700'
                    }`}
                  >
                    <option value="">Select glucose level</option>
                    <option value="1">1 — Normal</option>
                    <option value="2">2 — Above Normal</option>
                    <option value="3">3 — Well Above Normal</option>
                  </select>
                  {errors.glucose && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.glucose}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Group 3: Lifestyle Indicators */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h4 className="text-sm font-semibold text-navy-950">
                3. Lifestyle Indicators
              </h4>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Smoking Status */}
                <div>
                  <span className="block text-xs font-medium text-slate-700">
                    Smoking Status
                  </span>
                  <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                    {(['no', 'yes'] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateField('smoke', val)}
                        className={`rounded-md py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          formData.smoke === val
                            ? 'bg-white text-navy-950 shadow-sm'
                            : 'text-slate-600 hover:text-navy-950'
                        }`}
                      >
                        {val === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                  {errors.smoke && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.smoke}</p>
                  )}
                </div>

                {/* Alcohol Consumption */}
                <div>
                  <span className="block text-xs font-medium text-slate-700">
                    Alcohol Consumption
                  </span>
                  <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                    {(['no', 'yes'] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateField('alcohol', val)}
                        className={`rounded-md py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          formData.alcohol === val
                            ? 'bg-white text-navy-950 shadow-sm'
                            : 'text-slate-600 hover:text-navy-950'
                        }`}
                      >
                        {val === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                  {errors.alcohol && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.alcohol}</p>
                  )}
                </div>

                {/* Physical Activity */}
                <div>
                  <span className="block text-xs font-medium text-slate-700">
                    Physical Activity
                  </span>
                  <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
                    {(['active', 'inactive'] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateField('active', val)}
                        className={`rounded-md py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          formData.active === val
                            ? 'bg-white text-navy-950 shadow-sm'
                            : 'text-slate-600 hover:text-navy-950'
                        }`}
                      >
                        {val === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    ))}
                  </div>
                  {errors.active && (
                    <p className="mt-1 text-xs font-medium text-rose-700">{errors.active}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={handleClearForm}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>Clear Form</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Assessment'}</span>
              </button>
            </div>
          </form>

          {/* RIGHT: Prediction Results Panel */}
          <div className="lg:col-span-5">
            {!result ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-navy-900">
                  <HeartPulse className="h-6 w-6 text-teal-700" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-navy-950">
                  Prediction Results Workspace
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Complete the health assessment form and click{' '}
                  <span className="font-semibold text-navy-950">Submit Assessment</span> to view:
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-xs font-semibold text-teal-800">01.</span>
                    <span>
                      Predicted class (<code className="font-mono text-xs">cardio = 0</code> or{' '}
                      <code className="font-mono text-xs">1</code>) from your connected Python ML
                      API
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-xs font-semibold text-teal-800">02.</span>
                    <span>Model-estimated Class 1 probability and risk category gauge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-xs font-semibold text-teal-800">03.</span>
                    <span>Calculated BMI and WHO anthropometric categorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono text-xs font-semibold text-teal-800">04.</span>
                    <span>Structured input and clinical indicator reference summary</span>
                  </li>
                </ul>

                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-950">
                  <p className="font-semibold">
                    {apiUrl ? 'Python ML API Configured' : 'DEMO MODE Active'}
                  </p>
                  <p className="mt-1">
                    {apiUrl
                      ? `Requests will be sent to ${apiUrl}/predict. If unreachable, results fall back cleanly to Demo Mode.`
                      : 'No trained Python model API is currently connected. Submitting in Demo Mode validates inputs, calculates BMI, and displays clinical reference ranges without fabricating ML predictions.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Mode Notice Banner: LIVE API vs DEMO MODE */}
                {result.mode === 'demo_mode' ? (
                  <div
                    role="status"
                    className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-bold tracking-tight">
                          DEMO MODE — No Trained Python Model API Connected
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-amber-900">
                          {result.apiErrorMessage ||
                            'No live Python ML inference endpoint is connected.'}{' '}
                          To uphold scientific accuracy, CardioPredict AI does{' '}
                          <span className="font-semibold">not</span> invent or simulate ML class
                          predictions or accuracy probabilities. Connect your Python FastAPI/Flask
                          model above to receive real model output.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    role="status"
                    className="rounded-xl border border-teal-200 bg-teal-50 p-5 text-teal-950"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-teal-700"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-bold tracking-tight">
                          Live Python ML Inference Result
                        </p>
                        <p className="mt-1 text-xs text-teal-900">
                          Model:{' '}
                          <span className="font-semibold">
                            {result.apiResponse?.model_name || 'Connected Python Classifier'}
                          </span>{' '}
                          · Evaluated at {result.submittedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Core Prediction Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <h3 className="text-base font-semibold text-navy-950">Prediction Results</h3>
                    <span className="font-mono text-xs text-slate-500">
                      Target: cardio (0 / 1)
                    </span>
                  </div>

                  {/* Predicted Class & Class 1 Probability */}
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs font-medium text-slate-500">Predicted Class</p>
                      {result.mode === 'live_api' && result.apiResponse ? (
                        <>
                          <p className="mt-1 font-mono text-2xl font-bold text-navy-950 tabular-nums">
                            Class {result.apiResponse.predicted_class}
                          </p>
                          <p
                            className={`mt-1 text-xs font-semibold ${
                              result.apiResponse.predicted_class === 1
                                ? 'text-rose-700'
                                : 'text-teal-800'
                            }`}
                          >
                            {result.apiResponse.predicted_class === 1
                              ? 'Cardiovascular disease recorded'
                              : 'Cardiovascular disease not recorded'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-1 font-mono text-lg font-bold text-slate-700">
                            Not Computed
                          </p>
                          <p className="mt-1 text-xs font-medium text-amber-800">
                            DEMO MODE · Requires Python API
                          </p>
                        </>
                      )}
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Class 1 Probability
                      </p>
                      {result.mode === 'live_api' && result.apiResponse ? (
                        <>
                          <p className="mt-1 font-mono text-2xl font-bold text-navy-950 tabular-nums">
                            {(result.apiResponse.probability_class_1 * 100).toFixed(1)}%
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            Model-estimated likelihood for cardio = 1
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="mt-1 font-mono text-lg font-bold text-slate-700 tabular-nums">
                            — %
                          </p>
                          <p className="mt-1 text-xs font-medium text-amber-800">
                            No simulated probability shown
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Risk Category Visualization */}
                  <div className="mt-5 border-t border-slate-200 pt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-navy-950">
                        Risk Category Visualization
                      </span>
                      <span className="font-mono text-slate-500">
                        {result.mode === 'live_api' && result.apiResponse
                          ? result.apiResponse.probability_class_1 >= 0.65
                            ? 'High Probability Band (≥65%)'
                            : result.apiResponse.probability_class_1 >= 0.35
                              ? 'Moderate Probability Band (35%–64%)'
                              : 'Lower Probability Band (<35%)'
                          : 'Awaiting Live Model Probability (Demo Mode)'}
                      </span>
                    </div>

                    <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                      {result.mode === 'live_api' && result.apiResponse ? (
                        <div
                          className={`h-full transition-all duration-300 ${
                            result.apiResponse.probability_class_1 >= 0.65
                              ? 'bg-rose-600'
                              : result.apiResponse.probability_class_1 >= 0.35
                                ? 'bg-amber-500'
                                : 'bg-teal-600'
                          }`}
                          style={{
                            width: `${Math.max(
                              4,
                              Math.round(result.apiResponse.probability_class_1 * 100)
                            )}%`,
                          }}
                        />
                      ) : (
                        <div className="h-full w-0 bg-slate-300" />
                      )}
                    </div>
                    <div className="mt-1.5 flex justify-between font-mono text-[11px] text-slate-400 tabular-nums">
                      <span>0% (Low)</span>
                      <span>50% (Threshold)</span>
                      <span>100% (High)</span>
                    </div>
                  </div>

                  {/* BMI Summary Row */}
                  <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Calculated BMI</p>
                      <p className="text-sm font-semibold text-navy-950">
                        {result.clinicalSummary.bmiCategory}
                      </p>
                    </div>
                    <p className="font-mono text-2xl font-bold text-teal-800 tabular-nums">
                      {result.clinicalSummary.bmi.toFixed(1)}{' '}
                      <span className="text-xs font-normal text-slate-500">kg/m²</span>
                    </p>
                  </div>
                </div>

                {/* Health Indicator & Input Summary Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-navy-950">
                      <Activity className="h-4 w-4 text-teal-700" aria-hidden="true" />
                      <span>Input & Health Indicator Summary</span>
                    </h4>
                    <span className="text-[11px] font-medium text-slate-500">
                      Clinical Reference (Non-ML)
                    </span>
                  </div>

                  <dl className="mt-4 divide-y divide-slate-100 text-xs sm:text-sm">
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-600">Age & Gender</dt>
                      <dd className="font-mono font-medium text-navy-950 tabular-nums">
                        {result.inputs.age} yrs ·{' '}
                        {result.inputs.gender === 'male' ? 'Male' : 'Female'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-600">Height / Weight</dt>
                      <dd className="font-mono font-medium text-navy-950 tabular-nums">
                        {result.inputs.height} cm / {result.inputs.weight} kg
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-600">Blood Pressure</dt>
                      <dd className="text-right">
                        <span className="font-mono font-medium text-navy-950 tabular-nums">
                          {result.inputs.systolicBp}/{result.inputs.diastolicBp} mmHg
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          {result.clinicalSummary.bpCategory}
                        </span>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-600">Cholesterol / Glucose</dt>
                      <dd className="font-medium text-navy-950">
                        {result.clinicalSummary.cholesterolLabel} /{' '}
                        {result.clinicalSummary.glucoseLabel}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-slate-600">Lifestyle Profile</dt>
                      <dd className="text-right font-medium text-navy-950">
                        {result.clinicalSummary.lifestyleSummary.join(' · ')}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
