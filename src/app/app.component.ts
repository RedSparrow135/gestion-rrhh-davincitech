import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Para manejar las rutas

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // Usamos RouterOutlet para cargar las rutas
  template: `

      <router-outlet></router-outlet> <!-- Aquí se cargarán los componentes de las rutas -->

  `,
})
export class AppComponent {}
