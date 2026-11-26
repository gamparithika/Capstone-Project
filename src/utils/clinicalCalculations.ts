import {
  AssessmentFormData,
  AssessmentFormErrors,
  ClinicalReferenceSummary,
  PredictionApiPayload,
} from '../types/cardio';

export const INITIAL_FORM_DATA: AssessmentFormData = {
  age: '',
  gender: '',
  height: '',
  weight: '',
  systolicBp: '',
  diastolicBp: '',
  cholesterol: '',
  glucose: '',
  smoke: '',
  alcohol: '',
  active: '',
};

export const SAMPLE_TEST_PROFILE: AssessmentFormData = {
  age: '54',
  gender: 'male',
  height: '174',
  weight: '82',
  systolicBp: '138',
  diastolicBp: '88',
  cholesterol: '2',
  glucose: '1',
  smoke: 'no',
  alcohol: 'no',
  active: 'active',
};

export function calculateBmi(heightCmStr: string, weightKgStr: string): number | null {
  const heightCm = Number(heightCmStr);
  const weightKg = Number(weightKgStr);

  if (
    !heightCmStr.trim() ||
    !weightKgStr.trim() ||
    !Number.isFinite(heightCm) ||
    !Number.isFinite(weightKg) ||
    heightCm <= 0 ||
    weightKg <= 0
  ) {
    return null;
  }

  const heightMeters = heightCm / 100;
  const bmi = weightKg / (heightMeters * heightMeters);
  if (!Number.isFinite(bmi) || bmi <= 0) {
    return null;
  }

  return Math.round(bmi * 10) / 10;
}

export function getBmiCategory(
  bmi: number
): ClinicalReferenceSummary['bmiCategory'] {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
}

export function getBloodPressureCategory(systolic: number, diastolic: number): string {
  if (systolic < 120 && diastolic < 80) return 'Normal Range (<120 / <80 mmHg)';
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return 'Elevated (120–129 / <80 mmHg)';
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return 'Stage 1 Elevated Range (130–139 / 80–89 mmHg)';
  }
  return 'Stage 2 High Range (≥140 / ≥90 mmHg)';
}

export function getOrdinalLabel(value: string): string {
  switch (value) {
    case '1':
      return 'Normal';
    case '2':
      return 'Above Normal';
    case '3':
      return 'Well Above Normal';
    default:
      return 'Unspecified';
  }
}

