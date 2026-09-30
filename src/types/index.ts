export interface Business {
  id: string;
  name: string;
  owner: string;
  category: string;
  description: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  hours: string;
  openTime: string;
  closeTime: string;
  openDays: number[];
  logo: string;
  cover: string;
  payments: string[];
  createdAt: string;
  goals: string[];
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice: number | null;
  category: string;
  photo: string;
  available: boolean;
}
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  startingPrice: boolean;
  duration: number;
  category: string;
  available: boolean;
}
export interface Diagnostic {
  id: string;
  date: string;
  answers: Record<string, number>;
  score: number;
  level: string;
}
export interface SecurityModule {
  id: string;
  title: string;
  icon: string;
  explanation: string;
  example: string;
  tip: string;
  checklist: string[];
}
export interface Analytics {
  id: string;
  type:
    | "profile_view"
    | "whatsapp_click"
    | "instagram_click"
    | "location_click"
    | "product_view"
    | "qr_generated";
  date: string;
  itemId?: string;
}
export interface Team {
  institution: string;
  subject: string;
  professor: string;
  className: string;
  name: string;
  members: string;
  community: string;
  period: string;
  objective: string;
}
export interface Intervention {
  date: string;
  initialScore: number;
  currentScore: number;
  profileCreated: boolean;
  productCount: number;
  serviceCount: number;
  qrGenerated: boolean;
  modulesCompleted: number;
  trainingScore: number | null;
}
export interface Consent {
  accepted: boolean;
  date: string;
  version: string;
}
export interface Appearance {
  primary: string;
  secondary: string;
  buttonStyle: "rounded" | "pill" | "square";
  theme: "minimal" | "modern" | "classic" | "vibrant";
  layout: "comfortable" | "compact";
}
export interface QuizResult {
  date: string;
  answers: boolean[];
  correct: number;
}
export interface AppState {
  version: 1;
  business: Business;
  products: Product[];
  services: Service[];
  diagnostics: Diagnostic[];
  diagnosticDraft: Record<string, number>;
  diagnosticStep: number;
  onboardingStep: number;
  appearance: Appearance;
  consent: Consent | null;
  analytics: Analytics[];
  securityCompleted: string[];
  quiz: QuizResult | null;
  quizDraft: boolean[];
  team: Team;
  qrGenerated: boolean;
  publicUrl: string;
  published: boolean;
  baseline: {
    site: boolean;
    catalog: boolean;
    social: boolean;
    security: boolean;
    qr: boolean;
  } | null;
  demo: boolean;
}
export type ColorMode = "light" | "dark" | "system";
