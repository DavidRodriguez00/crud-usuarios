import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// Objeto de configuración principal de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    // --- CONFIGURACIÓN DEL ENRUTADOR ---
    provideRouter(
      routes, // Carga la definición de las rutas (páginas)
      withInMemoryScrolling({
        // Al navegar hacia atrás/adelante, la página vuelve a la posición de scroll donde estaba
        scrollPositionRestoration: 'enabled',
        // Permite que los enlaces internos (ej: #contacto) funcionen y desplacen la vista
        anchorScrolling: 'enabled'
      })
    ),

    // --- CLIENTE HTTP ---
    // Inyecta el servicio necesario para hacer peticiones a APIs externas (GET, POST, etc.)
    provideHttpClient()
  ]
};