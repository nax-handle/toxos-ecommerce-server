import { ReportVisitor } from './report-visitor.interface';

export interface Visitor {
  accept(visit: ReportVisitor);
}
