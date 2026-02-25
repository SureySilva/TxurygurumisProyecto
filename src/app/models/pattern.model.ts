export interface Pattern {
  id?: string;
  title: string;
  materials: string;
  description: string;
  imageUrl: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  createdAt: Date;
}