import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de importar HttpClientModule

@Component({
  selector: 'app-requerimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Agrega HttpClientModule aquí
  templateUrl: './requerimientos.component.html',
  styleUrls: ['./requerimientos.component.css'],
})
export class RequerimientosComponent implements OnInit {
  requerimientos: any[] = [];
  requerimiento: any = { departamento: '', puesto: '', cantidad: '', fecha_solicitud: '', fecha_requerida: '', estado: '' };
  loading: boolean = false;
  errorMessage: string = '';
  searchQuery: string = '';
  showModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRequerimientos();
  }

  // Función para obtener los requerimientos desde el back-end
  getRequerimientos(query: string = ''): void {
    this.loading = true;
    let searchUrl = 'http://localhost:8080/api/requerimientos';

    if (query) {
      searchUrl += `?search=${query}`;
    }

    this.http.get<any[]>(searchUrl)
      .subscribe(
        (data) => {
          this.requerimientos = data;
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Error de conexión con el backend.';
          this.loading = false;
        }
      );
  }

  // Función para abrir el modal de edición o creación de requerimiento
  openModal(mode: 'create' | 'edit', requerimiento: any = null): void {
    this.modalMode = mode;
    if (mode === 'edit' && requerimiento) {
      this.requerimiento = { ...requerimiento };
    } else {
      this.requerimiento = { departamento: '', puesto: '', cantidad: '', fecha_solicitud: '', fecha_requerida: '', estado: '' };
    }
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }

  // Función para guardar o actualizar el requerimiento
  saveRequerimiento(): void {
    if (this.requerimiento.id) {
      this.http.put(`http://localhost:8080/api/requerimientos/${this.requerimiento.id}`, this.requerimiento)
        .subscribe(
          () => {
            this.getRequerimientos();
            this.closeModal();
          },
          (error) => {
            this.errorMessage = 'Error al actualizar el requerimiento.';
          }
        );
    } else {
      this.http.post('http://localhost:8080/api/requerimientos', this.requerimiento)
        .subscribe(
          () => {
            this.getRequerimientos();
            this.closeModal();
          },
          (error) => {
            this.errorMessage = 'Error al insertar el requerimiento.';
          }
        );
    }
  }

  // Función para eliminar un requerimiento
  deleteRequerimiento(id: number): void {
    this.http.delete(`http://localhost:8080/api/requerimientos/${id}`)
      .subscribe(
        () => {
          this.getRequerimientos();
        },
        (error) => {
          this.errorMessage = 'Error al eliminar el requerimiento.';
        }
      );
  }

  // Función de búsqueda
  searchRequerimientos(): void {
    this.getRequerimientos(this.searchQuery);
  }
}
