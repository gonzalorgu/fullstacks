import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { Featured } from '../featured/featured';
import { Cta } from '../cta/cta';

@Component({
  selector: 'app-home.page',
  imports: [Hero, Featured, Cta],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {}