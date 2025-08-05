# NgDanglingSubscriptionSample - Démonstration des souscriptions orphelines avec HTTP Observables

Ce projet démontre les souscriptions orphelines (dangling subscriptions) dans Angular causées par des observables HTTP non-annulés, ainsi que la solution avec `takeUntilDestroyed()`.

## 🚀 Installation

1. **Extraire l'archive** dans un dossier
2. **Installer les dépendances** :
   ```bash
   npm install
   ```
3. **Lancer le serveur de développement** :
   ```bash
   ng serve
   ```
4. **Ouvrir** http://localhost:4200/ dans votre navigateur

## 🧪 Comment utiliser la démonstration

### Étapes pour observer la souscription orpheline :

1. **Ouvrez la console du navigateur (F12)**
2. **Allez sur "Bad Component"** et cliquez **"Charger utilisateur"**
3. **Changez IMMÉDIATEMENT vers "Good Component"** (pendant les 3 secondes d'attente)
4. **Observez la console :**
   - 🚨 **SOUSCRIPTION ORPHELINE** = Bad Component reçoit encore la réponse HTTP après destruction !
   - ✅ **CORRECT** = Good Component n'aura pas de réponse après destruction
5. **Répétez le test avec "Good Component"** pour voir la différence

## 📋 Explication technique

### Bad Component (🔴 Avec souscription orpheline)
- **Problème** : Pas de `takeUntilDestroyed()` 
- **Résultat** : Les callbacks HTTP s'exécutent encore après destruction du composant
- **Fichier** : `src/app/components/bad/bad.component.ts`

### Good Component (✅ Sans souscription orpheline)  
- **Solution** : Utilise `takeUntilDestroyed()` (Angular 16+)
- **Résultat** : Les souscriptions HTTP s'arrêtent automatiquement à la destruction
- **Fichier** : `src/app/components/good/good.component.ts`

### UserService
- Simule des appels HTTP lents (3 secondes) pour laisser le temps de naviguer
- Logs clairs pour identifier quel composant reçoit les réponses
- **Fichier** : `src/app/services/user.service.ts`

## 🛠️ Versions

- **Angular** : 19.0.1
- **Node.js** : Compatible avec les versions LTS récentes
- **TypeScript** : 5.6.2

## 📖 Ressources

- [Angular takeUntilDestroyed](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed)
- [RxJS Subscription Management](https://rxjs.dev/guide/subscription)
- [Angular CLI](https://angular.dev/tools/cli)