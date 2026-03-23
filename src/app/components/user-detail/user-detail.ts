import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetailComponent implements OnInit {
  // Inyección de servicios necesarios
  private usersService = inject(UsersService);
  private activatedRoute = inject(ActivatedRoute); // Para leer el ID de la URL
  private router = inject(Router);                 // Para navegar programáticamente
  private cdr = inject(ChangeDetectorRef);         // Para forzar el refresco de la vista

  user: User | undefined; // Variable que almacenará los datos del usuario

  constructor(private location: Location) { }

  ngOnInit(): void {
    // 1. Siempre subir al inicio de la página al entrar
    window.scrollTo(0, 0);

    // 2. Escuchar cambios en los parámetros de la URL (el :id)
    this.activatedRoute.params.subscribe((params) => {
      const id = Number(params['id']);

      // 3. Pedir al servicio los datos del usuario por su ID
      this.usersService.getById(id).subscribe({
        next: (user) => {
          this.user = user;
          // Forzamos a Angular a detectar que 'user' ya tiene datos
          this.cdr.detectChanges();
        },
        error: (err) => {
          // Si el usuario no existe, avisamos y volvemos al Home
          console.error('Error final:', err);
          alert('Lo sentimos, este usuario no existe en la base de datos.');
          this.router.navigate(['/home']);
        }
      });
    });
  }

  // Lógica para borrar al usuario desde su propia ficha de detalle
  deleteUser() {
    const idABorrar = this.user?.id;

    if (idABorrar) {
      if (confirm(`¿Seguro que quieres borrar a ${this.user?.first_name}?`)) {
        this.usersService.delete(idABorrar).subscribe({
          next: (response: any) => {
            alert(`Usuario eliminado correctamente.`);
            // Tras borrar, no podemos quedarnos en esta página, volvemos al listado
            this.router.navigate(['/home']);
          },
          error: (err) => {
            alert(err.error?.error || 'Error al intentar borrar el usuario');
          }
        });
      }
    }
  }

  // Navegación hacia atrás respetando el historial del navegador
  goBack(): void {
    this.location.back();
  }
}