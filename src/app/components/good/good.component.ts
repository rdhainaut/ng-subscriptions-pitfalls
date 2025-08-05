import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-good',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="component-container">
      <h2>✅ Composant SANS souscription orpheline</h2>
      <p>Utilisateur actuel: {{ currentUserId }}</p>
      <p *ngIf="userData">Nom: {{ userData.name }}</p>
      <p *ngIf="userData">Email: {{ userData.email }}</p>
      <button (click)="loadUserData()" *ngIf="!userData">Charger utilisateur</button>
      <button (click)="loadNextUser()" *ngIf="userData">Charger utilisateur suivant</button>
      <p class="success">✅ Ce composant utilise takeUntilDestroyed() - Angular 16+</p>
      <div class="instructions">
        <h4>📋 Test sans souscription orpheline:</h4>
        <ol>
          <li>Cliquez sur "Charger utilisateur"</li>
          <li>Naviguez immédiatement vers "Bad Component"</li>
          <li>Observez dans la console que le callback HTTP ne s'exécute pas !</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .component-container {
      padding: 20px;
      border: 2px solid #44aa44;
      margin: 10px;
      background-color: #f5fff5;
      border-radius: 8px;
    }
    .success {
      color: #44aa44;
      font-weight: bold;
    }
    .instructions {
      background-color: #e6ffe6;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
    button {
      background-color: #44aa44;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;  
      margin: 10px 0;
    }
    button:hover {
      background-color: #339933;
    }
  `]
})
export class GoodComponent implements OnInit, OnDestroy {
  userData: any = null;
  currentUserId = 1;
  private takeUntilDestroyed = takeUntilDestroyed();
  private componentDestroyed = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    console.log(`✅ GOOD COMPONENT créé`);
  }

  ngOnDestroy() {
    this.componentDestroyed = true;
    console.log(`💀 GOOD COMPONENT détruit`);
    console.log(`✅ Souscription automatiquement arrêtée avec takeUntilDestroyed()`);
  }

  loadUserData() {
    // ✅ SOLUTION: Utilisation de takeUntilDestroyed()
    // La souscription s'arrête automatiquement à la destruction du composant
    this.userService.getUserData(this.currentUserId, 'GOOD COMPONENT')
      .pipe(this.takeUntilDestroyed)
      .subscribe({
        next: (data) => {
          if (this.componentDestroyed) {
            // Ceci ne devrait JAMAIS se produire grâce à takeUntilDestroyed
            console.error(`💥 ERREUR INATTENDUE ! GoodComponent callback exécuté après destruction !`);
          } else {
            console.log(`✅ [GOOD COMPONENT] RÉPONSE HTTP reçue correctement`);
            this.userData = data;
          }
        },
        error: (error) => {
          console.error('❌ Erreur dans GoodComponent:', error);
        }
      });
  }

  loadNextUser() {
    this.currentUserId++;
    this.userData = null;
    this.loadUserData();
  }
}