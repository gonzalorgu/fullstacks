import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Rental } from '../types/types';

@Component({
  selector: 'app-rental-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './rental-card.html',
  styleUrl: './rental-card.scss'
})
export class RentalCard {
  @Input({ required: true }) r!: Rental;
}