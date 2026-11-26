import {
  ModelEvaluationMetrics,
  ModelMetricsState,
  PredictionApiPayload,
  PredictionApiResponse,
} from '../types/cardio';

const API_URL_STORAGE_KEY = 'cardiopredict_python_api_url';
const METRICS_STORAGE_KEY = 'cardiopredict_model_metrics';

export const DEFAULT_UNPOPULATED_MODELS: ModelEvaluationMetrics[] = [
  {
    id: 'logistic_regression',
    name: 'Logistic Regression',
    accuracy: null,
    precision: null,
    recall: null,
    f1Score: null,
    rocAuc: null,
  },
  {
    id: 'decision_tree',
    name: 'Decision Tree',
    accuracy: null,
    precision: null,
    recall: null,
    f1Score: null,
    rocAuc: null,
  },
  {
    id: 'random_forest',
    name: 'Random Forest',
    accuracy: null,
    precision: null,
    recall: null,
    f1Score: null,
    rocAuc: null,
  },
];

export const INITIAL_METRICS_STATE: ModelMetricsState = {
  source: 'unpopulated',
  lastUpdated: null,
  selectedBestModelId: null,
  models: DEFAULT_UNPOPULATED_MODELS,
};

export function getSavedApiUrl(): string {
  const envUrl = import.meta.env.VITE_ML_API_URL as string | undefined;
  try {
    const stored = localStorage.getItem(API_URL_STORAGE_KEY);
    if (stored !== null) return stored;
  } catch {
    // Ignore storage access failures in restricted environments
  }
  return envUrl ? envUrl.trim() : '';
}

export function saveApiUrl(url: string): void {
  try {
    localStorage.setItem(API_URL_STORAGE_KEY, url.trim());
  } catch {
    // Ignore storage access failures
  }
}

export function getSavedMetricsState(): ModelMetricsState {
  try {
    const raw = localStorage.getItem(METRICS_STORAGE_KEY);
    if (!raw) return INITIAL_METRICS_STATE;
    const parsed = JSON.parse(raw) as ModelMetricsState;
    if (!parsed || !Array.isArray(parsed.models) || parsed.models.length !== 3) {
      return INITIAL_METRICS_STATE;
    }
    return parsed;
  } catch {
    return INITIAL_METRICS_STATE;
  }
}

export function saveMetricsState(state: ModelMetricsState): void {
  try {
    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage access failures
  }
}

export function clearMetricsState(): ModelMetricsState {
  try {
    localStorage.removeItem(METRICS_STORAGE_KEY);
  } catch {
    // Ignore storage access failures
  }
  return INITIAL_METRICS_STATE;
}

function normalizeEndpoint(baseUrl: string, path: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return `${trimmed}${path}`;
}

export async function testPythonApiConnection(baseUrl: string): Promise<{
  ok: boolean;
  message: string;
}> {
  const endpoint = normalizeEndpoint(baseUrl, '/health');
  if (!endpoint) {
    return {
      ok: false,
      message: 'No Python ML API URL configured. Running in Demo Mode.',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 4500);
    const response = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        ok: false,
        message: `Python API responded with HTTP ${response.status}.`,
      };
    }

    return {
      ok: true,
      message: 'Connected to Python ML API health endpoint.',
    };
  } catch (error) {
    const detail =
      error instanceof Error && error.name === 'AbortError'
        ? 'Request timed out after 4.5s.'
        : 'Could not reach the configured Python API URL (verify server & CORS).';
    return { ok: false, message: detail };
  }
}

export async function requestPredictionFromPythonApi(
  baseUrl: string,
  payload: PredictionApiPayload
): Promise<{
  ok: boolean;
  data?: PredictionApiResponse;
  error?: string;
}> {
  const endpoint = normalizeEndpoint(baseUrl, '/predict');
  if (!endpoint) {
    return {
      ok: false,
      error: 'No Python ML API URL is configured. Prediction rendered in Demo Mode.',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        ok: false,
        error: `Python ML API returned HTTP ${response.status}. Falling back to Demo Mode.`,
      };
    }

    const json = (await response.json()) as Partial<PredictionApiResponse>;
    if (
      (json.predicted_class !== 0 && json.predicted_class !== 1) ||
      typeof json.probability_class_1 !== 'number'
    ) {
      return {
        ok: false,
        error:
          'Python API response did not match expected schema ({ predicted_class: 0|1, probability_class_1: number }).',
      };
    }

    return {
      ok: true,
      data: {
        predicted_class: json.predicted_class,
        probability_class_1: Math.max(0, Math.min(1, json.probability_class_1)),
        model_name: json.model_name,
        api_version: json.api_version,
      },
    };
  } catch (error) {
    const detail =
      error instanceof Error && error.name === 'AbortError'
        ? 'Python API connection timed out.'
        : 'Python ML API unreachable. Running in Demo Mode.';
    return {
      ok: false,
      error: detail,
    };
  }
}

