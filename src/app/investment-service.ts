import { Injectable, signal } from '@angular/core';
import type { InvestmentInput } from './investment-input.model';
import type { InvestmentResult } from './investment-result.model';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  resultData = signal<InvestmentResult[] | undefined>(undefined);
  hasCalculated = signal<boolean>(false);

  calculateInvestmentResults(InvestmentData: InvestmentInput) {
    const { initialInvestment, annualInvestment, expectedReturn, duration } =
      InvestmentData;
    const annualData = [];
    let investmentValue = initialInvestment;

    for (let i = 0; i < duration; i++) {
      const year = i + 1;
      const interestEarnedInYear = investmentValue * (expectedReturn / 100);
      investmentValue += interestEarnedInYear + annualInvestment;
      const totalInterest =
        investmentValue - annualInvestment * year - initialInvestment;
      annualData.push({
        year: year,
        interest: interestEarnedInYear,
        valueEndOfYear: investmentValue,
        annualInvestment: annualInvestment,
        totalInterest: totalInterest,
        totalAmountInvested: initialInvestment + annualInvestment * year,
      });
    }

    this.resultData.set(annualData);
    this.hasCalculated.set(true);
  }

  resetCalculation() {
    this.hasCalculated.set(false);
  }
}
