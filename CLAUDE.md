# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This is an Angular 19 demonstration project specifically designed to show HTTP observable dangling subscriptions and their prevention using `takeUntilDestroyed()`. The goal is to demonstrate that without proper subscription management, HTTP callbacks can execute code that should be 'ignored' after component destruction.

## Development Commands

- **Start development server**: `npm start` or `ng serve`
  - Runs on http://localhost:4200 with auto-reload
- **Build for production**: `ng build`
- **Build and watch**: `ng build --watch --configuration development`
- **Run tests**: `ng test` (uses Karma + Jasmine)

## Architecture Overview

### Core Demonstration Pattern
The project contrasts two identical components that handle HTTP requests differently:

1. **BadComponent** (`src/app/components/bad/bad.component.ts`):
   - ❌ **Problem**: Direct observable subscription without cleanup
   - **Result**: HTTP callbacks continue to execute after component destruction (dangling subscription)
   - **Key behavior**: `this.userService.getUserData().subscribe()` without takeUntilDestroyed

2. **GoodComponent** (`src/app/components/good/good.component.ts`):
   - ✅ **Solution**: Uses `takeUntilDestroyed()` operator  
   - **Result**: HTTP subscriptions automatically terminate on component destruction
   - **Key pattern**: `.pipe(this.takeUntilDestroyed)` before subscribe

### Service Architecture
**UserService** (`src/app/services/user.service.ts`):
- Simulates slow HTTP calls (3-second delay) using JSONPlaceholder API
- Accepts `componentName` parameter for console logging clarity
- Uses deliberate delay to allow navigation during request lifecycle

### Routing & Navigation
- Simple two-route setup: `/bad` and `/good`
- Default route redirects to `/bad`
- Navigation buttons with active state indicators
- Uses standalone component architecture (Angular 19 pattern)

## Testing the Dangling Subscription

### Manual Test Procedure:
1. Open browser console (F12)
2. Navigate to "Bad Component"
3. Click "Charger utilisateur" button
4. **Immediately** navigate to "Good Component" (during 3-second HTTP delay)
5. Observe console: Bad Component still receives HTTP response after destruction

### Expected Console Output:
**Dangling Subscription (Bad Component):**
```
🔴 BAD COMPONENT créé
🚀 [BAD COMPONENT] Appel HTTP démarré pour utilisateur 1
💀 BAD COMPONENT détruit
⚠️ ATTENTION: Souscription orpheline - HTTP callback va s'exécuter !
✅ [BAD COMPONENT] RÉPONSE HTTP reçue... 
🚨 SOUSCRIPTION ORPHELINE ! BAD COMPONENT reçoit encore des données...
```

**Correct Behavior (Good Component):**
```
✅ GOOD COMPONENT créé
🚀 [GOOD COMPONENT] Appel HTTP démarré pour utilisateur 1  
💀 GOOD COMPONENT détruit
✅ Souscription automatiquement arrêtée avec takeUntilDestroyed()
(No HTTP response received - subscription properly terminated)
```

## Key Implementation Details

### takeUntilDestroyed Usage
- **Good Component**: `private takeUntilDestroyed = takeUntilDestroyed();`
- Must be called in injection context (constructor or class field)
- Applied in pipe: `.pipe(this.takeUntilDestroyed)`

### HTTP Client Configuration
- `provideHttpClient()` added to `app.config.ts`
- Real API calls to JSONPlaceholder for authentic network behavior

### Console Logging Strategy
- Clear component identification in logs
- Explicit dangling subscription warning messages
- Minimal noise to highlight the core issue