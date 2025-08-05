import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dangling-call-bad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="component-container">
      <h2>🔴 Composant AVEC souscription orpheline</h2>
      <p>Utilisateur actuel: {{ currentUserId }}</p>
      <p *ngIf="userData">Nom: {{ userData.name }}</p>
      <p *ngIf="userData">Email: {{ userData.email }}</p>
      <button (click)="loadUserData()" *ngIf="!userData">Charger utilisateur</button>
      <button (click)="loadNextUser()" *ngIf="userData">Charger utilisateur suivant</button>
      <p class="warning">⚠️ Ce composant ne fait PAS de takeUntil - regardez la console !</p>
      <div class="instructions">
        <h4>📋 Test de souscription orpheline:</h4>
        <ol>
          <li>Cliquez sur "Charger utilisateur"</li>
          <li>Naviguez immédiatement vers "Good Component"</li>
          <li>Observez dans la console que le callback HTTP s'exécute encore !</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .component-container {
      padding: 20px;
      border: 2px solid #ff4444;
      margin: 10px;
      background-color: #fff5f5;
      border-radius: 8px;
    }
    .warning {
      color: #ff4444;
      font-weight: bold;
    }
    .instructions {
      background-color: #ffe6e6;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
    button {
      background-color: #ff4444;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px 0;
    }
    button:hover {
      background-color: #cc3333;
    }
  `]
})
export class DanglingCallBadComponent implements OnInit, OnDestroy {
  userData: any = null;
  currentUserId = 1;
  private componentDestroyed = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    console.log(`🔴 DANGLING CALL BAD COMPONENT créé`);
  }

  ngOnDestroy() {
    this.componentDestroyed = true;
    console.log(`💀 DANGLING CALL BAD COMPONENT détruit`);
    console.log(`⚠️  ATTENTION: Souscription orpheline - HTTP callback va s'exécuter !`);
  }

  loadUserData() {
    // ❌ PROBLÈME: Pas de takeUntilDestroyed() ici !
    // Le callback continue de s'exécuter même après la destruction du composant
    this.userService.getUserData(this.currentUserId, 'DANGLING CALL BAD COMPONENT').subscribe({
      next: (data) => {
        if (this.componentDestroyed) {
          console.error(`🚨 ERREUR CRITIQUE ! DanglingCallBadComponent détruit mais callback exécuté !`);
          console.error(`💥 Tentative de mise à jour d'un composant détruit - ceci peut causer des erreurs !`);
          console.error(`📊 Données reçues:`, data);
          
          // Simuler une erreur réelle qui pourrait se produire
          try {
            this.userData = data; // Ceci pourrait causer des erreurs dans des cas réels
            console.error(`⚠️  Mutation d'état sur composant détruit - comportement indéfini !`);
          } catch (error) {
            console.error(`💀 Erreur lors de la mutation:`, error);
          }
        } else {
          console.log(`✅ [DANGLING CALL BAD COMPONENT] RÉPONSE HTTP reçue correctement`);
          this.userData = data;
        }
      },
      error: (error) => {
        console.error('❌ Erreur dans DanglingCallBadComponent:', error);
      }
    });
  }

  loadNextUser() {
    this.currentUserId++;
    this.userData = null;
    this.loadUserData();
  }
}