# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This is an Angular 19 demonstration project specifically designed to show Angular Observable subscription pitfalls and their prevention using `takeUntilDestroyed()`. The project demonstrates two main types of memory leaks:

1. **HTTP Observable Dangling Subscriptions**: HTTP callbacks that execute after component destruction
2. **Interval Observable Memory Leaks**: Long-running intervals that continue consuming memory after component destruction

The goal is to demonstrate that without proper subscription management, Observable callbacks can execute code that should be 'ignored' after component destruction, leading to memory leaks and potential runtime errors.

## Development Commands

- **Start development server**: `npm start` or `ng serve`
  - Runs on http://localhost:4200 with auto-reload
- **Build for production**: `ng build`
- **Build and watch**: `ng build --watch --configuration development`
- **Run tests**: `ng test` (uses Karma + Jasmine)

## Architecture Overview

### Core Demonstration Pattern
The project contrasts identical component pairs that handle Observable subscriptions differently:

#### HTTP Observable Components
1. **DanglingCallBadComponent** (`src/app/components/dangling-call-bad/dangling-call-bad.component.ts`):
   - ❌ **Problem**: Direct HTTP observable subscription without cleanup
   - **Result**: HTTP callbacks continue to execute after component destruction (dangling subscription)
   - **Key behavior**: `this.userService.getUserData().subscribe()` without takeUntilDestroyed

2. **DanglingCallGoodComponent** (`src/app/components/dangling-call-good/dangling-call-good.component.ts`):
   - ✅ **Solution**: Uses `takeUntilDestroyed()` operator  
   - **Result**: HTTP subscriptions automatically terminate on component destruction
   - **Key pattern**: `.pipe(this.takeUntilDestroyed)` before subscribe

#### Interval Observable Components
3. **IntervalBadComponent** (`src/app/components/interval-bad/interval-bad.component.ts`):
   - ❌ **Problem**: Unmanaged `interval()` subscription that continues after component destruction
   - **Result**: Interval continues consuming memory and executing callbacks indefinitely
   - **Key behavior**: `interval(1000).subscribe()` without takeUntilDestroyed

4. **IntervalGoodComponent** (`src/app/components/interval-good/interval-good.component.ts`):
   - ✅ **Solution**: Uses `takeUntilDestroyed()` operator with interval
   - **Result**: Interval automatically stops on component destruction
   - **Key pattern**: `interval(1000).pipe(this.takeUntilDestroyed).subscribe()`

### Service Architecture
**UserService** (`src/app/services/user.service.ts`):
- Simulates slow HTTP calls (3-second delay) using JSONPlaceholder API
- Accepts `componentName` parameter for console logging clarity
- Uses deliberate delay to allow navigation during request lifecycle

### Routing & Navigation
- Four main routes: `/dangling-call-bad`, `/dangling-call-good`, `/interval-bad`, `/interval-good`
- Default route redirects to `/dangling-call-bad`
- Organized into two demonstration sections:
  - HTTP Observable subscriptions
  - Interval Observable subscriptions
- Navigation buttons with active state indicators
- Uses standalone component architecture (Angular 19 pattern)

## Testing Observable Subscription Issues

### HTTP Observable Test Procedure:
1. Open browser console (F12)
2. Navigate to "Dangling Call Bad Component"
3. Click "Charger utilisateur" button
4. **Immediately** navigate to "Dangling Call Good Component" (during 3-second HTTP delay)
5. Observe console: Dangling Call Bad Component still receives HTTP response after destruction

### Interval Observable Test Procedure:
1. Open browser console (F12)
2. Navigate to "Interval Bad Component"
3. Click "Démarrer intervalle" button
4. **Immediately** navigate to "Interval Good Component"
5. Observe console: Bad Component interval continues running after destruction
6. Compare with "Interval Good Component" - interval stops automatically

### Expected Console Output:

#### HTTP Dangling Subscription (Dangling Call Bad Component):
```
🔴 DANGLING CALL BAD COMPONENT créé
🚀 [DANGLING CALL BAD COMPONENT] Appel HTTP démarré pour utilisateur 1
💀 DANGLING CALL BAD COMPONENT détruit
⚠️ ATTENTION: Souscription orpheline - HTTP callback va s'exécuter !
🚨 ERREUR CRITIQUE ! DanglingCallBadComponent détruit mais callback exécuté !
💥 Tentative de mise à jour d'un composant détruit - ceci peut causer des erreurs !
```

#### HTTP Correct Behavior (Dangling Call Good Component):
```
✅ DANGLING CALL GOOD COMPONENT créé
🚀 [DANGLING CALL GOOD COMPONENT] Appel HTTP démarré pour utilisateur 1  
💀 DANGLING CALL GOOD COMPONENT détruit
✅ Souscription automatiquement arrêtée avec takeUntilDestroyed()
(No HTTP response received - subscription properly terminated)
```

#### Interval Memory Leak (Interval Bad Component):
```
🔴 INTERVAL BAD COMPONENT créé
🔴 [INTERVAL BAD] Démarrage de l'intervalle
🔴 [INTERVAL BAD] Tick #1 - 14:30:01
🔴 [INTERVAL BAD] Tick #2 - 14:30:02
💀 INTERVAL BAD COMPONENT détruit
⚠️ ATTENTION: Fuite mémoire - l'intervalle continue de tourner !
🚨 FUITE MÉMOIRE ! Intervalle s'exécute sur composant détruit !
💥 Tentative de mise à jour d'un composant détruit - tick #3
🚨 FUITE MÉMOIRE ! Intervalle s'exécute sur composant détruit !
💥 Tentative de mise à jour d'un composant détruit - tick #4
(continues indefinitely...)
```

#### Interval Correct Behavior (Interval Good Component):
```
✅ INTERVAL GOOD COMPONENT créé
✅ [INTERVAL GOOD] Démarrage de l'intervalle avec takeUntilDestroyed
✅ [INTERVAL GOOD] Tick #1 - 14:30:01
✅ [INTERVAL GOOD] Tick #2 - 14:30:02
💀 INTERVAL GOOD COMPONENT détruit
✅ Intervalle automatiquement arrêté avec takeUntilDestroyed()
🛡️ Pas de fuite mémoire - subscription proprement fermée !
(Interval stops - no further output)
```

## Key Implementation Details

### takeUntilDestroyed Usage
- **Dangling Call Good Component**: `private takeUntilDestroyed = takeUntilDestroyed();`
- Must be called in injection context (constructor or class field)
- Applied in pipe: `.pipe(this.takeUntilDestroyed)`

### HTTP Client Configuration
- `provideHttpClient()` added to `app.config.ts`
- Real API calls to JSONPlaceholder for authentic network behavior

### Console Logging Strategy
- Clear component identification in logs
- Explicit dangling subscription warning messages
- Minimal noise to highlight the core issue