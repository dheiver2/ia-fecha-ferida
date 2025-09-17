// Padrões Internacionais: HL7 FHIR R4 + DICOM + IHE
export interface MedicalReportTemplate {
  // HL7 FHIR DiagnosticReport Resource Structure
  resourceType: 'DiagnosticReport';
  id: string;
  meta: FHIRMeta;
  identifier: Identifier[];
  basedOn?: Reference[];
  status: DiagnosticReportStatus;
  category: CodeableConcept[];
  code: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  effectiveDateTime: string;
  issued: string;
  performer: Reference[];
  resultsInterpreter?: Reference[];
  specimen?: Reference[];
  result?: Reference[];
  imagingStudy?: Reference[];
  media?: DiagnosticReportMedia[];
  conclusion?: string;
  conclusionCode?: CodeableConcept[];
  presentedForm?: Attachment[];
  
  // Extended fields for wound care
  header: ReportHeader;
  patientInfo: PatientInfo;
  examination: ExaminationDetails;
  findings: ClinicalFindings;
  diagnosis: DiagnosisSection;
  recommendations: TreatmentRecommendations;
  cardiovascularSystemicRiskAnalysis?: CardiovascularSystemicRiskAnalysis;
  prognosisAnalysis?: PrognosisAnalysis;
  personalizedRecommendations?: PersonalizedRecommendations;
  treatmentOptimization?: TreatmentOptimization;
  qualityOfLife?: QualityOfLife;
  followUpPlan?: FollowUpPlan;
  evidenceBased?: EvidenceBased;
  footer: ReportFooter;
  
  // DICOM compliance
  dicomMetadata: DICOMMetadata;
  
  // IHE XDS-I compliance
  xdsMetadata: XDSMetadata;
}

// HL7 FHIR Base Types
export interface FHIRMeta {
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
  security?: Coding[];
  tag?: Coding[];
}

export interface Identifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: CodeableConcept;
  system?: string;
  value: string;
  period?: Period;
  assigner?: Reference;
}

export interface Reference {
  reference?: string;
  type?: string;
  identifier?: Identifier;
  display?: string;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Coding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export interface Period {
  start?: string;
  end?: string;
}

export interface Attachment {
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
}

export interface DiagnosticReportMedia {
  comment?: string;
  link: Reference;
}

export type DiagnosticReportStatus = 
  | 'registered' 
  | 'partial' 
  | 'preliminary' 
  | 'final' 
  | 'amended' 
  | 'corrected' 
  | 'appended' 
  | 'cancelled' 
  | 'entered-in-error' 
  | 'unknown';

// DICOM Metadata Structure
export interface DICOMMetadata {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  sopInstanceUID: string;
  studyDate: string;
  studyTime: string;
  modality: string; // 'XC' for External-camera Photography
  manufacturer: string;
  manufacturerModelName: string;
  softwareVersions: string[];
  patientID: string;
  patientName: string;
  patientBirthDate: string;
  patientSex: 'M' | 'F' | 'O' | 'U';
  bodyPartExamined: string;
  viewPosition?: string;
  imageType: string[];
  acquisitionDateTime: string;
  contentDate: string;
  contentTime: string;
  instanceCreationDate: string;
  instanceCreationTime: string;
  specificCharacterSet: string;
  imageComments?: string;
  burnedInAnnotation: 'YES' | 'NO';
  recognizableVisualFeatures: 'YES' | 'NO';
  lossyImageCompression: '00' | '01';
  photometricInterpretation: string;
  samplesPerPixel: number;
  bitsAllocated: number;
  bitsStored: number;
  highBit: number;
  pixelRepresentation: number;
  rows: number;
  columns: number;
  pixelSpacing?: number[];
  windowCenter?: number;
  windowWidth?: number;
}

// IHE XDS-I Metadata
export interface XDSMetadata {
  documentUniqueId: string;
  repositoryUniqueId: string;
  documentEntryUUID: string;
  submissionSetUniqueId: string;
  patientId: string;
  sourcePatientId: string;
  classCode: CodeableConcept;
  typeCode: CodeableConcept;
  practiceSettingCode: CodeableConcept;
  healthcareFacilityTypeCode: CodeableConcept;
  eventCodeList: CodeableConcept[];
  confidentialityCode: CodeableConcept;
  formatCode: CodeableConcept;
  languageCode: string;
  serviceStartTime: string;
  serviceStopTime: string;
  title: string;
  comments?: string;
  hash: string;
  size: number;
  mimeType: string;
}

export interface ReportHeader {
  // Standard medical report header
  title: string;
  protocol: string;
  date: string;
  time: string;
  institution: string;
  system: string;
  version: string;
  responsiblePhysician: string;
  crm: string;
  
  // International compliance
  reportType: 'DIAGNOSTIC_IMAGING' | 'PATHOLOGY' | 'WOUND_ASSESSMENT';
  urgency: 'ROUTINE' | 'URGENT' | 'STAT';
  confidentiality: 'NORMAL' | 'RESTRICTED' | 'VERY_RESTRICTED';
  
  // HL7 FHIR identifiers
  fhirIdentifier: Identifier;
  
  // DICOM Study identifiers
  studyInstanceUID: string;
  accessionNumber: string;
  
  // IHE XDS identifiers
  documentUniqueId: string;
  repositoryUniqueId: string;
}

export interface PatientInfo {
  // HL7 FHIR Patient Resource compliance
  resourceType: 'Patient';
  id: string;
  identifier: Identifier[];
  active?: boolean;
  name: HumanName[];
  telecom?: ContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: Address[];
  maritalStatus?: CodeableConcept;
  multipleBirthBoolean?: boolean;
  multipleBirthInteger?: number;
  photo?: Attachment[];
  contact?: PatientContact[];
  communication?: PatientCommunication[];
  generalPractitioner?: Reference[];
  managingOrganization?: Reference;
  link?: PatientLink[];
  
  // Legacy fields for backward compatibility
  age: string;
  patientId: string;
  lesionLocation: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  
  // Extended clinical information
  clinicalInfo: {
    weight?: Quantity;
    height?: Quantity;
    bmi?: number;
    bloodType?: CodeableConcept;
    allergies: AllergyIntolerance[];
    medications: MedicationStatement[];
    conditions: Condition[];
    procedures: Procedure[];
    immunizations: Immunization[];
    vitalSigns: Observation[];
  };
  
  // DICOM Patient Module
  dicomPatientInfo: {
    patientID: string;
    patientName: string; // Format: Family^Given^Middle^Prefix^Suffix
    patientBirthDate: string; // YYYYMMDD
    patientSex: 'M' | 'F' | 'O' | 'U';
    patientAge: string; // Format: nnnY, nnnM, nnnW, nnnD
    patientWeight?: string; // kg
    patientSize?: string; // m
    patientAddress?: string;
    patientTelephoneNumbers?: string;
    ethnicGroup?: string;
    patientComments?: string;
    patientSpeciesDescription?: string;
    patientBreedDescription?: string;
    responsiblePerson?: string;
    responsibleOrganization?: string;
  };
}

// HL7 FHIR Supporting Types
export interface HumanName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
}

export interface ContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: number;
  period?: Period;
}

export interface Address {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: Period;
}

export interface PatientContact {
  relationship?: CodeableConcept[];
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  organization?: Reference;
  period?: Period;
}

export interface PatientCommunication {
  language: CodeableConcept;
  preferred?: boolean;
}

