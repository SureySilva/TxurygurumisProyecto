export interface Pattern {
  id?: number;
  title: string;
  subtitle: string;
  materials: Array<string>;
  abbreviations: Array<string>;
  description: string;
  imageUrl?: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  createdAt: Date;
}