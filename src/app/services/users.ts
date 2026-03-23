import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación (Singleton)
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = 'https://peticiones.online/api/users';
  private readonly LS_KEY = 'usuarios_app_cache'; // Llave única para LocalStorage

  // 1. OBTENER TODOS: Descarga y sincroniza la caché
  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(response => {
        if (response.results) {
          // 'tap' permite ejecutar efectos secundarios sin alterar los datos
          localStorage.setItem(this.LS_KEY, JSON.stringify(response.results));
        }
      })
    );
  }

  // 2. OBTENER POR ID: Estrategia Híbrida (API + Local)
  getById(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        // Si la API falla o devuelve error, intentamos recuperar del LocalStorage
        if (response && response.error) {
          const localUser = this.getLocalUserById(id);
          if (localUser) return localUser;
          throw new Error(response.error);
        }
        // Normalizamos la respuesta (algunas APIs devuelven .results o .data)
        return response.results || response.data || response;
      })
    );
  }

  // 3. CREAR: Envía el nuevo usuario al servidor
  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // 4. ACTUALIZAR: Sincroniza API y LocalStorage
  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap(() => {
        const users = this.getLocalStorageUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          // Actualizamos solo el usuario modificado en nuestra lista local
          users[index] = { ...users[index], ...user };
          localStorage.setItem(this.LS_KEY, JSON.stringify(users));
        }
      })
    );
  }

  // 5. BORRAR: Limpieza total
  delete(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const users = this.getLocalStorageUsers();
        // Filtramos para quitar al usuario borrado de la caché
        const filtered = users.filter(u => u.id !== id);
        localStorage.setItem(this.LS_KEY, JSON.stringify(filtered));
      })
    );
  }

  // --- MÉTODOS DE APOYO (HELPER METHODS) ---

  // Obtiene la lista completa desde la memoria del navegador
  public getLocalStorageUsers(): User[] {
    const data = localStorage.getItem(this.LS_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Busca un usuario específico en la caché local
  private getLocalUserById(id: number): User | undefined {
    const users = this.getLocalStorageUsers();
    // Comparamos IDs (usando Number por si acaso vienen como string)
    return users.find(u => Number(u.id) === Number(id));
  }
}