export interface PatientLink {
  other: Reference;
  type: 'replaced-by' | 'replaces' | 'refer' | 'seealso';
}

export interface Quantity {
  value?: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

// Clinical Resource Types
export interface AllergyIntolerance {
  resourceType: 'AllergyIntolerance';
  id?: string;
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: 'allergy' | 'intolerance';
  category?: ('food' | 'medication' | 'environment' | 'biologic')[];
  criticality?: 'low' | 'high' | 'unable-to-assess';
  code?: CodeableConcept;
  patient: Reference;
  onsetDateTime?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: string;
  note?: Annotation[];
  reaction?: AllergyIntoleranceReaction[];
}

export interface AllergyIntoleranceReaction {
  substance?: CodeableConcept;
  manifestation: CodeableConcept[];
  description?: string;
  onset?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  exposureRoute?: CodeableConcept;
  note?: Annotation[];
}

export interface MedicationStatement {
  resourceType: 'MedicationStatement';
  id?: string;
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: 'active' | 'completed' | 'entered-in-error' | 'intended' | 'stopped' | 'on-hold' | 'unknown' | 'not-taken';
  statusReason?: CodeableConcept[];
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  context?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  dateAsserted?: string;
  informationSource?: Reference;
  derivedFrom?: Reference[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  dosage?: Dosage[];
}

export interface Condition {
  resourceType: 'Condition';
  id?: string;
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: CodeableConcept[];
  severity?: CodeableConcept;
  code?: CodeableConcept;
  bodySite?: CodeableConcept[];
  subject: Reference;
  encounter?: Reference;
  onsetDateTime?: string;
  onsetAge?: Quantity;
  onsetPeriod?: Period;
  onsetRange?: Range;
  onsetString?: string;
  abatementDateTime?: string;
  abatementAge?: Quantity;
  abatementPeriod?: Period;
  abatementRange?: Range;
  abatementString?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  stage?: ConditionStage[];
  evidence?: ConditionEvidence[];
  note?: Annotation[];
}

export interface Procedure {
  resourceType: 'Procedure';
  id?: string;
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed' | 'entered-in-error' | 'unknown';
  statusReason?: CodeableConcept;
  category?: CodeableConcept;
  code?: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  performedDateTime?: string;
  performedPeriod?: Period;
  performedString?: string;
  performedAge?: Quantity;
  performedRange?: Range;
  recorder?: Reference;
  asserter?: Reference;
  performer?: ProcedurePerformer[];
  location?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  bodySite?: CodeableConcept[];
  outcome?: CodeableConcept;
  report?: Reference[];
  complication?: CodeableConcept[];
  complicationDetail?: Reference[];
  followUp?: CodeableConcept[];
  note?: Annotation[];
  focalDevice?: ProcedureFocalDevice[];
  usedReference?: Reference[];
  usedCode?: CodeableConcept[];
}

export interface Immunization {
  resourceType: 'Immunization';
  id?: string;
  identifier?: Identifier[];
  status: 'completed' | 'entered-in-error' | 'not-done';
  statusReason?: CodeableConcept;
  vaccineCode: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  occurrenceString?: string;
  recorded?: string;
  primarySource?: boolean;
  reportOrigin?: CodeableConcept;
  location?: Reference;
  manufacturer?: Reference;
  lotNumber?: string;
  expirationDate?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  doseQuantity?: Quantity;
  performer?: ImmunizationPerformer[];
  note?: Annotation[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  isSubpotent?: boolean;
  subpotentReason?: CodeableConcept[];
  education?: ImmunizationEducation[];
  programEligibility?: CodeableConcept[];
  fundingSource?: CodeableConcept;
  reaction?: ImmunizationReaction[];
  protocolApplied?: ImmunizationProtocolApplied[];
}

export interface Observation {
  resourceType: 'Observation';
  id?: string;
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  focus?: Reference[];
  encounter?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  effectiveTiming?: Timing;
  effectiveInstant?: string;
  issued?: string;
  performer?: Reference[];
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  dataAbsentReason?: CodeableConcept;
  interpretation?: CodeableConcept[];
  note?: Annotation[];
  bodySite?: CodeableConcept;
  method?: CodeableConcept;
  specimen?: Reference;
  device?: Reference;
  referenceRange?: ObservationReferenceRange[];
  hasMember?: Reference[];
  derivedFrom?: Reference[];
  component?: ObservationComponent[];
}

// Supporting types for complex structures
export interface Annotation {
  authorReference?: Reference;
  authorString?: string;
  time?: string;
  text: string;
}

export interface Dosage {
  sequence?: number;
  text?: string;
  additionalInstruction?: CodeableConcept[];
  patientInstruction?: string;
  timing?: Timing;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  doseAndRate?: DosageDoseAndRate[];
  maxDosePerPeriod?: Ratio;
  maxDosePerAdministration?: Quantity;
  maxDosePerLifetime?: Quantity;
}

export interface Range {
  low?: Quantity;
  high?: Quantity;
}

export interface ConditionStage {
  summary?: CodeableConcept;
  assessment?: Reference[];
  type?: CodeableConcept;
}

export interface ConditionEvidence {
  code?: CodeableConcept[];
  detail?: Reference[];
}

export interface ProcedurePerformer {
  function?: CodeableConcept;
  actor: Reference;
  onBehalfOf?: Reference;
}

export interface ProcedureFocalDevice {
  action?: CodeableConcept;
  manipulated: Reference;
}

export interface ImmunizationPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export interface ImmunizationEducation {
  documentType?: string;
  reference?: string;
  publicationDate?: string;
  presentationDate?: string;
}

export interface ImmunizationReaction {
  date?: string;
  detail?: Reference;
  reported?: boolean;
}

export interface ImmunizationProtocolApplied {
  series?: string;
  authority?: Reference;
  targetDisease?: CodeableConcept[];
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
}

export interface Timing {
  event?: string[];
  repeat?: TimingRepeat;
  code?: CodeableConcept;
}

export interface TimingRepeat {
  boundsDuration?: Duration;
  boundsRange?: Range;
  boundsPeriod?: Period;
  count?: number;
  countMax?: number;
  duration?: number;
  durationMax?: number;
  durationUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
  frequency?: number;
  frequencyMax?: number;
  period?: number;
  periodMax?: number;
  periodUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
  dayOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  timeOfDay?: string[];
  when?: ('MORN' | 'MORN.early' | 'MORN.late' | 'NOON' | 'AFT' | 'AFT.early' | 'AFT.late' | 'EVE' | 'EVE.early' | 'EVE.late' | 'NIGHT' | 'PHS' | 'HS' | 'WAKE' | 'C' | 'CM' | 'CD' | 'CV' | 'AC' | 'ACM' | 'ACD' | 'ACV' | 'PC' | 'PCM' | 'PCD' | 'PCV')[];
  offset?: number;
}

export interface Duration {
  value?: number;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: string;
  system?: string;
  code?: string;
}

export interface Ratio {
  numerator?: Quantity;
  denominator?: Quantity;
}

export interface SampledData {
  origin: Quantity;
  period: number;
  factor?: number;
  lowerLimit?: number;
  upperLimit?: number;
  dimensions: number;
  data?: string;
}

export interface ObservationReferenceRange {
  low?: Quantity;
  high?: Quantity;
  type?: CodeableConcept;
  appliesTo?: CodeableConcept[];
  age?: Range;
  text?: string;
}

export interface ObservationComponent {
  code: CodeableConcept;
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  dataAbsentReason?: CodeableConcept;
  interpretation?: CodeableConcept[];
  referenceRange?: ObservationReferenceRange[];
}

export interface DosageDoseAndRate {
  type?: CodeableConcept;
  doseRange?: Range;
  doseQuantity?: Quantity;
  rateRatio?: Ratio;
  rateRange?: Range;
  rateQuantity?: Quantity;
}

export interface ExaminationDetails {
  imageQuality: ImageQuality;
  technicalAspects: TechnicalAspects;
  measurementReference: string;
  limitations: string[];
}

export interface ImageQuality {
  resolution: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
  focus: 'Nítido' | 'Levemente desfocado' | 'Desfocado';
  lighting: 'Adequada' | 'Insuficiente' | 'Excessiva';
  positioning: 'Ideal' | 'Adequado' | 'Subótimo';
  overallScore: number; // 1-10
}

export interface TechnicalAspects {
  hasRuler: boolean;
  rulerVisible: boolean;
  anatomicalReferences: string[];
  imageArtifacts: string[];
}

export interface ClinicalFindings {
  morphology: WoundMorphology;
  tissueAnalysis: TissueAnalysis;
  surroundingTissue: SurroundingTissue;
  vascularization: VascularAssessment;
  signs: ClinicalSigns;
}

export interface WoundMorphology {
  dimensions: {
    length: number;
    width: number;
    depth: number;
    area: number;
    unit: 'cm' | 'mm';
  };
  shape: 'Circular' | 'Oval' | 'Irregular' | 'Linear';
  edges: {
    definition: 'Bem definidas' | 'Irregulares' | 'Difusas';
    elevation: 'Planas' | 'Elevadas' | 'Invertidas';
    epithelialization: 'Presente' | 'Ausente' | 'Parcial';
  };
  depth: 'Superficial' | 'Parcial' | 'Total' | 'Profunda';
}

export interface TissueAnalysis {
  granulation: {
    percentage: number;
    quality: 'Saudável' | 'Pálido' | 'Friável' | 'Ausente';
    color: string;
  };
  necrotic: {
    percentage: number;
    type: 'Seco' | 'Úmido' | 'Misto' | 'Ausente';
    adherence: 'Aderente' | 'Solto' | 'Parcialmente aderente';
  };
  fibrin: {
    percentage: number;
    distribution: 'Uniforme' | 'Localizada' | 'Ausente';
  };
  exposedStructures: string[];
}

export interface SurroundingTissue {
  skin: {
    color: 'Normal' | 'Eritematosa' | 'Cianótica' | 'Hiperpigmentada';
    temperature: 'Normal' | 'Quente' | 'Fria';
    texture: 'Normal' | 'Ressecada' | 'Macerada';
    integrity: 'Íntegra' | 'Lesionada' | 'Descamativa';
  };
  edema: {
    present: boolean;
    severity: 'Leve' | 'Moderado' | 'Intenso';
    distribution: 'Localizado' | 'Difuso';
  };
  pain: {
    present: boolean;
    intensity: number; // 0-10
    characteristics: string[];
  };
}

export interface VascularAssessment {
  perfusion: 'Adequada' | 'Comprometida' | 'Ausente';
  capillaryRefill: 'Normal' | 'Lento' | 'Ausente';
  pulses: 'Presentes' | 'Diminuídos' | 'Ausentes';
  venousReturn: 'Normal' | 'Comprometido';
}

export interface ClinicalSigns {
  infection: {
    present: boolean;
    severity: 'Leve' | 'Moderada' | 'Grave';
    indicators: string[];
  };
  inflammation: {
    present: boolean;
    characteristics: string[];
  };
  exudate: {
    amount: 'Ausente' | 'Escasso' | 'Moderado' | 'Abundante';
    type: 'Seroso' | 'Sanguinolento' | 'Purulento' | 'Misto';
    color: string;
    odor: 'Ausente' | 'Leve' | 'Forte' | 'Fétido';
  };
}

export interface DiagnosisSection {
  primary: PrimaryDiagnosis;
  differential: DifferentialDiagnosis[];
  classification: WoundClassification;
  prognosis: PrognosticFactors;
  riskFactors: RiskFactor[];
}

export interface PrimaryDiagnosis {
  condition: string;
  etiology: string;
  stage: string;
  severity: 'Leve' | 'Moderada' | 'Grave';
  confidence: number; // 0-100
  justification: string;
  
