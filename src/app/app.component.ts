import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './Models/Usuario.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { nombre: '', email: '', empresa: '' }; // Modelo para el nuevo usuario
  usuarioAModificar: Usuario | null = null; // Modelo para el usuario a modificar
  idModificar: number = 0; // ID del usuario a modificar
  idEliminar: number = 0; // ID del usuario a eliminar

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          nombre: user.name,
          email: user.email,
          empresa: user.company.name
        }));
      });
  }

  agregarUsuario() {
    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post('https://jsonplaceholder.typicode.com/users', body)
      .subscribe(response => {
        console.log('Usuario agregado:', response);
        this.usuarios.push(this.nuevoUsuario);
        this.nuevoUsuario = { nombre: '', email: '', empresa: '' };
      });
  }

  // Método para cargar usuario por ID para modificar
  cargarUsuario(id: number) {
    this.http.get<any>(`https://jsonplaceholder.typicode.com/users/${id}`)
      .subscribe(data => {
        this.usuarioAModificar = {
          nombre: data.name,
          email: data.email,
          empresa: data.company.name
        };
      });
  }

  // Método para modificar un usuario localmente (PUT simulado)
  modificarUsuario() {
    if (this.usuarioAModificar && this.idModificar > 0) {
      const usuarioIndex = this.usuarios.findIndex((usuario, index) => index === this.idModificar - 1);
      if (usuarioIndex !== -1) {
        this.usuarios[usuarioIndex] = { ...this.usuarioAModificar }; // Actualizar usuario en la lista local
        console.log('Usuario modificado localmente:', this.usuarios[usuarioIndex]);
        this.usuarioAModificar = null; // Limpiar el formulario
      } else {
        console.log('Usuario no encontrado');
      }
    }
  }

  // Método para eliminar un usuario localmente (DELETE simulado)
  eliminarUsuario() {
    if (this.idEliminar > 0) {
      this.usuarios = this.usuarios.filter((usuario, index) => index !== this.idEliminar - 1);
      console.log('Usuario eliminado localmente:', this.usuarios);
      this.idEliminar = 0; // Limpiar el ID
    } else {
      console.log('ID no válido');
    }
  }
}
