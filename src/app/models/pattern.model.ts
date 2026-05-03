import { Timestamp } from "@angular/fire/firestore";

export interface Pattern {
  id?: string;
  title: string;
  subtitle: string;
  materials: Array<string>;
  abbreviations: Array<string>;
  description: string;
  imageUrl?: string;
  storagePath?: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  createdAt?: Timestamp;
}