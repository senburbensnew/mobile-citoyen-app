import FiscalYear from "./FiscalYear";

export default interface FiscalState {
  fiscalYears: FiscalYear[];
  currentFiscalYear: FiscalYear | null;
}
