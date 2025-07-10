import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de importar esto

@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Asegúrate de incluir el HttpClientModule
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css'],
})
export class DepartamentosComponent implements OnInit {
  departamentos: any[] = [];
  departamento: any = { nombre: '', estado: 'Activo' }; // Objeto para insertar o editar
  loading: boolean = false;
  errorMessage: string = '';
  showModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  searchQuery: string = ''; // Query for searching

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getDepartamentos();
  }

  // Función para obtener los departamentos desde el back-end
  getDepartamentos(query: string = ''): void {
    this.loading = true;
    let searchUrl = 'http://localhost:8080/api/departamentos';

    if (query) {
      searchUrl += `?search=${query}`;
    }

    this.http.get<any[]>(searchUrl).subscribe(
      (data) => {
        this.departamentos = data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error de conexión con el backend.';
        this.loading = false;
      }
    );
  }

  // Función para abrir el modal de edición o creación de departamento
  openModal(mode: 'create' | 'edit', departamento: any = null): void {
    this.modalMode = mode;
    if (mode === 'edit' && departamento) {
      this.departamento = { ...departamento };
    } else {
      this.departamento = { nombre: '', estado: 'Activo' }; // Nuevo departamento
    }
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }

  // Función para guardar o actualizar el departamento
  saveDepartamento(): void {
    if (this.departamento.id) {
      // Editar
      this.http.put(`http://localhost:8080/api/departamentos/${this.departamento.id}`, this.departamento).subscribe(
        () => {
          this.getDepartamentos();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al actualizar el departamento.';
        }
      );
    } else {
      // Insertar
      this.http.post('http://localhost:8080/api/departamentos', this.departamento).subscribe(
        () => {
          this.getDepartamentos();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al insertar el departamento.';
        }
      );
    }
  }

  // Función para eliminar un departamento
  deleteDepartamento(id: number): void {
    this.http.delete(`http://localhost:8080/api/departamentos/${id}`).subscribe(
      () => {
        this.getDepartamentos();
      },
      (error) => {
        this.errorMessage = 'Error al eliminar el departamento.';
      }
    );
  }

  // Función de búsqueda
  searchDepartamentos(): void {
    this.getDepartamentos(this.searchQuery);
  }
}
