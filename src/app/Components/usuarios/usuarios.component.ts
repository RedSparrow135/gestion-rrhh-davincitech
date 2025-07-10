import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de importar esto

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Asegúrate de incluir el HttpClientModule
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuario: any = { nombre: '', correo_electronico: '', password: '', estado: 'Activo' };
  loading: boolean = false;
  errorMessage: string = '';
  showModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  searchQuery: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  // Función para obtener los usuarios desde el back-end
  getUsuarios(query: string = ''): void {
    this.loading = true;
    let searchUrl = 'http://localhost:8080/api/usuarios';

    if (query) {
      searchUrl += `?search=${query}`;
    }

    this.http.get<any[]>(searchUrl).subscribe(
      (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error de conexión con el backend.';
        this.loading = false;
      }
    );
  }

  // Función para abrir el modal de edición o creación de usuario
  openModal(mode: 'create' | 'edit', usuario: any = null): void {
    this.modalMode = mode;
    if (mode === 'edit' && usuario) {
      this.usuario = { ...usuario };
    } else {
      this.usuario = { nombre: '', correo_electronico: '', password: '', estado: 'Activo' }; // Nuevo usuario
    }
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }

  // Función para guardar o actualizar el usuario
  saveUsuario(): void {
    if (this.usuario.id) {
      // Editar
      this.http.put(`http://localhost:8080/api/usuarios/${this.usuario.id}`, this.usuario).subscribe(
        () => {
          this.getUsuarios();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al actualizar el usuario.';
        }
      );
    } else {
      // Insertar
      this.http.post('http://localhost:8080/api/usuarios', this.usuario).subscribe(
        () => {
          this.getUsuarios();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al insertar el usuario.';
        }
      );
    }
  }

  // Función para eliminar un usuario
  deleteUsuario(id: number): void {
    this.http.delete(`http://localhost:8080/api/usuarios/${id}`).subscribe(
      () => {
        this.getUsuarios();
      },
      (error) => {
        this.errorMessage = 'Error al eliminar el usuario.';
      }
    );
  }

  // Función de búsqueda
  searchUsuarios(): void {
    this.getUsuarios(this.searchQuery);
  }
}
