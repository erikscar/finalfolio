import { Component } from '@angular/core';
import { PortfolioCardComponent } from '../portfolio-card/portfolio-card.component';
import { CommonModule } from '@angular/common';
import { TechCardComponent } from '../tech-card/tech-card.component';
import { CommonButtonComponent } from "../common-button/common-button.component";


@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [PortfolioCardComponent, CommonModule, TechCardComponent, CommonButtonComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})

export class PortfolioComponent {
   switcher: string = "projects";

   }
