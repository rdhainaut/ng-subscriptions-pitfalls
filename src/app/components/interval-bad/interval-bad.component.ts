import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'app-interval-bad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="component-container">
      <h2>🔴 Composant AVEC fuite mémoire d'intervalle</h2>
      <div class="counter-display">
        <h3>Compteur: {{ counter }}</h3>
        <p class="last-update">Dernière mise à jour: {{ lastUpdate | date:'HH:mm:ss.SSS' }}</p>
      </div>
      
      <div class="controls">
        <button (click)="startInterval()" [disabled]="isRunning">
          {{ isRunning ? 'Intervalle en cours...' : 'Démarrer intervalle' }}
        </button>
        <button (click)="stopInterval()" [disabled]="!isRunning">
          Arrêter intervalle
        </button>
      </div>

      <div class="status">
        <p [class]="isRunning ? 'running' : 'stopped'">
          Statut: {{ isRunning ? '🟢 EN COURS' : '🔴 ARRÊTÉ' }}
        </p>
      </div>

      <p class="warning">⚠️ Ce composant ne fait PAS de takeUntilDestroyed - l'intervalle continue après destruction !</p>
      
      <div class="instructions">
        <h4>📋 Test de fuite mémoire d'intervalle:</h4>
        <ol>
          <li>Cliquez sur "Démarrer intervalle"</li>
          <li>Observez le compteur qui s'incrémente chaque seconde</li>
          <li>Naviguez vers "Interval Good Component" pendant que l'intervalle est actif</li>
          <li>Regardez la console : l'intervalle continue de tourner ! 🚨</li>
          <li>Revenez ici : le compteur a continué de s'incrémenter</li>
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
      min-height: 400px;
    }
    
    .counter-display {
      text-align: center;
      padding: 20px;
      background-color: #ffe6e6;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .counter-display h3 {
      font-size: 2.5em;
      margin: 0;
      color: #ff4444;
      font-weight: bold;
    }
    
    .last-update {
      font-size: 0.9em;
      color: #666;
      margin: 10px 0 0 0;
    }
    
    .controls {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin: 20px 0;
    }
    
    .controls button {
      background-color: #ff4444;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .controls button:hover:not(:disabled) {
      background-color: #cc3333;
    }
    
    .controls button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .status {
      text-align: center;
      margin: 20px 0;
    }
    
    .status p {
      font-size: 1.2em;
      font-weight: bold;
      padding: 10px;
      border-radius: 5px;
    }
    
    .status .running {
      background-color: #d4edda;
      color: #155724;
    }
    
    .status .stopped {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    .warning {
      color: #ff4444;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
    }
    
    .instructions {
      background-color: #ffe6e6;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
    
    .instructions h4 {
      margin-top: 0;
    }
  `]
})
export class IntervalBadComponent implements OnInit, OnDestroy {
  counter = 0;
  lastUpdate = new Date();
  isRunning = false;
  private componentDestroyed = false;

  constructor() {}

  ngOnInit() {
    console.log(`🔴 INTERVAL BAD COMPONENT créé`);
  }

  ngOnDestroy() {
    this.componentDestroyed = true;
    console.log(`💀 INTERVAL BAD COMPONENT détruit`);
    if (this.isRunning) {
      console.log(`⚠️  ATTENTION: Fuite mémoire - l'intervalle continue de tourner !`);
      console.log(`🚨 L'intervalle va continuer à s'exécuter en arrière-plan !`);
    }
  }

  startInterval() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`🔴 [INTERVAL BAD] Démarrage de l'intervalle`);
    
    // ❌ PROBLÈME: Pas de takeUntilDestroyed() ici !
    // L'intervalle continue de s'exécuter même après la destruction du composant
    interval(1000).subscribe({
      next: (value) => {
        if (this.componentDestroyed) {
          console.error(`🚨 FUITE MÉMOIRE ! Intervalle s'exécute sur composant détruit !`);
          console.error(`💥 Tentative de mise à jour d'un composant détruit - tick #${value + 1}`);
          console.error(`⚠️  Compteur fantôme: ${this.counter + 1} (composant n'existe plus !)`);
          
          // Simuler une erreur réelle qui pourrait se produire
          try {
            this.counter++;
            this.lastUpdate = new Date();
            console.error(`💀 Mutation d'état sur composant détruit - comportement dangereux !`);
          } catch (error) {
            console.error(`🔥 Erreur lors de la mutation:`, error);
          }
        } else {
          this.counter++;
          this.lastUpdate = new Date();
          console.log(`🔴 [INTERVAL BAD] Tick #${this.counter} - ${this.lastUpdate.toLocaleTimeString()}`);
        }
      },
      error: (error) => {
        console.error('❌ Erreur dans IntervalBadComponent:', error);
        this.isRunning = false;
      }
    });
  }

  stopInterval() {
    // Note: Dans ce mauvais exemple, on ne peut pas vraiment arrêter l'intervalle
    // car on n'a pas gardé la référence à la subscription
    this.isRunning = false;
    console.log(`🔴 [INTERVAL BAD] Tentative d'arrêt - mais la subscription continue !`);
    console.log(`⚠️  L'intervalle continue en arrière-plan car pas de gestion de subscription`);
  }
}