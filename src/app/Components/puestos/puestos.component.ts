import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de importar esto
import { Router } from '@angular/router';

@Component({
  selector: 'app-puestos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Asegúrate de incluir el HttpClientModule
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css'],
})
export class PuestosComponent implements OnInit {
  puestos: any[] = [];
  puesto: any = { nombre: '', descripcion: '' }; // Objeto para insertar o editar
  loading: boolean = false;
  errorMessage: string = '';
  showModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  searchQuery: string = ''; // Query for searching

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getPuestos();
  }

  // Función para obtener los puestos desde el back-end
  getPuestos(query: string = ''): void {
    this.loading = true;
    let searchUrl = 'http://localhost:8080/api/puestos';

    if (query) {
      searchUrl += `?search=${query}`;
    }

    this.http.get<any[]>(searchUrl).subscribe(
      (data) => {
        this.puestos = data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error de conexión con el backend.';
        this.loading = false;
      }
    );
  }

  // Función para abrir el modal de edición o creación de puesto
  openModal(mode: 'create' | 'edit', puesto: any = null): void {
    this.modalMode = mode;
    if (mode === 'edit' && puesto) {
      this.puesto = { ...puesto };
    } else {
      this.puesto = { nombre: '', descripcion: '' }; // Nuevo puesto
    }
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }

  // Función para guardar o actualizar el puesto
  savePuesto(): void {
    if (this.puesto.id) {
      // Editar
      this.http.put(`http://localhost:8080/api/puestos/${this.puesto.id}`, this.puesto).subscribe(
        () => {
          this.getPuestos();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al actualizar el puesto.';
        }
      );
    } else {
      // Insertar
      this.http.post('http://localhost:8080/api/puestos', this.puesto).subscribe(
        () => {
          this.getPuestos();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al insertar el puesto.';
        }
      );
    }
  }

  // Función para eliminar un puesto
  deletePuesto(id: number): void {
    this.http.delete(`http://localhost:8080/api/puestos/${id}`).subscribe(
      () => {
        this.getPuestos();
      },
      (error) => {
        this.errorMessage = 'Error al eliminar el puesto.';
      }
    );
  }

  volver() {
    this.router.navigate(['/dashboard']);  // Cambia '/dashboard' por la ruta deseada
  }
  // Función de búsqueda
  searchPuestos(): void {
    this.getPuestos(this.searchQuery);
  }
}
