import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-interval-good',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="component-container">
      <h2>✅ Composant SANS fuite mémoire d'intervalle</h2>
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

      <p class="success">✅ Ce composant utilise takeUntilDestroyed() - l'intervalle s'arrête automatiquement !</p>
      
      <div class="instructions">
        <h4>📋 Test sans fuite mémoire:</h4>
        <ol>
          <li>Cliquez sur "Démarrer intervalle"</li>
          <li>Observez le compteur qui s'incrémente chaque seconde</li>
          <li>Naviguez vers "Interval Bad Component" pendant que l'intervalle est actif</li>
          <li>Regardez la console : l'intervalle s'arrête immédiatement ! ✅</li>
          <li>Revenez ici : le compteur a été remis à zéro (nouveau composant)</li>
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
      min-height: 400px;
    }
    
    .counter-display {
      text-align: center;
      padding: 20px;
      background-color: #e6ffe6;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .counter-display h3 {
      font-size: 2.5em;
      margin: 0;
      color: #44aa44;
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
      background-color: #44aa44;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .controls button:hover:not(:disabled) {
      background-color: #339933;
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
    
    .success {
      color: #44aa44;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
    }
    
    .instructions {
      background-color: #e6ffe6;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
    
    .instructions h4 {
      margin-top: 0;
    }
  `]
})
export class IntervalGoodComponent implements OnInit, OnDestroy {
  counter = 0;
  lastUpdate = new Date();
  isRunning = false;
  private componentDestroyed = false;
  private takeUntilDestroyed = takeUntilDestroyed();
  private intervalSubscription?: Subscription;

  constructor() {}

  ngOnInit() {
    console.log(`✅ INTERVAL GOOD COMPONENT créé`);
  }

  ngOnDestroy() {
    this.componentDestroyed = true;
    console.log(`💀 INTERVAL GOOD COMPONENT détruit`);
    console.log(`✅ Intervalle automatiquement arrêté avec takeUntilDestroyed()`);
    if (this.isRunning) {
      console.log(`🛡️  Pas de fuite mémoire - subscription proprement fermée !`);
    }
  }

  startInterval() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`✅ [INTERVAL GOOD] Démarrage de l'intervalle avec takeUntilDestroyed`);
    
    // ✅ SOLUTION: Utilisation de takeUntilDestroyed()
    // L'intervalle s'arrête automatiquement à la destruction du composant
    this.intervalSubscription = interval(1000)
      .pipe(this.takeUntilDestroyed)
      .subscribe({
        next: (value) => {
          if (this.componentDestroyed) {
            // Ceci ne devrait JAMAIS se produire grâce à takeUntilDestroyed
            console.error(`💥 ERREUR INATTENDUE ! IntervalGoodComponent callback exécuté après destruction !`);
          } else {
            this.counter++;
            this.lastUpdate = new Date();
            console.log(`✅ [INTERVAL GOOD] Tick #${this.counter} - ${this.lastUpdate.toLocaleTimeString()}`);
          }
        },
        error: (error) => {
          console.error('❌ Erreur dans IntervalGoodComponent:', error);
          this.isRunning = false;
        },
        complete: () => {
          console.log(`✅ [INTERVAL GOOD] Intervalle terminé proprement`);
          this.isRunning = false;
        }
      });
  }

  stopInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = undefined;
      this.isRunning = false;
      console.log(`✅ [INTERVAL GOOD] Intervalle arrêté manuellement`);
    }
  }
}