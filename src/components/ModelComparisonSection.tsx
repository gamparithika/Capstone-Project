import { useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Download,
  Edit3,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  clearMetricsState,
  fetchMetricsFromPythonApi,
  parseEvaluationJsonPayload,
  saveMetricsState,
} from '../services/predictionApi';
import { ModelEvaluationMetrics, ModelMetricsState } from '../types/cardio';

interface ModelComparisonSectionProps {
  apiUrl: string;
  metricsState: ModelMetricsState;
  onMetricsChange: (next: ModelMetricsState) => void;
}

const SAMPLE_METRICS_JSON_SCHEMA = {
  best_model_id: 'random_forest',
  models: [
    {
      id: 'logistic_regression',
      accuracy: 0.72,
      precision: 0.74,
      recall: 0.68,
      f1_score: 0.71,
      roc_auc: 0.78,
    },
    {
      id: 'decision_tree',
      accuracy: 0.63,
      precision: 0.63,
      recall: 0.62,
      f1_score: 0.63,
      roc_auc: 0.63,
    },
    {
      id: 'random_forest',
      accuracy: 0.73,
      precision: 0.75,
      recall: 0.7,
      f1_score: 0.72,
      roc_auc: 0.8,
    },
  ],
};

function formatMetric(value: number | null): string {
  if (value === null) return '—';
  return `${(value * 100).toFixed(2)}%`;
}