  // Campos expandidos para mais contexto e detalhes
  pathophysiology: {
    underlyingMechanism: string;
    tissueInvolvement: string;
    vascularImpact: string;
    inflammatoryResponse: string;
    healingPhase: 'Inflamatória' | 'Proliferativa' | 'Remodelação' | 'Estagnada';
  };
  
  clinicalCorrelation: {
    anatomicalLocation: {
      region: string;
      laterality: 'Direita' | 'Esquerda' | 'Bilateral' | 'Central';
      proximityToStructures: string[];
      functionalImpact: string;
    };
    morphologicalCharacteristics: {
      primaryPattern: string;
      secondaryFeatures: string[];
      evolutionPattern: string;
      chronicityIndicators: string[];
    };
    systemicFactors: {
      metabolicInfluence: string[];
      vascularStatus: string;
      immunologicalFactors: string[];
      nutritionalImpact: string;
    };
  };
  
  diagnosticCertainty: {
    level: 'Definitivo' | 'Provável' | 'Possível' | 'Suspeito';
    supportingEvidence: string[];
    limitingFactors: string[];
    recommendedConfirmation: string[];
  };
  
  prognosticImplications: {
    healingPotential: {
      intrinsicFactors: string[];
      extrinsicFactors: string[];
      timelineEstimate: string;
      probabilityScore: number; // 0-100
    };
    complicationRisk: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
      preventionStrategies: string[];
    };
    functionalOutcome: {
      expectedRecovery: string;
      potentialLimitations: string[];
      rehabilitationNeeds: string[];
    };
  };
  
