import { Component } from '@angular/core';
// Importación de las herramientas de navegación necesarias para el HTML
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',          // La etiqueta HTML que usarás en index.html (<app-root></app-root>)
  standalone: true,              // Indica que este componente es independiente (no necesita un @NgModule)
  imports: [                     // Aquí "inyectas" las utilidades que el HTML de este componente va a usar
    RouterOutlet,                // Permite mostrar las diferentes páginas (vistas)
    RouterLink,                  // Permite crear enlaces de navegación (como href)
    RouterLinkActive             // Permite aplicar estilos CSS automáticamente al enlace de la página actual
  ],
  templateUrl: './app.html',     // Ruta al archivo de estructura (HTML)
  styleUrl: './app.css'          // Ruta al archivo de estilos (CSS)
})
export class App { }             // Clase del componente (aquí iría la lógica si fuera necesaria)