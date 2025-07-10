import { Route } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { RequerimientosComponent } from './Components/requerimientos/requerimientos.component';
import { CandidatosComponent } from './Components/candidatos/candidatos.component';
import { ContratacionesComponent } from './Components/contrataciones/contrataciones.component';
import { UsuariosComponent } from './Components/usuarios/usuarios.component';
import { DepartamentosComponent } from './Components/departamentos/departamentos.component';
import { PuestosComponent } from './Components/puestos/puestos.component';

export const routes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'requerimientos', component: RequerimientosComponent },
  { path: 'candidatos', component: CandidatosComponent },
  { path: 'contrataciones', component: ContratacionesComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'departamentos', component: DepartamentosComponent },
  { path: 'puestos', component: PuestosComponent },
];
