import { Component, Input } from '@angular/core';
import type { InvestmentResult } from '../investment-result.model';

@Component({
  selector: 'app-investment-results',
  standalone: true,
  imports: [],
  templateUrl: './investment-results.component.html',
  styleUrl: './investment-results.component.css',
})
export class InvestmentResultsComponent {
  @Input() results?: InvestmentResult[];
}
