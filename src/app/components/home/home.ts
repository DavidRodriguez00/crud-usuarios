import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersService } from '../../services/users';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  // Inyección de dependencias moderna (sin usar constructor)
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef); // Herramienta para forzar el refresco de la UI

  users: User[] = [];           // Fuente de verdad (todos los usuarios)
  filteredUsers: User[] = [];   // Lo que realmente se muestra (lista filtrada)

  ngOnInit(): void {
    // Asegura que la página empiece arriba al cargar
    window.scrollTo(0, 0);

    // 1. CARGA INICIAL (Caché): Intenta mostrar datos locales para que la UI no esté vacía
    const localData = this.usersService.getLocalStorageUsers() || [];
    this.users = localData;
    this.filteredUsers = [...localData];

    // 2. CARGA DESDE API: Actualiza los datos con información fresca del servidor
    this.usersService.getAll().subscribe({
      next: (response: any) => {
        const apiUsers = response.results || [];
        this.users = apiUsers;
        this.filteredUsers = [...apiUsers];
        // Notifica a Angular que los datos cambiaron para que renderice la lista
        this.cdr.detectChanges();
      }
    });
  }

  // Lógica del buscador en tiempo real
  onSearch(event: Event) {
    const element = event.target as HTMLInputElement;
    const query = element.value.toLowerCase().trim();

    if (!query) {
      // Si el buscador está vacío, restauramos la lista completa
      this.filteredUsers = [...this.users];
    } else {
      // Filtra por múltiples campos: Nombre, Apellido, Usuario o Email
      this.filteredUsers = this.users.filter(user =>
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
    this.cdr.detectChanges();
  }

  // Lógica de eliminación
  deleteUser(id: number | undefined) {
    if (id === undefined) return;

    if (confirm('¿Deseas borrar al usuario?')) {
      this.usersService.delete(id).subscribe({
        next: (response) => {
          // Eliminación reactiva: quitamos al usuario de ambos arrays localmente
          this.users = this.users.filter(u => u.id !== id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== id);

          this.cdr.detectChanges();
        },
        error: (err) => {
          // Manejo de errores básico si el servidor rechaza la petición
          alert(err.error?.error || 'Error al intentar borrar el usuario');
        }
      });
    }
  }
}