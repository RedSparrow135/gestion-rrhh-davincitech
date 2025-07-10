import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes'; // Asegúrate de que el archivo de rutas esté bien importado
import { DashboardComponent } from './app/Components/dashboard/dashboard.component';
import { RequerimientosComponent } from './app/Components/requerimientos/requerimientos.component';
import { CandidatosComponent } from './app/Components/candidatos/candidatos.component';
import { ContratacionesComponent } from './app/Components/contrataciones/contrataciones.component';
import { UsuariosComponent } from './app/Components/usuarios/usuarios.component';
import { DepartamentosComponent } from './app/Components/departamentos/departamentos.component';
import { PuestosComponent } from './app/Components/puestos/puestos.component';
import { CommonModule } from '@angular/common';

// Componente raíz
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule.forRoot(routes) // Configuramos las rutas
    ),
  ],
})
  .catch((err) => console.error(err));
