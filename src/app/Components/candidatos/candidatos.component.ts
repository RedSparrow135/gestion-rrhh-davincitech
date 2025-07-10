import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // Importar HttpClientModule

@Component({
  selector: 'app-candidatos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Añadir HttpClientModule en los imports
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css'],
})
export class CandidatosComponent implements OnInit {
  candidatos: any[] = [];
  candidato: any = { nombre: '', correo: '', telefono: '', cv_url: '', estado: '' };
  loading: boolean = false;
  errorMessage: string = '';
  showModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  searchQuery: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCandidatos();
  }

  // Función para obtener los candidatos desde el back-end
  getCandidatos(query: string = ''): void {
    this.loading = true;
    let searchUrl = 'http://localhost:8080/api/candidatos';

    if (query) {
      searchUrl += `?search=${query}`;
    }

    this.http.get<any[]>(searchUrl).subscribe(
      (data) => {
        this.candidatos = data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error de conexión con el backend.';
        this.loading = false;
      }
    );
  }

  // Función para abrir el modal de edición o creación de candidato
  openModal(mode: 'create' | 'edit', candidato: any = null): void {
    this.modalMode = mode;
    if (mode === 'edit' && candidato) {
      this.candidato = { ...candidato };
    } else {
      this.candidato = { nombre: '', correo: '', telefono: '', cv_url: '', estado: '' };
    }
    this.showModal = true;
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }

  // Función para guardar o actualizar el candidato
  saveCandidato(): void {
    if (this.candidato.id) {
      // Editar
      this.http.put(`http://localhost:8080/api/candidatos/${this.candidato.id}`, this.candidato).subscribe(
        () => {
          this.getCandidatos();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al actualizar el candidato.';
        }
      );
    } else {
      // Insertar
      this.http.post('http://localhost:8080/api/candidatos', this.candidato).subscribe(
        () => {
          this.getCandidatos();
          this.closeModal();
        },
        (error) => {
          this.errorMessage = 'Error al insertar el candidato.';
        }
      );
    }
  }

  // Función para eliminar un candidato
  deleteCandidato(id: number): void {
    this.http.delete(`http://localhost:8080/api/candidatos/${id}`).subscribe(
      () => {
        this.getCandidatos();
      },
      (error) => {
        this.errorMessage = 'Error al eliminar el candidato.';
      }
    );
  }

  // Función de búsqueda
  searchCandidatos(): void {
    this.getCandidatos(this.searchQuery);
  }
}
