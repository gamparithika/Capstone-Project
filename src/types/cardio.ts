export type GenderOption = '' | 'female' | 'male';
export type OrdinalLevel = '' | '1' | '2' | '3';
export type BinaryChoice = '' | 'yes' | 'no';
export type ActivityChoice = '' | 'active' | 'inactive';

export interface AssessmentFormData {
  age: string;
  gender: GenderOption;
  height: string;
  weight: string;
  systolicBp: string;
  diastolicBp: string;
  cholesterol: OrdinalLevel;
  glucose: OrdinalLevel;
  smoke: BinaryChoice;
  alcohol: BinaryChoice;
  active: ActivityChoice;
}

export type FormFieldName = keyof AssessmentFormData;

export type AssessmentFormErrors = Partial<Record<FormFieldName, string>>;

export interface ClinicalReferenceSummary {
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal Weight' | 'Overweight' | 'Obesity';
  bpCategory: string;
  cholesterolLabel: string;
  glucoseLabel: string;
  lifestyleSummary: string[];
}

export interface PredictionApiPayload {
  age_years: number;
  gender: number; // 1 = Female, 2 = Male (Kaggle Cardio Dataset convention)
  height_cm: number;
  weight_kg: number;
  bmi: number;
  ap_hi: number;
  ap_lo: number;
  cholesterol: number; // 1, 2, 3
  gluc: number; // 1, 2, 3
  smoke: number; // 0 or 1
  alco: number; // 0 or 1
  active: number; // 0 or 1
}

export interface PredictionApiResponse {
  predicted_class: 0 | 1;
  probability_class_1: number; // 0.0 to 1.0
  model_name?: string;
  api_version?: string;
}

export interface AssessmentSubmissionResult {
  mode: 'live_api' | 'demo_mode';
  submittedAt: string;
  inputs: AssessmentFormData;
  payload: PredictionApiPayload;
  clinicalSummary: ClinicalReferenceSummary;
  apiResponse?: PredictionApiResponse;
  apiErrorMessage?: string;
}

export interface ModelEvaluationMetrics {
  id: 'logistic_regression' | 'decision_tree' | 'random_forest';
  name: string;
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
  rocAuc: number | null;
}

export interface ModelMetricsState {
  source: 'unpopulated' | 'python_api' | 'imported_json' | 'manual_entry';
  lastUpdated: string | null;
  selectedBestModelId: ModelEvaluationMetrics['id'] | null;
  models: ModelEvaluationMetrics[];
}
