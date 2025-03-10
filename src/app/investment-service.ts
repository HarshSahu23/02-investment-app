import { Injectable, signal } from '@angular/core';
import type { InvestmentInput } from './investment-input.model';
import type { InvestmentResult } from './investment-result.model';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  // resultData?: InvestmentResult[];
  resultData = signal<InvestmentResult[] | undefined>(undefined);
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
    console.log('Investment Data ');
    console.log(initialInvestment);
    console.log(annualInvestment);
    console.log(expectedReturn);
    console.log(duration);
    console.log('Annual Data');
    console.log(annualData);

    // this.resultData = annualData;
    this.resultData.set(annualData);
  }
}
