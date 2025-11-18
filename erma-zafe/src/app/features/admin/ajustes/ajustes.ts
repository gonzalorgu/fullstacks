import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Horario {
  dia: string;
  abierto: boolean;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-ajustes',
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustes.html',
  styleUrls: ['./ajustes.scss']
})
export class Ajustes {
  nombre = signal('Erma Zafe');
  correo = signal('contacto@ermazafe.com');
  telefono = signal('+51 999111222');
  direccion = signal('Av. Principal 123, Lima, Perú');
  depositoPorcentaje = signal(20);
  msg = signal<string | null>(null);

  horas = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  horarios = signal<Horario[]>([
    { dia: 'Monday', abierto: true, horaInicio: '08:00', horaFin: '18:00' },
    { dia: 'Tuesday', abierto: true, horaInicio: '08:00', horaFin: '18:00' },
    { dia: 'Thusresday', abierto: true, horaInicio: '08:00', horaFin: '18:00' },
    { dia: 'Sunday', abierto: false, horaInicio: '08:00', horaFin: '18:00' }
  ]);

  onNombre(e: Event) {
    this.nombre.set((e.target as HTMLInputElement).value);
  }

  onCorreo(e: Event) {
    this.correo.set((e.target as HTMLInputElement).value);
  }

  onTelefono(e: Event) {
    this.telefono.set((e.target as HTMLInputElement).value);
  }

  onDireccion(e: Event) {
    this.direccion.set((e.target as HTMLInputElement).value);
  }

  onDeposito(e: Event) {
    this.depositoPorcentaje.set(Number((e.target as HTMLInputElement).value));
  }

  toggleDia(day: Horario) {
    day.abierto = !day.abierto;
    this.horarios.set([...this.horarios()]);
  }

  guardar() {
    console.log('Guardando configuración:', {
      nombre: this.nombre(),
      correo: this.correo(),
      telefono: this.telefono(),
      direccion: this.direccion(),
      horarios: this.horarios(),
      deposito: this.depositoPorcentaje()
    });

    this.msg.set('✅ Cambios guardados correctamente');
    setTimeout(() => this.msg.set(null), 3000);
  }
}