export default function ModelComparisonSection({
  apiUrl,
  metricsState,
  onMetricsChange,
}: ModelComparisonSectionProps) {
  const [statusMessage, setStatusMessage] = useState<{
    type: 'idle' | 'success' | 'error';
    text: string;
  }>({ type: 'idle', text: '' });
  const [isFetching, setIsFetching] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [draftModels, setDraftModels] = useState<ModelEvaluationMetrics[]>(metricsState.models);
  const [draftBestId, setDraftBestId] = useState<ModelEvaluationMetrics['id'] | ''>(
    metricsState.selectedBestModelId ?? ''
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasPopulatedScores = useMemo(
    () =>
      metricsState.models.some(
        (m) =>
          m.accuracy !== null ||
          m.precision !== null ||
          m.recall !== null ||
          m.f1Score !== null ||
          m.rocAuc !== null
      ),
    [metricsState.models]
  );

  // Determine best model strictly from populated evaluation metrics if user did not specify one
  const resolvedBestModelId = useMemo(() => {
    if (!hasPopulatedScores) return null;
    if (metricsState.selectedBestModelId) return metricsState.selectedBestModelId;

    let bestId: ModelEvaluationMetrics['id'] | null = null;
    let bestScore = -1;
    for (const model of metricsState.models) {
      const score = model.rocAuc ?? model.f1Score ?? model.accuracy ?? -1;
      if (score > bestScore) {
        bestScore = score;
        bestId = model.id;
      }
    }
    return bestId;
  }, [hasPopulatedScores, metricsState]);

  const chartData = useMemo(() => {
    if (!hasPopulatedScores) return [];
    return metricsState.models.map((m) => ({
      name: m.name,
      Accuracy: m.accuracy !== null ? Number((m.accuracy * 100).toFixed(2)) : 0,
      Precision: m.precision !== null ? Number((m.precision * 100).toFixed(2)) : 0,
      Recall: m.recall !== null ? Number((m.recall * 100).toFixed(2)) : 0,
      'F1 Score': m.f1Score !== null ? Number((m.f1Score * 100).toFixed(2)) : 0,
      'ROC-AUC': m.rocAuc !== null ? Number((m.rocAuc * 100).toFixed(2)) : 0,
    }));
  }, [hasPopulatedScores, metricsState.models]);

  const handleFetchFromApi = async () => {
    setIsFetching(true);
    setStatusMessage({ type: 'idle', text: '' });

    const res = await fetchMetricsFromPythonApi(apiUrl);
    if (res.ok && res.models) {
      const next: ModelMetricsState = {
        source: 'python_api',
        lastUpdated: new Date().toLocaleString(),
        selectedBestModelId: res.selectedBestModelId ?? null,
        models: res.models,
      };
      saveMetricsState(next);
      onMetricsChange(next);
      setDraftModels(res.models);
      setDraftBestId(res.selectedBestModelId ?? '');
      setStatusMessage({
        type: 'success',
        text: 'Populated model evaluation metrics from your connected Python API (/metrics).',
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.error || 'Failed to fetch metrics from Python API.',
      });
    }
    setIsFetching(false);
  };

  const handleOpenEditor = () => {
    setDraftModels(metricsState.models.map((m) => ({ ...m })));
    setDraftBestId(metricsState.selectedBestModelId ?? '');
    setShowEditor((prev) => !prev);
  };

  const handleDraftFieldChange = (
    modelId: ModelEvaluationMetrics['id'],
    field: 'accuracy' | 'precision' | 'recall' | 'f1Score' | 'rocAuc',
    rawValue: string
  ) => {
    setDraftModels((prev) =>
      prev.map((m) => {
        if (m.id !== modelId) return m;
        if (!rawValue.trim()) {
          return { ...m, [field]: null };
        }
        const parsed = Number(rawValue);
        if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
          return m;
        }
        const normalized = parsed > 1 ? Number((parsed / 100).toFixed(4)) : Number(parsed.toFixed(4));
        return { ...m, [field]: normalized };
      })
    );
  };

  const handleSaveManualMetrics = () => {
    const next: ModelMetricsState = {
      source: 'manual_entry',
      lastUpdated: new Date().toLocaleString(),
      selectedBestModelId: draftBestId || null,
      models: draftModels,
    };
    saveMetricsState(next);
    onMetricsChange(next);
    setShowEditor(false);
    setStatusMessage({
      type: 'success',
      text: 'Saved your actual Python model evaluation metrics.',
    });
  };

  const handleApplyJson = (rawText: string) => {
    try {
      const parsedJson = JSON.parse(rawText);
      const mapped = parseEvaluationJsonPayload(parsedJson);
      if (!mapped) {
        setStatusMessage({
          type: 'error',
          text: 'JSON structure invalid. Ensure it includes a "models" array with model IDs.',
        });
        return;
      }
      const next: ModelMetricsState = {
        source: 'imported_json',
        lastUpdated: new Date().toLocaleString(),
        selectedBestModelId: mapped.selectedBestModelId,
        models: mapped.models,
      };
      saveMetricsState(next);
      onMetricsChange(next);
      setDraftModels(mapped.models);
      setDraftBestId(mapped.selectedBestModelId ?? '');
      setShowEditor(false);
      setJsonInput('');
      setStatusMessage({
        type: 'success',
        text: 'Imported model evaluation scores from JSON.',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Could not parse JSON. Check syntax and try again.',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleApplyJson(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadJsonTemplate = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_METRICS_JSON_SCHEMA, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'python_model_metrics_template.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetMetrics = () => {
    const resetState = clearMetricsState();
    onMetricsChange(resetState);
    setDraftModels(resetState.models);
    setDraftBestId('');
    setStatusMessage({
      type: 'idle',
      text: 'Evaluation table cleared. Awaiting actual Python model evaluation results.',
    });
  };

  return (
    <section
      id="model-comparison"
      className="border-b border-slate-200 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Action Controls */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Empirical Benchmarking Dashboard
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Model Comparison
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Compare Logistic Regression, Decision Tree, and Random Forest across five standard
              evaluation metrics. No scores are invented—populate directly from your Python
              evaluation outputs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleFetchFromApi}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Fetch Python /metrics</span>
            </button>

            <button
              type="button"
              onClick={handleOpenEditor}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-navy-950 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
              <span>{showEditor ? 'Close Score Editor' : 'Enter / Import Python Scores'}</span>
            </button>

            {hasPopulatedScores && (
              <button
                type="button"
                onClick={handleResetMetrics}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear Scores</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage.text && (
          <div
            role="status"
            className={`mt-5 flex items-center gap-2.5 rounded-lg border px-4 py-3 text-xs font-medium sm:text-sm ${
              statusMessage.type === 'success'
                ? 'border-teal-200 bg-teal-50 text-teal-900'
                : statusMessage.type === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-800'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Inline Editor / JSON Import Panel */}
        {showEditor && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-semibold text-navy-950">
                  Populate Actual Python Evaluation Results
                </h3>
                <p className="text-xs text-slate-600">
                  Enter decimal values (e.g., 0.734) or percentages (e.g., 73.4) from your
                  scikit-learn test evaluation, or upload a JSON report.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-950 hover:bg-slate-50 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                  <span>Upload JSON File</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJsonTemplate}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>JSON Schema Template</span>
                </button>
              </div>
            </div>

            {/* Editable Grid */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="py-2 pr-4 font-semibold">Model</th>
                    <th className="px-2 py-2 font-semibold">Accuracy</th>
                    <th className="px-2 py-2 font-semibold">Precision</th>
                    <th className="px-2 py-2 font-semibold">Recall</th>
                    <th className="px-2 py-2 font-semibold">F1 Score</th>
                    <th className="px-2 py-2 font-semibold">ROC-AUC</th>
                    <th className="pl-2 py-2 font-semibold">Best Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {draftModels.map((model) => (
                    <tr key={model.id}>
                      <td className="py-3 pr-4 font-semibold text-navy-950">{model.name}</td>
                      {(['accuracy', 'precision', 'recall', 'f1Score', 'rocAuc'] as const).map(
                        (field) => (
                          <td key={field} className="px-2 py-2">
                            <input
                              type="number"
                              step="0.0001"
                              min="0"
                              max="100"
                              placeholder="0.00"
                              value={model[field] !== null ? String(model[field]) : ''}
                              onChange={(e) =>
                                handleDraftFieldChange(model.id, field, e.target.value)
                              }
                              className="w-24 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs text-navy-950 tabular-nums focus:border-teal-700 focus:outline-none"
                            />
                          </td>
                        )
                      )}
                      <td className="pl-2 py-2">
                        <input
                          type="radio"
                          name="best-model-radio"
                          checked={draftBestId === model.id}
                          onChange={() => setDraftBestId(model.id)}
                          aria-label={`Select ${model.name} as best model`}
                          className="h-4 w-4 accent-teal-700 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-200 pt-5 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <label
                  htmlFor="metrics-json-paste"
                  className="block text-xs font-semibold text-navy-950"
                >
                  Or Paste Evaluation JSON Output
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    id="metrics-json-paste"
                    type="text"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder='{"best_model_id": "random_forest", "models": [...]}'
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-navy-950 focus:border-teal-700 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyJson(jsonInput)}
                    disabled={!jsonInput.trim()}
                    className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-navy-950 hover:bg-slate-100 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Apply JSON
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-end lg:col-span-4">
                <button
                  type="button"
                  onClick={handleSaveManualMetrics}
                  className="rounded-lg bg-teal-700 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Save Evaluation Scores
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/80 px-6 py-4">
            <span className="text-sm font-semibold text-navy-950">
              Classification Evaluation Matrix
            </span>
            <span className="font-mono text-xs text-slate-600">
              {hasPopulatedScores
                ? `Source: ${
                    metricsState.source === 'python_api'
                      ? 'Connected Python /metrics API'
                      : metricsState.source === 'imported_json'
                        ? 'Imported Python JSON'
                        : 'User-Entered Python Evaluation Results'
                  }${metricsState.lastUpdated ? ` · Updated ${metricsState.lastUpdated}` : ''}`
                : 'Status: Awaiting Actual Python Evaluation Results'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3.5 font-semibold">Algorithm</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Accuracy</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Precision</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Recall</th>
                  <th className="px-4 py-3.5 text-right font-semibold">F1 Score</th>
                  <th className="px-6 py-3.5 text-right font-semibold">ROC-AUC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {metricsState.models.map((model) => {
                  const isBest = resolvedBestModelId === model.id;
                  return (
                    <tr
                      key={model.id}
                      className={isBest ? 'bg-teal-50/40' : 'hover:bg-slate-50/70'}
                    >
                      <td className="px-6 py-4 font-semibold text-navy-950">
                        <div className="flex items-center gap-2">
                          <span>{model.name}</span>
                          {isBest && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800">
                              <Award className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Selected Best Model</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-navy-950 tabular-nums">
                        {formatMetric(model.accuracy)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-navy-950 tabular-nums">
                        {formatMetric(model.precision)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-navy-950 tabular-nums">
                        {formatMetric(model.recall)}
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-navy-950 tabular-nums">
                        {formatMetric(model.f1Score)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-semibold text-navy-950 tabular-nums">
                        {formatMetric(model.rocAuc)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison Chart or Honest Empty State */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          {hasPopulatedScores ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-navy-950">
                    Multi-Metric Model Performance Comparison (%)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rendered strictly from populated Python evaluation metrics
                  </p>
                </div>
              </div>
              <div className="mt-5 h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#0f2342' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip formatter={(v) => `${v ?? 0}%`} />
                    <Legend />
                    <Bar dataKey="Accuracy" fill="#0f2342" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Precision" fill="#1e457c" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Recall" fill="#0f766e" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="F1 Score" fill="#14b8a6" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="ROC-AUC" fill="#64748b" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-semibold text-navy-950">
                No Evaluation Scores Populated Yet
              </p>
              <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm">
                To uphold strict academic integrity, CardioPredict AI does not invent model
                accuracies or ROC-AUC scores. Connect your Python{' '}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                  /metrics
                </code>{' '}
                endpoint or click <span className="font-semibold">Enter / Import Python Scores</span>{' '}
                to populate your actual test-set metrics and render the comparison chart.
              </p>
              <button
                type="button"
                onClick={handleOpenEditor}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-navy-950 hover:bg-slate-50 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                <span>Populate Actual Python Results</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
