export enum Tactic {
  Reconnaissance = "Reconnaissance",
  ResourceDevelopment = "Resource Development",
  InitialAccess = "Initial Access",
  Execution = "Execution",
  Persistence = "Persistence",
  PrivilegeEscalation = "Privilege Escalation",
  DefenseEvasion = "Defense Evasion",
  CredentialAccess = "Credential Access",
  Discovery = "Discovery",
  LateralMovement = "Lateral Movement",
  Collection = "Collection",
  CommandAndControl = "Command and Control",
  Exfiltration = "Exfiltration",
  Impact = "Impact"
}

export enum ConfidenceLevel {
  High = "High",
  Medium = "Medium",
  Low = "Low"
}

export interface MitreTechnique {
  id: string;
  name: string;
  subTechniqueId?: string;
  tactics: string[];
  confidence: string; // Using string to map from API response easily, can validate against enum
  reasoning: string;
  detection_suggestions?: string[];
}

export interface AnalysisResult {
  input_source?: string; // Added for bulk mapping context
  summary: string;
  mappings: MitreTechnique[];
  primary_tactic: string;
  overall_risk_score: number; // 0-100
}

export interface ExampleScenario {
  id: string;
  title: string;
  content: string;
}