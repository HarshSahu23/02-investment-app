import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../investment-service';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.css',
})
export class UserInputComponent {
  private investmentService = inject(InvestmentService);
  private toastService = inject(ToastService);

  // Internal numeric values
  private initialInvestmentNumeric = signal(25000);
  private annualInvestmentNumeric = signal(100000);

  // Displayed formatted values
  enteredInitialInvestment = signal('25,000');
  enteredAnnualInvestment = signal('1,00,000');
  enteredExpectedReturn = signal('15');
  enteredDuration = signal('5');

  // Track invalid fields
  invalidFields = {
    initialInvestment: false,
    annualInvestment: false,
    expectedReturn: false,
    duration: false,
  };

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
    displayValueSignal: ReturnType<typeof signal<string>>,
    fieldName: keyof typeof this.invalidFields
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

    // Clear invalid state when field has valid value
    if (numericValue > 0) {
      this.invalidFields[fieldName] = false;
    }
  }

  // Input change handlers that use the shared logic
  onInitialInvestmentChange(event: Event): void {
    this.handleNumericInputChange(
      event,
      this.initialInvestmentNumeric,
      this.enteredInitialInvestment,
      'initialInvestment'
    );
  }

  onAnnualInvestmentChange(event: Event): void {
    this.handleNumericInputChange(
      event,
      this.annualInvestmentNumeric,
      this.enteredAnnualInvestment,
      'annualInvestment'
    );
  }

  onExpectedReturnChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    if (value > 0) {
      this.invalidFields.expectedReturn = false;
    }
  }

  onDurationChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    if (value > 0) {
      this.invalidFields.duration = false;
    }
  }

  validateInputs(): boolean {
    let isValid = true;

    // Check initial investment
    if (this.initialInvestmentNumeric() <= 0) {
      this.invalidFields.initialInvestment = true;
      isValid = false;
    }

    // Check annual investment
    if (this.annualInvestmentNumeric() <= 0) {
      this.invalidFields.annualInvestment = true;
      isValid = false;
    }

    // Check expected return
    if (+this.enteredExpectedReturn() <= 0) {
      this.invalidFields.expectedReturn = true;
      isValid = false;
    }

    // Check duration
    if (+this.enteredDuration() <= 0) {
      this.invalidFields.duration = true;
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    // Reset previous invalid field states
    this.resetValidation();

    if (this.validateInputs()) {
      this.investmentService.calculateInvestmentResults({
        initialInvestment: this.initialInvestmentNumeric(),
        annualInvestment: this.annualInvestmentNumeric(),
        expectedReturn: +this.enteredExpectedReturn(),
        duration: +this.enteredDuration(),
      });
    } else {
      this.toastService.showToast('Invalid/Missing Value Entered', 'error');
    }
  }

  resetValidation() {
    Object.keys(this.invalidFields).forEach((key) => {
      this.invalidFields[key as keyof typeof this.invalidFields] = false;
    });
  }

  onClear() {
    // Reset the layout by setting hasCalculated to false
    this.investmentService.resetCalculation();

    // Reset internal numeric values
    this.initialInvestmentNumeric.set(0);
    this.annualInvestmentNumeric.set(0);

    // Reset display values
    this.enteredInitialInvestment.set('');
    this.enteredAnnualInvestment.set('');
    this.enteredExpectedReturn.set('');
    this.enteredDuration.set('');

    // Reset validation states
    this.resetValidation();
  }
}
