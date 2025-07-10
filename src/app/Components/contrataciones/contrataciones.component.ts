import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de importar esto

@Component({
  selector: 'app-contrataciones',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Asegúrate de incluir el HttpClientModule
  templateUrl: './contrataciones.component.html',
  styleUrls: ['./contrataciones.component.css'],
})
export class ContratacionesComponent implements OnInit {
  contrataciones: any[] = [];
  contratacion: any = { id_candidato: '', id_puesto: '', fecha_contratacion: '', tipo_contrato: '', salario: '', estado: '' };
  loading: boolean = false;
  errorMessage: string = '';
  showModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  searchQuery: string = ''; // Query for searching

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getContrataciones();
  }

  // Función para obtener las contrataciones desde el back-end
  getContrataciones(query: string = ''): void {
    this.loading = true;
    let searchUrl = 'http://localhost:8080/api/contrataciones';

    if (query) {
      searchUrl += `?search=${query}`;
    }

    this.http.get<any[]>(searchUrl).subscribe(
      (data) => {
        this.contrataciones = data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error de conexión con el backend.';
        this.loading = false;
      }
    );
  }

  // Función para abrir el modal de edición o creación de contratacion
  openModal(mode: 'create' | 'edit', contratacion: any = null): void {
    this.modalMode = mode;
    if (mode === 'edit' && contratacion) {
      this.contratacion = { ...contratacion };
    } else {
      this.contratacion = { id_candidato: '', id_puesto: '', fecha_contratacion: '', tipo_contrato: '', salario: '', estado: '' }; // Nuevo contratacion
    }
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }

  // Función para guardar o actualizar la contratacion
  saveContratacion(): void {
    if (this.contratacion.id) {
      // Editar
      this.http.put(`http://localhost:8080/api/contrataciones/${this.contratacion.id}`, this.contratacion).subscribe(
        () => {
          this.getContrataciones();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al actualizar la contratacion.';
        }
      );
    } else {
      // Insertar
      this.http.post('http://localhost:8080/api/contrataciones', this.contratacion).subscribe(
        () => {
          this.getContrataciones();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al insertar la contratacion.';
        }
      );
    }
  }

  // Función para eliminar una contratacion
  deleteContratacion(id: number): void {
    this.http.delete(`http://localhost:8080/api/contrataciones/${id}`).subscribe(
      () => {
        this.getContrataciones();
      },
      (error) => {
        this.errorMessage = 'Error al eliminar la contratacion.';
      }
    );
  }

  // Función de búsqueda
  searchContrataciones(): void {
    this.getContrataciones(this.searchQuery);
  }
}
