import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { InvestmentResultsComponent } from './investment-results/investment-results.component';
import { InvestmentService } from './investment-service';
import { ToastComponent } from './shared/toast/toast.component';
import { UserInputComponent } from './user-input/user-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CommonModule,
    HeaderComponent,
    UserInputComponent,
    InvestmentResultsComponent,
    ToastComponent,
  ],
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private investmentService = inject(InvestmentService);
  hasCalculated = this.investmentService.hasCalculated;
}