export async function fetchMetricsFromPythonApi(baseUrl: string): Promise<{
  ok: boolean;
  models?: ModelEvaluationMetrics[];
  selectedBestModelId?: ModelEvaluationMetrics['id'] | null;
  error?: string;
}> {
  const endpoint = normalizeEndpoint(baseUrl, '/metrics');
  if (!endpoint) {
    return {
      ok: false,
      error: 'Enter a Python API base URL before fetching model metrics.',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 5000);
    const response = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        ok: false,
        error: `Python /metrics endpoint returned HTTP ${response.status}.`,
      };
    }

    const json = (await response.json()) as {
      best_model_id?: ModelEvaluationMetrics['id'];
      models?: Array<Partial<ModelEvaluationMetrics>>;
    };

    if (!Array.isArray(json.models)) {
      return {
        ok: false,
        error: 'Invalid /metrics JSON format: expected a "models" array.',
      };
    }

    const parsed = parseEvaluationJsonPayload(json);
    if (!parsed) {
      return {
        ok: false,
        error: 'Could not map model IDs from /metrics JSON response.',
      };
    }

    return {
      ok: true,
      models: parsed.models,
      selectedBestModelId: parsed.selectedBestModelId,
    };
  } catch {
    return {
      ok: false,
      error: 'Unable to reach /metrics endpoint on Python API.',
    };
  }
}

export function parseEvaluationJsonPayload(rawJson: unknown): {
  models: ModelEvaluationMetrics[];
  selectedBestModelId: ModelEvaluationMetrics['id'] | null;
} | null {
  if (!rawJson || typeof rawJson !== 'object') return null;

  const obj = rawJson as {
    best_model_id?: string;
    models?: Array<Record<string, unknown>>;
  };

  if (!Array.isArray(obj.models)) return null;

  const sanitizeScore = (val: unknown): number | null => {
    if (typeof val !== 'number' || !Number.isFinite(val)) return null;
    if (val < 0 || val > 100) return null;
    // Normalize 0–100 percentage inputs to 0–1 decimal if > 1
    return val > 1 ? Number((val / 100).toFixed(4)) : Number(val.toFixed(4));
  };

  const mapped: ModelEvaluationMetrics[] = DEFAULT_UNPOPULATED_MODELS.map((template) => {
    const match = obj.models?.find(
      (item) =>
        item.id === template.id ||
        String(item.name || '').toLowerCase() === template.name.toLowerCase()
    );
    if (!match) return template;

    return {
      id: template.id,
      name: template.name,
      accuracy: sanitizeScore(match.accuracy),
      precision: sanitizeScore(match.precision),
      recall: sanitizeScore(match.recall),
      f1Score: sanitizeScore(match.f1Score ?? match.f1_score),
      rocAuc: sanitizeScore(match.rocAuc ?? match.roc_auc),
    };
  });

  const validBest =
    obj.best_model_id === 'logistic_regression' ||
    obj.best_model_id === 'decision_tree' ||
    obj.best_model_id === 'random_forest'
      ? obj.best_model_id
      : null;

  return {
    models: mapped,
    selectedBestModelId: validBest,
  };
}

export const PYTHON_FASTAPI_CONTRACT = `# FastAPI integration template for your trained scikit-learn model
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="CardioPredict ML Inference API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your best serialized model (e.g., Random Forest / Logistic Regression)
model = joblib.load("best_cardio_model.joblib")

class PatientIndicators(BaseModel):
    age_years: float
    gender: int        # 1 = Female, 2 = Male
    height_cm: float
    weight_kg: float
    bmi: float
    ap_hi: float
    ap_lo: float
    cholesterol: int   # 1, 2, 3
    gluc: int          # 1, 2, 3
    smoke: int         # 0 or 1
    alco: int          # 0 or 1
    active: int        # 0 or 1

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(data: PatientIndicators):
    features = np.array([[
        data.age_years, data.gender, data.height_cm, data.weight_kg,
        data.bmi, data.ap_hi, data.ap_lo, data.cholesterol,
        data.gluc, data.smoke, data.alco, data.active
    ]])
    pred = int(model.predict(features)[0])
    prob = float(model.predict_proba(features)[0][1])
    return {
        "predicted_class": pred,
        "probability_class_1": prob,
        "model_name": type(model).__name__
    }

@app.get("/metrics")
def metrics():
    # Return your actual evaluation metrics computed on the held-out test split
    return {
        "best_model_id": "random_forest",
        "models": [
            {"id": "logistic_regression", "accuracy": 0.0, "precision": 0.0, "recall": 0.0, "f1_score": 0.0, "roc_auc": 0.0},
            {"id": "decision_tree", "accuracy": 0.0, "precision": 0.0, "recall": 0.0, "f1_score": 0.0, "roc_auc": 0.0},
            {"id": "random_forest", "accuracy": 0.0, "precision": 0.0, "recall": 0.0, "f1_score": 0.0, "roc_auc": 0.0}
        ]
    }`;
