import { CategoryResult } from './category-result';

export interface ProcessResult {
  timestamp: string;
  categories: CategoryResult[];
}
