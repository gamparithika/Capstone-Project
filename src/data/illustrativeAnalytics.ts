// Illustrative sample data structures for Exploratory Data Analysis (EDA) visualization previews.
// IMPORTANT: All values below are clearly labelled as illustrative sample distributions for UI preview
// and do NOT claim to be computed from a live dataset connection unless explicitly populated.

export const ILLUSTRATIVE_CARDIO_DISTRIBUTION = [
  { label: 'No CVD Recorded (0)', value: 35021, share: 50.0, color: '#0f766e' },
  { label: 'CVD Recorded (1)', value: 34979, share: 50.0, color: '#16335e' },
];

export const ILLUSTRATIVE_AGE_DISTRIBUTION = [
  { bracket: '30–39 yrs', noCvd: 2100, cvd: 720 },
  { bracket: '40–44 yrs', noCvd: 5400, cvd: 2650 },
  { bracket: '45–49 yrs', noCvd: 6350, cvd: 4400 },
  { bracket: '50–54 yrs', noCvd: 8200, cvd: 7850 },
  { bracket: '55–59 yrs', noCvd: 7400, cvd: 9900 },
  { bracket: '60–65 yrs', noCvd: 5571, cvd: 9459 },
];

export const ILLUSTRATIVE_BMI_DISTRIBUTION = [
  { category: 'Underweight (<18.5)', noCvd: 420, cvd: 230 },
  { category: 'Normal (18.5–24.9)', noCvd: 14600, cvd: 10900 },
  { category: 'Overweight (25–29.9)', noCvd: 12900, cvd: 13400 },
  { category: 'Obesity (≥30)', noCvd: 7101, cvd: 10449 },
];

export const ILLUSTRATIVE_BP_ANALYSIS = [
  { stage: 'Normal (<120/80)', noCvd: 11800, cvd: 3200 },
  { stage: 'Elevated (120–129/<80)', noCvd: 9400, cvd: 6100 },
  { stage: 'Stage 1 (130–139/80–89)', noCvd: 8900, cvd: 10800 },
  { stage: 'Stage 2 (≥140/≥90)', noCvd: 4921, cvd: 14879 },
];

export const ILLUSTRATIVE_SMOKING_ANALYSIS = [
  { group: 'Non-Smoker (smoke=0)', noCvd: 31800, cvd: 32030 },
  { group: 'Smoker (smoke=1)', noCvd: 3221, cvd: 2949 },
];

export const ILLUSTRATIVE_ALCOHOL_ANALYSIS = [
  { group: 'No Alcohol (alco=0)', noCvd: 33050, cvd: 33186 },
  { group: 'Alcohol Intake (alco=1)', noCvd: 1971, cvd: 1793 },
];

export const ILLUSTRATIVE_ACTIVITY_ANALYSIS = [
  { group: 'Active (active=1)', noCvd: 28600, cvd: 27660 },
  { group: 'Inactive (active=0)', noCvd: 6421, cvd: 7319 },
];

export interface MethodologyStep {
  stepNumber: string;
  title: string;
  shortLabel: string;
  summary: string;
  technicalDetails: string[];
}

