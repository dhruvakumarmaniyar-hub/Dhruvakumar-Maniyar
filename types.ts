
export interface ReadmeConfig {
  projectName: string;
  repoUrl?: string;
  includeLicense: boolean;
  includeBadges: boolean;
  style: 'minimal' | 'comprehensive' | 'playful';
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  output: string;
}

export interface FileData {
  name: string;
  content: string;
}
