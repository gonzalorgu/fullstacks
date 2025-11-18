import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-float',
  imports: [],
  templateUrl: './whatsapp-float.html',
  styleUrl: './whatsapp-float.scss'
})
export class WhatsappFloat {
  @Input() phoneNumber = '51905028403';
  @Input() message = 'Hola, estoy interesado en sus vestidos';
  @Input() text = '¿Te ayudo?';

  get whatsappUrl(): string {
    return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.message)}`;
  }
}