export const METHODOLOGY_PIPELINE: MethodologyStep[] = [
  {
    stepNumber: '01',
    title: 'Kaggle Dataset Ingestion',
    shortLabel: 'Kaggle Dataset',
    summary:
      'Acquire the Cardiovascular Disease Dataset containing 70,000 de-identified patient records across 11 input attributes and 1 binary target.',
    technicalDetails: [
      '70,000 original records prior to outlier sanitization',
      '11 original clinical, demographic, and lifestyle features',
      'Target variable cardio (0 = not recorded, 1 = recorded)',
    ],
  },
  {
    stepNumber: '02',
    title: 'Data Cleaning & Outlier Filtering',
    shortLabel: 'Data Cleaning',
    summary:
      'Remove physiologically implausible blood pressure, height, and weight records and check for missing or duplicate entries.',
    technicalDetails: [
      'Filter records where diastolic pressure exceeds systolic pressure (ap_lo >= ap_hi)',
      'Bound systolic/diastolic values to physiologically plausible clinical ranges',
      'Remove extreme height/weight anomalies outside realistic human bounds',
    ],
  },
  {
    stepNumber: '03',
    title: 'Age Conversion',
    shortLabel: 'Age Conversion',
    summary:
      'Transform the raw age attribute stored in days into standardized integer/decimal years for clinical interpretability.',
    technicalDetails: [
      'Raw Kaggle column age is recorded in days',
      'Converted using age_years = age_days / 365.25',
      'Enables clear age-bracket stratification during EDA',
    ],
  },
  {
    stepNumber: '04',
    title: 'BMI Calculation',
    shortLabel: 'BMI Calculation',
    summary:
      'Engineer Body Mass Index (BMI) as a composite anthropometric indicator derived from height and weight.',
    technicalDetails: [
      'Formula: BMI = weight (kg) / (height (m) × height (m))',
      'Normalizes body mass relative to stature across adult records',
      'Used in both exploratory analysis and model feature vectors',
    ],
  },
  {
    stepNumber: '05',
    title: 'Exploratory Data Analysis',
    shortLabel: 'Exploratory Data Analysis',
    summary:
      'Inspect class balance, feature correlations, blood pressure distributions, and lifestyle risk associations.',
    technicalDetails: [
      'Target distribution inspection across cardio=0 and cardio=1',
      'Correlation and distribution profiling across age, BMI, and BP',
      'Comparison of smoking, alcohol intake, and physical activity rates',
    ],
  },
  {
    stepNumber: '06',
    title: 'Train-Test Split',
    shortLabel: 'Train-Test Split',
    summary:
      'Partition the cleaned dataset into stratified training and held-out testing subsets to prevent data leakage.',
    technicalDetails: [
      'Stratified split preserves target class proportions across subsets',
      'Feature scaling fitted strictly on training split where required',
      'Held-out test set reserved exclusively for final evaluation',
    ],
  },
  {
    stepNumber: '07',
    title: 'Machine Learning Models',
    shortLabel: 'Machine Learning Models',
    summary:
      'Train three supervised classification algorithms on identical feature representations for comparative benchmarking.',
    technicalDetails: [
      'Logistic Regression (linear probabilistic baseline)',
      'Decision Tree Classifier (interpretable rule-based splits)',
      'Random Forest Classifier (ensemble bagging of decision trees)',
    ],
  },
  {
    stepNumber: '08',
    title: 'Model Evaluation',
    shortLabel: 'Model Evaluation',
    summary:
      'Assess generalization performance on the unseen test split across multiple classification and ranking metrics.',
    technicalDetails: [
      'Computed metrics: Accuracy, Precision, Recall, F1 Score, ROC-AUC',
      'Best model selected strictly using empirical test evaluation results',
      'Confusion matrix and ROC curve reviewed for false-negative sensitivity',
    ],
  },
  {
    stepNumber: '09',
    title: 'Prediction & Deployment',
    shortLabel: 'Prediction',
    summary:
      'Expose the selected Python model through a REST prediction endpoint consumed by CardioPredict AI.',
    technicalDetails: [
      'Accepts validated user health and lifestyle indicators',
      'Returns predicted class (0 or 1) and Class 1 probability',
      'Falls back transparently to Demo Mode when no API is connected',
    ],
  },
];

export const DATASET_FEATURE_DICTIONARY = [
  {
    feature: 'age',
    category: 'Personal',
    rawUnit: 'Days (converted to years)',
    description: 'Patient age converted from days in the Kaggle dataset to years.',
  },
  {
    feature: 'gender',
    category: 'Personal',
    rawUnit: 'Categorical (1 / 2)',
    description: 'Biological sex indicator (1 = Female, 2 = Male in dataset encoding).',
  },
  {
    feature: 'height',
    category: 'Personal',
    rawUnit: 'Centimeters (cm)',
    description: 'Standing height used individually and for BMI computation.',
  },
  {
    feature: 'weight',
    category: 'Personal',
    rawUnit: 'Kilograms (kg)',
    description: 'Body weight used individually and for BMI computation.',
  },
  {
    feature: 'ap_hi',
    category: 'Health Indicator',
    rawUnit: 'mmHg',
    description: 'Systolic blood pressure measured at peak ventricular contraction.',
  },
  {
    feature: 'ap_lo',
    category: 'Health Indicator',
    rawUnit: 'mmHg',
    description: 'Diastolic blood pressure measured during ventricular relaxation.',
  },
  {
    feature: 'cholesterol',
    category: 'Health Indicator',
    rawUnit: 'Ordinal (1, 2, 3)',
    description: '1 = Normal, 2 = Above Normal, 3 = Well Above Normal.',
  },
  {
    feature: 'gluc',
    category: 'Health Indicator',
    rawUnit: 'Ordinal (1, 2, 3)',
    description: 'Glucose level: 1 = Normal, 2 = Above Normal, 3 = Well Above Normal.',
  },
  {
    feature: 'smoke',
    category: 'Lifestyle',
    rawUnit: 'Binary (0 / 1)',
    description: 'Self-reported tobacco smoking status (0 = No, 1 = Yes).',
  },
  {
    feature: 'alco',
    category: 'Lifestyle',
    rawUnit: 'Binary (0 / 1)',
    description: 'Self-reported alcohol consumption status (0 = No, 1 = Yes).',
  },
  {
    feature: 'active',
    category: 'Lifestyle',
    rawUnit: 'Binary (0 / 1)',
    description: 'Self-reported regular physical activity (0 = Inactive, 1 = Active).',
  },
  {
    feature: 'cardio (Target)',
    category: 'Target Variable',
    rawUnit: 'Binary (0 / 1)',
    description:
      '0 = Cardiovascular disease not recorded; 1 = Cardiovascular disease recorded.',
  },
];
