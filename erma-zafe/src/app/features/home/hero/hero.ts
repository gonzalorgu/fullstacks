import { CommonModule } from '@angular/common';
import { Component ,inject} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service/auth.service';

@Component({
  selector: 'app-hero',
  imports: [CommonModule,RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  private authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
}