  therapeuticImplications: {
    treatmentPriorities: string[];
    contraindicatedApproaches: string[];
    specialConsiderations: string[];
    monitoringRequirements: string[];
  };
}

export interface DifferentialDiagnosis {
  condition: string;
  probability: number; // 0-100
  supportingFindings: string[];
  excludingFactors: string[];
}

export interface WoundClassification {
  system: 'Wagner' | 'NPUAP' | 'CEAP' | 'Outro';
  grade: string;
  description: string;
}

export interface PrognosticFactors {
  healingPotential: 'Excelente' | 'Bom' | 'Regular' | 'Ruim';
  estimatedHealingTime: string;
  favorableFactors: string[];
  unfavorableFactors: string[];
  complications: PotentialComplication[];
}

export interface PotentialComplication {
  type: string;
  probability: 'Baixa' | 'Moderada' | 'Alta';
  prevention: string[];
}

export interface RiskFactor {
  factor: string;
  impact: 'Alto' | 'Moderado' | 'Baixo';
  modifiable: boolean;
  intervention: string;
}

export interface TreatmentRecommendations {
  immediate: ImmediateActions;
  ongoing: OngoingCare;
  monitoring: MonitoringPlan;
  referrals: Referral[];
  patientEducation: EducationPoints[];
  complicationRiskAssessment: ComplicationRiskAssessment;
}

export interface ComplicationRiskAssessment {
  overallRiskLevel: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico';
  riskScore: number; // 0-100
  primaryRiskFactors: RiskFactor[];
  infectionRisk: {
    probability: 'Baixa' | 'Moderada' | 'Alta' | 'Muito Alta';
    indicators: string[];
    preventiveMeasures: string[];
    monitoringFrequency: string;
  };
  healingDelayRisk: {
    probability: 'Baixa' | 'Moderada' | 'Alta' | 'Muito Alta';
    contributingFactors: string[];
    interventions: string[];
    expectedTimeframe: string;
  };
  systemicComplicationRisk: {
    probability: 'Baixa' | 'Moderada' | 'Alta' | 'Muito Alta';
    potentialComplications: string[];
    warningSignsEducation: string[];
    emergencyProtocol: string[];
  };
  riskMitigationPlan: {
    immediateActions: string[];
    ongoingInterventions: string[];
    monitoringProtocol: string[];
    escalationCriteria: string[];
  };
  prognosticIndicators: {
    healingProbability: string;
    functionalRecovery: string;
    qualityOfLifeImpact: string;
    longTermOutlook: string;
  };
}

export interface ImmediateActions {
  cleaning: CleaningProtocol;
  debridement: DebridementPlan;
  dressing: DressingRecommendation;
  painManagement: PainManagement;
  infectionControl: InfectionControl;
}

export interface CleaningProtocol {
  solution: string;
  technique: string;
  frequency: string;
  precautions: string[];
}

export interface DebridementPlan {
  indicated: boolean;
  type: 'Cirúrgico' | 'Mecânico' | 'Autolítico' | 'Enzimático';
  urgency: 'Imediato' | 'Dentro de 24h' | 'Eletivo';
  considerations: string[];
}

export interface DressingRecommendation {
  primary: {
    type: string;
    product: string;
    application: string;
  };
  secondary: {
    type: string;
    product: string;
    fixation: string;
  };
  changeFrequency: string;
  specialInstructions: string[];
}

export interface PainManagement {
  assessment: string;
  pharmacological: PharmacologicalTreatment[];
  nonPharmacological: string[];
  monitoring: string;
}

export interface PharmacologicalTreatment {
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  precautions: string[];
}

export interface InfectionControl {
  riskLevel: 'Baixo' | 'Moderado' | 'Alto';
  preventiveMeasures: string[];
  antibioticTherapy?: AntibioticTherapy;
  cultureIndication: boolean;
  isolationPrecautions: string[];
}

export interface AntibioticTherapy {
  indication: string;
  agent: string;
  route: 'Tópico' | 'Oral' | 'Endovenoso';
  duration: string;
  monitoring: string[];
}

export interface OngoingCare {
  positioning: PositioningGuidelines;
  nutrition: NutritionalSupport;
  lifestyle: LifestyleModifications;
  comorbidityManagement: ComorbidityManagement[];
}

export interface PositioningGuidelines {
  pressureRelief: string[];
  frequency: string;
  devices: string[];
  contraindications: string[];
}

export interface NutritionalSupport {
  assessment: string;
  requirements: NutritionalRequirement[];
  supplements: string[];
  monitoring: string[];
}

export interface NutritionalRequirement {
  nutrient: string;
  amount: string;
  rationale: string;
}

export interface LifestyleModifications {
  smokingCessation: boolean;
  exerciseRecommendations: string[];
  stressManagement: string[];
  sleepHygiene: string[];
}

export interface ComorbidityManagement {
  condition: string;
  impact: string;
  management: string[];
  monitoring: string[];
}

export interface MonitoringPlan {
  frequency: string;
  parameters: MonitoringParameter[];
  warningSignsEducation: string[];
  followUpSchedule: FollowUpSchedule[];
}

export interface MonitoringParameter {
  parameter: string;
  method: string;
  frequency: string;
  targetValues: string;
  actionThresholds: string[];
}

export interface FollowUpSchedule {
  timeframe: string;
  provider: string;
  objectives: string[];
  assessments: string[];
}

export interface Referral {
  specialty: string;
  urgency: 'Urgente' | 'Prioritário' | 'Eletivo';
  reason: string;
  expectedOutcome: string;
}

export interface EducationPoints {
  topic: string;
  keyPoints: string[];
  resources: string[];
  assessmentMethod: string;
}

export interface ReportFooter {
  limitations: string[];
  disclaimers: string[];
  legalConsiderations: string[];
  nextSteps: string[];
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  service: string;
  phone: string;
  availability: string;
  indications: string[];
}

export interface CardiovascularSystemicRiskAnalysis {
  overallCardiovascularRisk?: string;
  diabeticRiskAssessment?: {
    suspectedDiabetes?: boolean;
    diabeticFootRisk?: string;
    neuropathyIndicators?: string[];
  };
  vascularRiskAssessment?: {
    peripheralVascularDisease?: string;
    capillaryRefillAssessment?: string;
    arterialInsufficiencyIndicators?: string[];
  };
  hypertensionImpact?: string;
  nutritionalMetabolicFactors?: {
    proteinDeficiencyRisk?: string;
    nutritionalInterventions?: string[];
  };
  immunologicalFactors?: {
    immunocompromisedStatus?: string;
    infectionSusceptibility?: string;
    immunologicalSupport?: string[];
  };
  systemicInflammationMarkers?: string;
  cardiovascularOptimizationPlan?: string;
  integratedCareRecommendations?: {
    specialistReferrals?: Array<{
      specialty: string;
      indication: string;
      urgency: string;
    }>;
    coordinatedCareProtocol?: string[];
  };
}

export interface PrognosisAnalysis {
  healingTimeEstimate?: {
    optimistic?: string;
    realistic?: string;
    pessimistic?: string;
    factors?: string[];
  };
  healingProbability?: {
    complete?: number;
    partial?: number;
    complications?: number;
    reasoning?: string;
  };
  riskFactors?: {
    high?: string[];
    moderate?: string[];
    protective?: string[];
  };
  complicationRisk?: string;
  functionalOutcome?: string;
  qualityOfLifeImpact?: string;
  longTermPrognosis?: string;
}

export interface PersonalizedRecommendations {
  immediate?: {
    actions?: string[];
  };
  shortTerm?: {
    actions?: string[];
  };
  longTerm?: {
    actions?: string[];
  };
  highPriority?: string[];
  mediumPriority?: string[];
  lowPriority?: string[];
  patientSpecific?: string[];
  lifestyle?: {
    nutrition?: string[];
    activity?: string[];
    sleep?: string[];
    stress?: string[];
    hygiene?: string[];
    environment?: string[];
  };
  followUp?: string[];
}

export interface TreatmentOptimization {
  currentTreatment?: string;
  optimizations?: string[];
  alternatives?: string[];
  contraindications?: string[];
  drugInteractions?: string[];
}

export interface QualityOfLife {
  impact?: {
    physical?: string;
    emotional?: string;
    social?: string;
  };
  supportStrategies?: string[];
  adaptations?: string[];
}

export interface FollowUpPlan {
  schedule?: {
    week1?: string;
    week2?: string;
    month1?: string;
    ongoing?: string;
  };
  specialists?: string[];
  tests?: string[];
  documentation?: string[];
}

export interface EvidenceBased {
  guidelines?: string[];
  research?: string[];
  confidence?: string;
}

// Template de prompt estruturado seguindo padrões internacionais
export const createStructuredPrompt = (patientContext?: any): string => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR');
  const protocolNumber = `CFI-${Date.now().toString().slice(-8)}`;

  return `
SISTEMA DE ANÁLISE MÉDICA AVANÇADA - LAUDO ESTRUTURADO INTERNACIONAL
================================================================

CONFORMIDADE COM PADRÕES INTERNACIONAIS:

1. HL7 FHIR R4 - Fast Healthcare Interoperability Resources
   ✓ DiagnosticReport Resource structure
   ✓ Observation Resource for clinical findings
   ✓ Patient Resource compliance
   ✓ CodeableConcept with standardized terminologies
   ✓ Reference linking between resources
   ✓ Meta information for versioning and profiles

2. DICOM - Digital Imaging and Communications in Medicine
   ✓ Patient Module (0010,xxxx) compliance
   ✓ Study and Series identification
   ✓ Image metadata preservation
   ✓ Structured reporting templates (SR IODs)
   ✓ Acquisition context preservation

3. IHE XDS-I - Cross-Enterprise Document Sharing for Imaging
   ✓ Document metadata compliance
   ✓ Clinical context preservation
   ✓ Interoperability standards
   ✓ Registry/Repository architecture support

TERMINOLOGIAS PADRONIZADAS OBRIGATÓRIAS:
• SNOMED CT - Conceitos clínicos, anatomia, procedimentos
• LOINC - Observações laboratoriais e clínicas
• ICD-10-CM - Diagnósticos e condições
• ICD-10-PCS - Procedimentos
• UCUM - Unidades de medida
• RxNorm - Medicamentos
• CPT - Procedimentos médicos
• ISO 3166 - Códigos de país
• ISO 639 - Códigos de idioma
• ISO 8601 - Formato de data/hora

INSTRUÇÕES PARA ANÁLISE:
Você deve analisar a imagem médica fornecida e gerar um laudo estruturado seguindo EXATAMENTE o formato JSON especificado abaixo, em conformidade com os padrões HL7 FHIR R4, DICOM e IHE XDS-I. Cada seção deve ser preenchida com base na análise visual da ferida/lesão usando terminologias médicas padronizadas.

CRITÉRIOS DE ANÁLISE INTERNACIONAL:
1. LOCALIZAÇÃO ANATÔMICA (SNOMED CT):
   - Use códigos SNOMED CT para estruturas anatômicas
   - Lateralidade (direita/esquerda) quando aplicável
   - Região corporal específica com coordenadas

2. DIMENSÕES E MEDIDAS (UCUM):
   - Comprimento, largura, profundidade em centímetros
   - Área da lesão em cm²
   - Volume quando calculável
   - Unidades padronizadas UCUM

3. CARACTERÍSTICAS VISUAIS (SNOMED CT):
   - Cor: códigos para eritema, cianose, palidez
   - Textura: lisa, rugosa, irregular
   - Bordas: bem definidas, irregulares, elevadas
   - Exsudato: tipo, quantidade, cor, odor
   - Tecido necrótico: percentual, tipo

4. CLASSIFICAÇÃO INTERNACIONAL:
   - Wagner Classification (diabetes)
   - University of Texas Classification
   - NPUAP/EPUAP Pressure Ulcer Classification
   - TIME framework (Tissue, Infection, Moisture, Edge)

5. SINAIS DE INFECÇÃO (SNOMED CT):
   - Eritema perilesional
   - Edema local
   - Calor aumentado
   - Exsudato purulento
   - Odor característico
   - Dor/sensibilidade

6. PROCESSO DE CICATRIZAÇÃO:
   - Fase inflamatória
   - Fase proliferativa
   - Fase de remodelação
   - Tecido de granulação (qualidade/quantidade)
   - Epitelização

VALIDAÇÃO CLÍNICA:
- Correlacione com guidelines internacionais
- Aplique escalas de avaliação validadas
- Considere fatores de risco sistêmicos
- Avalie necessidade de biópsia
- Determine urgência do tratamento

LIMITAÇÕES E RECOMENDAÇÕES:
- Documente limitações da análise por imagem
- Recomende avaliação presencial quando necessário
- Sugira exames complementares
- Indique necessidade de culturas
- Mantenha objetividade científica baseada em evidências

CONTEXTO DO PACIENTE:
- Nome: ${patientContext?.nome || 'PACIENTE NÃO IDENTIFICADO'}
- Idade: ${patientContext?.idade || 'Não informada'}
- Sexo: ${patientContext?.sexo || 'Não informado'}
- Localização da Lesão: ${patientContext?.localizacaoLesao || 'Não especificada'}

FORMATO DE RESPOSTA OBRIGATÓRIO:
Responda APENAS com um objeto JSON válido seguindo esta estrutura:

{
  "header": {
    "title": "LAUDO MÉDICO DIGITAL - ANÁLISE AVANÇADA DE FERIDA IA",
    "protocol": "${protocolNumber}",
    "date": "${currentDate}",
    "time": "${currentTime}",
    "institution": "Sistema Fecha Ferida IA",
    "system": "Fecha Ferida IA v3.0",
    "version": "3.0.0",
    "responsiblePhysician": "Dr. Sistema IA Avançado",
    "crm": "IA-2024-ADV"
  },
  "patientInfo": {
    "name": "${patientContext?.nome || 'PACIENTE NÃO IDENTIFICADO'}",
    "age": "${patientContext?.idade || 'Não informada'}",
    "gender": "${patientContext?.sexo || 'Não informado'}",
    "patientId": "TEMP_${Date.now().toString().slice(-6)}",
    "lesionLocation": "${patientContext?.localizacaoLesao || 'Não especificada'}",
    "medicalHistory": "Baseado na análise visual - histórico não disponível",
    "allergies": "Não informado",
    "currentMedications": "Não informado"
  },
  "examination": {
    "imageQuality": {
      "resolution": "[Excelente|Boa|Regular|Ruim]",
      "focus": "[Nítido|Levemente desfocado|Desfocado]",
      "lighting": "[Adequada|Insuficiente|Excessiva]",
      "positioning": "[Ideal|Adequado|Subótimo]",
      "overallScore": [número de 1-10]
    },
    "technicalAspects": {
      "hasRuler": [true|false],
      "rulerVisible": [true|false],
      "anatomicalReferences": ["lista de referências anatômicas visíveis"],
      "imageArtifacts": ["lista de artefatos ou limitações"]
    },
    "measurementReference": "Descrição da referência de medida disponível",
    "limitations": ["lista de limitações da análise por imagem"]
  },
  "findings": {
    "morphology": {
      "dimensions": {
        "length": [número estimado],
        "width": [número estimado],
        "depth": [número estimado],
        "area": [número estimado],
        "unit": "cm"
      },
      "shape": "[Circular|Oval|Irregular|Linear]",
      "edges": {
        "definition": "[Bem definidas|Irregulares|Difusas]",
        "elevation": "[Planas|Elevadas|Invertidas]",
        "epithelialization": "[Presente|Ausente|Parcial]"
      },
      "depth": "[Superficial|Parcial|Total|Profunda]"
    },
    "tissueAnalysis": {
      "granulation": {
        "percentage": [0-100],
        "quality": "[Saudável|Pálido|Friável|Ausente]",
        "color": "descrição da cor"
      },
      "necrotic": {
        "percentage": [0-100],
        "type": "[Seco|Úmido|Misto|Ausente]",
        "adherence": "[Aderente|Solto|Parcialmente aderente]"
      },
      "fibrin": {
        "percentage": [0-100],
        "distribution": "[Uniforme|Localizada|Ausente]"
      },
      "exposedStructures": ["lista de estruturas expostas"]
    },
    "surroundingTissue": {
      "skin": {
        "color": "[Normal|Eritematosa|Cianótica|Hiperpigmentada]",
        "temperature": "[Normal|Quente|Fria]",
        "texture": "[Normal|Ressecada|Macerada]",
        "integrity": "[Íntegra|Lesionada|Descamativa]"
      },
      "edema": {
        "present": [true|false],
        "severity": "[Leve|Moderado|Intenso]",
        "distribution": "[Localizado|Difuso]"
      },
      "pain": {
        "present": [true|false],
        "intensity": [0-10],
        "characteristics": ["lista de características da dor"]
      }
    },
    "vascularization": {
      "perfusion": "[Adequada|Comprometida|Ausente]",
      "capillaryRefill": "[Normal|Lento|Ausente]",
      "pulses": "[Presentes|Diminuídos|Ausentes]",
      "venousReturn": "[Normal|Comprometido]"
    },
    "signs": {
      "infection": {
        "present": [true|false],
        "severity": "[Leve|Moderada|Grave]",
        "indicators": ["lista de indicadores de infecção"]
      },
      "inflammation": {
        "present": [true|false],
        "characteristics": ["lista de características inflamatórias"]
      },
      "exudate": {
        "amount": "[Ausente|Escasso|Moderado|Abundante]",
        "type": "[Seroso|Sanguinolento|Purulento|Misto]",
        "color": "descrição da cor",
        "odor": "[Ausente|Leve|Forte|Fétido]"
      }
    }
  },
  "diagnosis": {
    "primary": {
      "condition": "Diagnóstico principal baseado na análise detalhada dos achados clínicos, considerando a apresentação morfológica, localização anatômica, características do tecido e contexto clínico do paciente",
      "etiology": "Etiologia provável com base nos fatores de risco identificados, mecanismo de lesão, história clínica e achados físicos específicos",
      "stage": "Estágio ou grau da lesão conforme classificação apropriada (Wagner, NPUAP, CEAP ou outra aplicável)",
      "severity": "[Leve|Moderada|Grave]",
      "confidence": [0-100],
      "justification": "Justificativa detalhada e fundamentada do diagnóstico, incluindo: 1) Correlação entre achados clínicos e diagnóstico proposto, 2) Análise diferencial com outras condições similares, 3) Fatores que confirmam ou excluem diagnósticos alternativos, 4) Considerações sobre a evolução temporal da lesão, 5) Impacto dos fatores sistêmicos e locais no quadro clínico",
      "pathophysiology": "Explicação detalhada dos mecanismos fisiopatológicos envolvidos na formação e perpetuação da lesão, incluindo processos inflamatórios, vasculares, metabólicos e de cicatrização",
      "clinicalCorrelation": "Correlação entre os achados clínicos observados e o conhecimento científico estabelecido, destacando aspectos típicos e atípicos da apresentação",
      "diagnosticCertainty": {
        "level": "[Definitivo|Provável|Possível|Suspeito]",
        "supportingEvidence": ["Lista de evidências que suportam o diagnóstico"],
        "limitingFactors": ["Fatores que limitam a certeza diagnóstica"],
        "recommendedConfirmation": ["Exames ou avaliações adicionais recomendados para confirmação"]
      },
      "prognosticImplications": {
        "healingPotential": {
          "intrinsicFactors": ["Fatores intrínsecos que influenciam a cicatrização"],
          "extrinsicFactors": ["Fatores extrínsecos modificáveis"],
          "timelineEstimate": "Estimativa temporal realística para cicatrização",
          "probabilityScore": [0-100]
        },
        "complicationRisk": {
          "immediate": ["Riscos de complicações imediatas"],
          "shortTerm": ["Riscos a curto prazo"],
          "longTerm": ["Riscos a longo prazo"],
          "preventionStrategies": ["Estratégias específicas de prevenção"]
        },
        "functionalOutcome": {
          "expectedRecovery": "Expectativa de recuperação funcional",
          "potentialLimitations": ["Limitações funcionais potenciais"],
          "rehabilitationNeeds": ["Necessidades de reabilitação"]
        }
      },
      "therapeuticImplications": {
        "treatmentPriorities": ["Prioridades terapêuticas baseadas no diagnóstico"],
        "contraindicatedApproaches": ["Abordagens contraindicadas"],
        "specialConsiderations": ["Considerações especiais para o tratamento"],
        "monitoringRequirements": ["Requisitos específicos de monitoramento"]
      }
    },
    "differential": [
      {
        "condition": "Diagnóstico diferencial 1",
        "probability": [0-100],
        "supportingFindings": ["achados que suportam"],
        "excludingFactors": ["fatores que excluem"]
      }
    ],
    "classification": {
      "system": "Sistema de classificação aplicável",
      "grade": "Grau ou estágio",
      "description": "Descrição da classificação"
    },
    "prognosis": {
      "healingPotential": "[Excelente|Bom|Regular|Ruim]",
      "estimatedHealingTime": "Tempo estimado de cicatrização",
      "favorableFactors": ["fatores favoráveis"],
      "unfavorableFactors": ["fatores desfavoráveis"],
      "complications": [
        {
          "type": "Tipo de complicação",
          "probability": "[Baixa|Moderada|Alta]",
          "prevention": ["medidas preventivas"]
        }
      ]
    },
    "riskFactors": [
      {
        "factor": "Fator de risco",
        "impact": "[Alto|Moderado|Baixo]",
        "modifiable": [true|false],
        "intervention": "Intervenção recomendada"
      }
    ]
  },
  "recommendations": {
    "immediate": {
      "cleaning": {
        "solution": "Solução recomendada",
        "technique": "Técnica de limpeza",
        "frequency": "Frequência",
        "precautions": ["precauções especiais"]
      },
      "debridement": {
        "indicated": [true|false],
        "type": "[Cirúrgico|Mecânico|Autolítico|Enzimático]",
        "urgency": "[Imediato|Dentro de 24h|Eletivo]",
        "considerations": ["considerações especiais"]
      },
      "dressing": {
        "primary": {
          "type": "Tipo de cobertura primária",
          "product": "Produto específico",
          "application": "Modo de aplicação"
        },
        "secondary": {
          "type": "Tipo de cobertura secundária",
          "product": "Produto específico",
          "fixation": "Método de fixação"
        },
        "changeFrequency": "Frequência de troca",
        "specialInstructions": ["instruções especiais"]
      },
      "painManagement": {
        "assessment": "Avaliação da dor",
        "pharmacological": [
          {
            "medication": "Medicamento",
            "dosage": "Dosagem",
            "route": "Via de administração",
            "frequency": "Frequência",
            "duration": "Duração",
            "precautions": ["precauções"]
          }
        ],
        "nonPharmacological": ["medidas não farmacológicas"],
        "monitoring": "Monitoramento da dor"
      },
      "infectionControl": {
        "riskLevel": "[Baixo|Moderado|Alto]",
        "preventiveMeasures": ["medidas preventivas"],
        "cultureIndication": [true|false],
        "isolationPrecautions": ["precauções de isolamento"]
      }
    },
    "ongoing": {
      "positioning": {
        "pressureRelief": ["orientações de alívio de pressão"],
        "frequency": "Frequência de mudança de posição",
        "devices": ["dispositivos recomendados"],
        "contraindications": ["contraindicações"]
      },
      "nutrition": {
        "assessment": "Avaliação nutricional",
        "requirements": [
          {
            "nutrient": "Nutriente",
            "amount": "Quantidade",
            "rationale": "Justificativa"
          }
        ],
        "supplements": ["suplementos recomendados"],
        "monitoring": ["parâmetros de monitoramento"]
      },
      "lifestyle": {
        "smokingCessation": [true|false],
        "exerciseRecommendations": ["recomendações de exercício"],
        "stressManagement": ["manejo do estresse"],
        "sleepHygiene": ["higiene do sono"]
      },
      "comorbidityManagement": [
        {
          "condition": "Comorbidade",
          "impact": "Impacto na cicatrização",
          "management": ["manejo específico"],
          "monitoring": ["monitoramento necessário"]
        }
      ]
    },
    "monitoring": {
      "frequency": "Frequência de reavaliação",
      "parameters": [
        {
          "parameter": "Parâmetro a monitorar",
          "method": "Método de avaliação",
          "frequency": "Frequência",
          "targetValues": "Valores alvo",
          "actionThresholds": ["limites para ação"]
        }
      ],
      "warningSignsEducation": ["sinais de alerta"],
      "followUpSchedule": [
        {
          "timeframe": "Prazo",
          "provider": "Profissional",
          "objectives": ["objetivos da consulta"],
          "assessments": ["avaliações necessárias"]
        }
      ]
    },
    "referrals": [
      {
        "specialty": "Especialidade",
        "urgency": "[Urgente|Prioritário|Eletivo]",
        "reason": "Motivo do encaminhamento",
        "expectedOutcome": "Resultado esperado"
      }
    ],
    "patientEducation": [
      {
        "topic": "Tópico educacional",
        "keyPoints": ["pontos principais"],
        "resources": ["recursos educacionais"],
        "assessmentMethod": "Método de avaliação do aprendizado"
      }
    ],
    "cardiovascularSystemicRiskAnalysis": {
      "overallCardiovascularRisk": "[Baixo|Moderado|Alto|Crítico]",
      "diabeticRiskAssessment": {
        "suspectedDiabetes": [true|false],
        "diabeticFootRisk": "[Baixo|Moderado|Alto|Muito Alto]",
        "neuropathyIndicators": ["indicadores de neuropatia observados"],
        "vasculopathyIndicators": ["indicadores de vasculopatia observados"],
        "glycemicControlRecommendations": ["recomendações para controle glicêmico"],
        "diabeticFootCareEducation": ["orientações específicas para cuidados com pé diabético"]
      },
      "vascularRiskAssessment": {
        "peripheralVascularDisease": "[Ausente|Suspeita|Provável|Confirmada]",
        "arterialInsufficiencyIndicators": ["indicadores de insuficiência arterial"],
        "venousInsufficiencyIndicators": ["indicadores de insuficiência venosa"],
        "capillaryRefillAssessment": "Avaliação do enchimento capilar",
        "vascularInterventionNeeds": ["necessidades de intervenção vascular"],
        "compressionTherapyIndications": ["indicações para terapia compressiva"]
      },
      "hypertensionImpact": {
        "bloodPressureControlImportance": "Importância do controle pressórico para cicatrização",
        "antihypertensiveConsiderations": ["considerações sobre anti-hipertensivos"],
        "targetBloodPressure": "Pressão arterial alvo para otimizar cicatrização"
      },
      "nutritionalMetabolicFactors": {
        "proteinDeficiencyRisk": "[Baixo|Moderado|Alto]",
        "vitaminDeficiencyIndicators": ["indicadores de deficiências vitamínicas"],
        "mineralDeficiencyIndicators": ["indicadores de deficiências minerais"],
        "nutritionalInterventions": ["intervenções nutricionais específicas"],
        "metabolicOptimizationPlan": ["plano de otimização metabólica"]
      },
      "immunologicalFactors": {
        "immunocompromisedStatus": "[Não|Suspeita|Confirmada]",
        "immunosuppressionCauses": ["causas de imunossupressão identificadas"],
        "infectionSusceptibility": "[Baixa|Moderada|Alta|Muito Alta]",
        "immunologicalSupport": ["medidas de suporte imunológico"],
        "vaccinationRecommendations": ["recomendações de vacinação"]
      },
      "systemicInflammationMarkers": {
        "chronicInflammationIndicators": ["indicadores de inflamação crônica"],
        "autoimmuneDiseaseRisk": "[Baixo|Moderado|Alto]",
        "antiInflammatoryStrategies": ["estratégias anti-inflamatórias"],
        "systemicTreatmentConsiderations": ["considerações para tratamento sistêmico"]
      },
      "cardiovascularOptimizationPlan": {
        "cardiacRiskStratification": "Estratificação de risco cardíaco",
        "exerciseRecommendations": ["recomendações de exercício adaptadas"],
        "cardiovascularMedications": ["medicações cardiovasculares a considerar"],
        "cardiologyReferralIndications": ["indicações para encaminhamento cardiológico"],
        "cardiovascularMonitoring": ["parâmetros de monitoramento cardiovascular"]
      },
      "endocrinologicalConsiderations": {
        "hormonalFactors": ["fatores hormonais que afetam cicatrização"],
        "thyroidFunctionImpact": "Impacto da função tireoidiana",
        "corticosteroidEffects": ["efeitos de corticosteroides na cicatrização"],
        "endocrinologicalReferral": ["indicações para encaminhamento endocrinológico"],
        "hormonalOptimization": ["estratégias de otimização hormonal"]
      },
      "renalHepaticConsiderations": {
        "renalFunctionImpact": "Impacto da função renal na cicatrização",
        "hepaticFunctionImpact": "Impacto da função hepática",
        "drugMetabolismConsiderations": ["considerações sobre metabolismo de medicamentos"],
        "nephroHepatoprotectiveStrategies": ["estratégias nefroprotetoras e hepatoprotetoras"]
      },
      "psychosocialFactors": {
        "depressionAnxietyImpact": "Impacto de depressão/ansiedade na cicatrização",
        "socialSupportAssessment": "Avaliação do suporte social",
        "adherenceBarriers": ["barreiras à aderência ao tratamento"],
        "psychosocialInterventions": ["intervenções psicossociais recomendadas"],
        "qualityOfLifeConsiderations": ["considerações sobre qualidade de vida"]
      },
      "integratedCareRecommendations": {
        "multidisciplinaryTeamNeeds": ["necessidades de equipe multidisciplinar"],
        "specialistReferrals": [
          {
            "specialty": "Especialidade médica",
            "indication": "Indicação específica",
            "urgency": "[Rotina|Urgente|Emergencial]",
            "expectedOutcome": "Resultado esperado"
          }
        ],
        "coordinatedCareProtocol": ["protocolo de cuidado coordenado"],
        "systemicOptimizationTimeline": "Cronograma de otimização sistêmica"
      }
    },
    "complicationRiskAssessment": {
      "overallRiskLevel": "[Baixo|Moderado|Alto|Crítico]",
      "riskScore": 0,
      "primaryRiskFactors": [
        {
          "factor": "Fator de risco identificado",
          "impact": "[Alto|Moderado|Baixo]",
          "modifiable": true,
          "intervention": "Intervenção recomendada"
        }
      ],
      "infectionRisk": {
        "probability": "[Baixa|Moderada|Alta|Muito Alta]",
        "indicators": ["indicadores de risco infeccioso"],
        "preventiveMeasures": ["medidas preventivas específicas"],
        "monitoringFrequency": "Frequência de monitoramento"
      },
      "healingDelayRisk": {
        "probability": "[Baixa|Moderada|Alta|Muito Alta]",
        "contributingFactors": ["fatores que podem atrasar a cicatrização"],
        "interventions": ["intervenções para otimizar cicatrização"],
        "expectedTimeframe": "Tempo esperado para cicatrização"
      },
      "systemicComplicationRisk": {
        "probability": "[Baixa|Moderada|Alta|Muito Alta]",
        "potentialComplications": ["complicações sistêmicas possíveis"],
        "warningSignsEducation": ["sinais de alerta para o paciente"],
        "emergencyProtocol": ["protocolo de emergência"]
      },
      "riskMitigationPlan": {
        "immediateActions": ["ações imediatas para reduzir riscos"],
        "ongoingInterventions": ["intervenções contínuas"],
        "monitoringProtocol": ["protocolo de monitoramento"],
        "escalationCriteria": ["critérios para escalação do cuidado"]
      },
      "prognosticIndicators": {
        "healingProbability": "Probabilidade de cicatrização completa",
        "functionalRecovery": "Expectativa de recuperação funcional",
        "qualityOfLifeImpact": "Impacto na qualidade de vida",
        "longTermOutlook": "Prognóstico a longo prazo"
      }
    }
  },
  "prognosisAnalysis": {
    "healingTimeEstimate": {
      "optimistic": "[tempo em semanas]",
      "realistic": "[tempo em semanas]",
      "pessimistic": "[tempo em semanas]",
      "factors": ["fatores que influenciam o tempo de cicatrização"]
    },
    "healingProbability": {
      "complete": "[porcentagem 0-100]",
      "partial": "[porcentagem 0-100]",
      "complications": "[porcentagem 0-100]",
      "reasoning": "Justificativa baseada nos achados"
    },
    "riskFactors": {
      "high": ["fatores de alto risco identificados"],
      "moderate": ["fatores de risco moderado"],
      "protective": ["fatores protetivos presentes"]
    },
    "criticalIndicators": {
      "warning": ["sinais de alerta para monitoramento"],
      "improvement": ["indicadores de melhora esperados"],
      "deterioration": ["sinais de piora a observar"]
    }
  },
  "personalizedRecommendations": {
    "immediate": {
      "priority": "alta",
      "actions": ["ações imediatas necessárias"],
      "timeline": "24-48 horas"
    },
    "shortTerm": {
      "priority": "alta",
      "actions": ["ações para 1-2 semanas"],
      "timeline": "1-2 semanas"
    },
    "longTerm": {
      "priority": "média",
      "actions": ["ações para seguimento prolongado"],
      "timeline": "1-3 meses"
    },
    "lifestyle": {
      "nutrition": ["recomendações nutricionais específicas"],
      "activity": ["orientações de atividade física"],
      "hygiene": ["cuidados de higiene personalizados"],
      "environment": ["modificações ambientais sugeridas"]
    },
    "monitoring": {
      "frequency": "[frequência de avaliação recomendada]",
      "parameters": ["parâmetros específicos a monitorar"],
      "tools": ["ferramentas de monitoramento sugeridas"],
      "alerts": ["quando buscar atendimento urgente"]
    }
  },
  "treatmentOptimization": {
    "currentApproach": {
      "effectiveness": "[alta|média|baixa]",
      "adjustments": ["ajustes sugeridos no tratamento atual"]
    },
    "alternativeOptions": {
      "conservative": ["opções conservadoras adicionais"],
      "advanced": ["terapias avançadas a considerar"],
      "surgical": ["intervenções cirúrgicas se aplicável"]
    },
    "contraindications": ["tratamentos a evitar baseado no caso"],
    "drugInteractions": ["possíveis interações medicamentosas"]
  },
  "qualityOfLife": {
    "impact": {
      "physical": "Impacto físico esperado",
      "emotional": "Impacto emocional a considerar",
      "social": "Impacto social e funcional"
    },
    "supportStrategies": ["estratégias de suporte recomendadas"],
    "adaptations": ["adaptações necessárias no dia a dia"]
  },
  "followUpPlan": {
    "schedule": {
      "week1": "Avaliação em 1 semana",
      "week2": "Avaliação em 2 semanas",
      "month1": "Avaliação em 1 mês",
      "ongoing": "Seguimento contínuo"
    },
    "specialists": ["especialistas a consultar"],
    "tests": ["exames complementares sugeridos"],
    "documentation": ["documentação necessária para seguimento"]
  },
  "evidenceBased": {
    "guidelines": ["diretrizes clínicas aplicáveis"],
    "research": ["evidências científicas relevantes"],
    "confidence": "[alta|média|baixa] - nível de confiança da análise"
  },
  "footer": {
    "limitations": ["limitações da análise"],
    "disclaimers": ["avisos importantes"],
    "legalConsiderations": ["considerações legais"],
    "nextSteps": ["próximos passos"],
    "emergencyContacts": [
      {
        "service": "Serviço de emergência",
        "phone": "Telefone",
        "availability": "Disponibilidade",
        "indications": ["indicações para contato"]
      }
    ]
  }
}

DIRETRIZES CRÍTICAS:
1. Responda APENAS com o JSON válido - sem texto adicional
2. Analise cuidadosamente todos os aspectos visíveis da ferida
3. Use terminologia médica precisa
4. Inclua percentuais de confiança realistas
5. Seja específico nas recomendações
6. Considere fatores de risco e prognóstico
7. Forneça orientações práticas e aplicáveis
8. Mantenha consistência entre achados e recomendações

INSTRUÇÕES ESPECÍFICAS PARA IMPRESSÃO DIAGNÓSTICA:
9. FISIOPATOLOGIA: Explique detalhadamente os mecanismos biológicos envolvidos na formação e perpetuação da lesão, incluindo:
   - Processos inflamatórios (agudo vs crônico, mediadores envolvidos)
   - Alterações vasculares (perfusão, permeabilidade, angiogênese)
   - Metabolismo celular e tecidual (hipóxia, acidose, acúmulo de metabólitos)
   - Cascata de cicatrização (hemostasia, inflamação, proliferação, remodelação)
   - Fatores que interferem na cicatrização normal

10. CORRELAÇÃO CLÍNICA: Estabeleça conexões claras entre:
    - Achados visuais observados e conhecimento científico estabelecido
    - Apresentação atual e evolução temporal esperada
    - Fatores sistêmicos do paciente e manifestações locais
    - Sinais clínicos e processos fisiopatológicos subjacentes
    - Aspectos típicos e atípicos da apresentação

11. ANÁLISE DIAGNÓSTICA DETALHADA: Para cada diagnóstico, inclua:
    - Justificativa baseada em evidências específicas observadas
    - Análise diferencial com outras condições similares
    - Fatores que confirmam ou excluem diagnósticos alternativos
    - Grau de certeza diagnóstica com fundamentação
    - Implicações prognósticas e terapêuticas específicas

12. CONTEXTUALIZAÇÃO CLÍNICA: Considere sempre:
    - História clínica e fatores predisponentes
    - Comorbidades e seu impacto na cicatrização
    - Fatores ambientais e sociais relevantes
    - Tratamentos prévios e sua eficácia
    - Expectativas realistas de evolução

ANALISE A IMAGEM E GERE O LAUDO ESTRUTURADO EM JSON.
`;
};