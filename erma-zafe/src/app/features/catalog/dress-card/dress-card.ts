import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dress } from '../types/types.js';

@Component({
  selector: 'app-dress-card',
  imports: [RouterLink,CommonModule,],
  templateUrl: './dress-card.html',
  styleUrl: './dress-card.scss'
})
export class DressCard {
  @Input() dress!: Dress;
}