export function validateAssessmentForm(data: AssessmentFormData): AssessmentFormErrors {
  const errors: AssessmentFormErrors = {};

  // Age
  if (!data.age.trim()) {
    errors.age = 'Please enter age in years.';
  } else {
    const age = Number(data.age);
    if (!Number.isFinite(age)) {
      errors.age = 'Age must be a valid number.';
    } else if (age < 0) {
      errors.age = 'Age cannot be negative.';
    } else if (age < 18 || age > 110) {
      errors.age = 'Enter a realistic adult age between 18 and 110 years.';
    }
  }

  // Gender
  if (!data.gender) {
    errors.gender = 'Please select gender.';
  }

  // Height
  if (!data.height.trim()) {
    errors.height = 'Please enter height in centimeters.';
  } else {
    const height = Number(data.height);
    if (!Number.isFinite(height)) {
      errors.height = 'Height must be a valid number.';
    } else if (height <= 0) {
      errors.height = 'Height must be a positive value.';
    } else if (height < 100 || height > 250) {
      errors.height = 'Enter height between 100 cm and 250 cm.';
    }
  }

  // Weight
  if (!data.weight.trim()) {
    errors.weight = 'Please enter weight in kilograms.';
  } else {
    const weight = Number(data.weight);
    if (!Number.isFinite(weight)) {
      errors.weight = 'Weight must be a valid number.';
    } else if (weight <= 0) {
      errors.weight = 'Weight must be a positive value.';
    } else if (weight < 25 || weight > 300) {
      errors.weight = 'Enter weight between 25 kg and 300 kg.';
    }
  }

  // Systolic BP
  const systolic = Number(data.systolicBp);
  if (!data.systolicBp.trim()) {
    errors.systolicBp = 'Please enter systolic blood pressure.';
  } else if (!Number.isFinite(systolic)) {
    errors.systolicBp = 'Systolic pressure must be a valid number.';
  } else if (systolic <= 0) {
    errors.systolicBp = 'Systolic pressure cannot be zero or negative.';
  } else if (systolic < 60 || systolic > 260) {
    errors.systolicBp = 'Enter systolic BP between 60 and 260 mmHg.';
  }

  // Diastolic BP
  const diastolic = Number(data.diastolicBp);
  if (!data.diastolicBp.trim()) {
    errors.diastolicBp = 'Please enter diastolic blood pressure.';
  } else if (!Number.isFinite(diastolic)) {
    errors.diastolicBp = 'Diastolic pressure must be a valid number.';
  } else if (diastolic <= 0) {
    errors.diastolicBp = 'Diastolic pressure cannot be zero or negative.';
  } else if (diastolic < 35 || diastolic > 180) {
    errors.diastolicBp = 'Enter diastolic BP between 35 and 180 mmHg.';
  }

  // Cross-field BP validation
  if (
    !errors.systolicBp &&
    !errors.diastolicBp &&
    Number.isFinite(systolic) &&
    Number.isFinite(diastolic) &&
    systolic <= diastolic
  ) {
    errors.systolicBp = 'Systolic BP must be higher than diastolic BP.';
    errors.diastolicBp = 'Diastolic BP must be lower than systolic BP.';
  }

  // Cholesterol & Glucose
  if (!data.cholesterol) {
    errors.cholesterol = 'Please select cholesterol level.';
  }
  if (!data.glucose) {
    errors.glucose = 'Please select glucose level.';
  }

  // Lifestyle indicators
  if (!data.smoke) {
    errors.smoke = 'Please indicate smoking status.';
  }
  if (!data.alcohol) {
    errors.alcohol = 'Please indicate alcohol consumption.';
  }
  if (!data.active) {
    errors.active = 'Please indicate physical activity level.';
  }

  return errors;
}

export function buildPredictionPayload(data: AssessmentFormData): PredictionApiPayload {
  const heightCm = Number(data.height);
  const weightKg = Number(data.weight);
  const bmi = calculateBmi(data.height, data.weight) ?? 0;

  return {
    age_years: Number(data.age),
    gender: data.gender === 'male' ? 2 : 1,
    height_cm: heightCm,
    weight_kg: weightKg,
    bmi,
    ap_hi: Number(data.systolicBp),
    ap_lo: Number(data.diastolicBp),
    cholesterol: Number(data.cholesterol),
    gluc: Number(data.glucose),
    smoke: data.smoke === 'yes' ? 1 : 0,
    alco: data.alcohol === 'yes' ? 1 : 0,
    active: data.active === 'active' ? 1 : 0,
  };
}

export function buildClinicalReferenceSummary(
  data: AssessmentFormData
): ClinicalReferenceSummary {
  const bmi = calculateBmi(data.height, data.weight) ?? 0;
  const systolic = Number(data.systolicBp);
  const diastolic = Number(data.diastolicBp);

  const lifestyleSummary: string[] = [
    data.smoke === 'yes' ? 'Current smoker' : 'Non-smoker',
    data.alcohol === 'yes' ? 'Reports alcohol intake' : 'No alcohol intake reported',
    data.active === 'active' ? 'Physically active' : 'Physically inactive',
  ];

  return {
    bmi,
    bmiCategory: getBmiCategory(bmi),
    bpCategory: getBloodPressureCategory(systolic, diastolic),
    cholesterolLabel: getOrdinalLabel(data.cholesterol),
    glucoseLabel: getOrdinalLabel(data.glucose),
    lifestyleSummary,
  };
}
