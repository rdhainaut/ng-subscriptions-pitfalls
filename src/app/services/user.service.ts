import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Simule un appel HTTP lent (3 secondes pour laisser le temps de naviguer)
  getUserData(userId: number, componentName: string): Observable<any> {
    console.log(`🚀 [${componentName}] Appel HTTP démarré pour utilisateur ${userId}`);
    
    // Simule un appel réel vers une API
    return this.http.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .pipe(
        delay(3000), // Délai de 3 secondes pour laisser le temps de changer de page
        map(data => {
          console.log(`✅ [${componentName}] RÉPONSE HTTP reçue pour utilisateur ${userId} - ${(data as any).name}`);
          return data;
        })
      );
  }
}