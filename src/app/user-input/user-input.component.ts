import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../investment-service';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.css',
})
export class UserInputComponent {
  constructor(private investmentService: InvestmentService) {}

  // Internal numeric values
  private initialInvestmentNumeric = signal(0);
  private annualInvestmentNumeric = signal(0);

  // Displayed formatted values
  enteredInitialInvestment = signal('0');
  enteredAnnualInvestment = signal('0');
  enteredExpectedReturn = signal('10');
  enteredDuration = signal('5');

  // Convert number to formatted display string
  private getDisplayValue(value: number): string {
    if (isNaN(value) || value === 0) return '0';

    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      useGrouping: true,
      maximumFractionDigits: 0,
    }).format(value);
  }

  // Handle numeric input field changes
  handleNumericInputChange(
    event: Event,
    internalValueSignal: ReturnType<typeof signal<number>>,
    displayValueSignal: ReturnType<typeof signal<string>>
  ): void {
    const inputValue = (event.target as HTMLInputElement).value;
    // Remove non-numeric characters except digits
    const cleanValue = inputValue.replace(/[^\d]/g, '');

    // Parse to number, default to 0 if invalid
    const numericValue = parseInt(cleanValue) || 0;

    // Update internal numeric value
    internalValueSignal.set(numericValue);

    // Update display value with proper formatting
    displayValueSignal.set(this.getDisplayValue(numericValue));
  }

  // Input change handlers that use the shared logic
  onInitialInvestmentChange(event: Event): void {
    this.handleNumericInputChange(
      event,
      this.initialInvestmentNumeric,
      this.enteredInitialInvestment
    );
  }

  onAnnualInvestmentChange(event: Event): void {
    this.handleNumericInputChange(
      event,
      this.annualInvestmentNumeric,
      this.enteredAnnualInvestment
    );
  }

  onSubmit() {
    this.investmentService.calculateInvestmentResults({
      initialInvestment: this.initialInvestmentNumeric(),
      annualInvestment: this.annualInvestmentNumeric(),
      expectedReturn: +this.enteredExpectedReturn(),
      duration: +this.enteredDuration(),
    });
  }
}
