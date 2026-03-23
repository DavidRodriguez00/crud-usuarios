import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent implements OnInit {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  private usersService = inject(UsersService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);

  // --- PROPIEDADES DE ESTADO ---
  userForm: FormGroup;
  isUpdate: boolean = false;
  title: string = 'Nuevo Usuario';
  buttonText: string = 'Guardar';

  /** * Asset Fallback: Evita el error de "broken image" en la interfaz. 
   * Se utiliza si el campo 'image' está vacío o la URL es inválida.
   */
  defaultAvatar: string = 'https://www.istockphoto.com/es/fotos/avatar';

  constructor() {
    // Inicialización del modelo de datos reactivo
    this.userForm = new FormGroup({
      id: new FormControl(null),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      image: new FormControl('', [Validators.required]),
      password: new FormControl('12345', [Validators.required])
    });
  }

  ngOnInit() {
    // Observador de parámetros de ruta para determinar el modo (Create vs Update)
    this.activatedRoute.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.setUpdateMode(Number(userId));
      } else {
        this.setCreateMode();
      }
    });
  }

  /* LÓGICA DE INTERFAZ Y PREVISUALIZACIÓN */

  /**
   * Getter currentImage: Vinculado dinámicamente al [src] del avatar en el HTML.
   * Proporciona reactividad inmediata mientras el usuario escribe la URL.
   */
  get currentImage(): string {
    const url = this.userForm.get('image')?.value;
    return (url && url.trim() !== '') ? url : this.defaultAvatar;
  }

  /**
   * handleImageError: Método de rescate (Event Binding) para errores 404 de imagen.
   */
  handleImageError(event: any) {
    event.target.src = this.defaultAvatar;
  }

  /**
   * Prepara el formulario para la edición de un nodo existente.
   * @param id Identificador único del usuario.
   */
  private setUpdateMode(id: number) {
    this.isUpdate = true;
    this.title = 'Editar Usuario';
    this.buttonText = 'Actualizar Registro'; // Coincide con la clase .btn-edit-profile del CSS

    this.usersService.getById(id).subscribe({
      next: (response: any) => {
        // Normalización de la respuesta de la API (soporta .results o .data)
        const userData = response.results || response.data || response;
        if (response.error) {
          this.router.navigate(['/home']);
          return;
        }
        this.userForm.patchValue(userData);
      },
      error: () => this.router.navigate(['/home'])
    });
  }

  /**
   * Limpia el formulario para la creación de un nuevo bio-nodo.
   */
  private setCreateMode() {
    this.isUpdate = false;
    this.title = 'Nuevo Usuario';
    this.buttonText = 'Guardar Usuario';
    this.userForm.reset({ password: '12345' });
  }

  /* ACCIONES DE PERSISTENCIA (CRUD) */

  /**
   * Procesa el envío del formulario tras validación de seguridad.
   */
  onSubmit() {
    // Validación de integridad: marca todos los campos para mostrar errores visuales
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const userData: User = this.userForm.getRawValue();

    if (this.isUpdate) {
      // Flujo de Actualización
      this.usersService.update(userData).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => alert(err.error?.error || 'Error al actualizar')
      });
    } else {
      // Flujo de Creación (se elimina el ID para que la DB genere uno nuevo)
      const { id, ...newUser } = userData;
      this.usersService.create(newUser as User).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => alert(err.error?.error || 'Error al crear')
      });
    }
  }

  /**
   * Retorno seguro a la vista anterior (Bio-Command HUB).
   */
  goBack(): void {
    this.location.back();
  }
}