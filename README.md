# 💊 Domowa Apteczka / Home Medicine Cabinet

**PL:** Aplikacja webowa do zarządzania domową apteczką - śledź leki, terminy ważności, ilości oraz plany leczenia dla siebie i całej rodziny.

**EN:** A web application for managing your home medicine cabinet - track medications, expiry dates, quantities, and treatment plans for yourself and your family.

---

## 📋 Spis treści / Table of Contents

- [Opis / About](#-opis--about)
- [Funkcjonalności / Features](#-funkcjonalności--features)
- [Stos technologiczny / Tech Stack](#-stos-technologiczny--tech-stack)
- [Struktura projektu / Project Structure](#-struktura-projektu--project-structure)
- [Instalacja / Getting Started](#-instalacja--getting-started)
- [Konfiguracja Firebase / Firebase Configuration](#-konfiguracja-firebase--firebase-configuration)
- [Konfiguracja Vite / Vite Setup](#-konfiguracja-vite--vite-setup)
- [Model danych / Data Model](#-model-danych--data-model)
- [Licencja / License](#-licencja--license)

---

## 🏠 Opis / About

**PL:**
Domowa Apteczka to aplikacja SPA stworzona w React + TypeScript, która pomaga w codziennym zarządzaniu lekami w domu. Pozwala dodawać leki z informacjami o dawce, ilości, kategorii i dacie ważności, a następnie śledzić ich status (w terminie / wkrótce wygasa / po terminie). Dodatkowo umożliwia tworzenie planów leczenia z kalendarzem oraz udostępnianie apteczki członkom rodziny z kontrolą uprawnień.

**EN:**
Domowa Apteczka is a single-page application built with React and TypeScript that helps you manage medications at home. You can add medicines with details like dosage, quantity, category, and expiry date, then monitor their status (valid / expiring soon / expired). The app also supports treatment plans with a calendar view and family sharing with role-based access control.

---

## ✨ Funkcjonalności / Features

### 🔐 Uwierzytelnianie / Authentication

| PL | EN |
|---|---|
| Rejestracja z podaniem imienia, daty urodzenia, płci, e-maila i hasła | Registration with name, date of birth, gender, email, and password |
| Logowanie e-mail + hasło | Email + password login |
| Logowanie przez Google (OAuth) | Google OAuth login |
| Chronione ścieżki - niezalogowani użytkownicy są przekierowywani na stronę logowania | Protected routes - unauthenticated users are redirected to the login page |

### 💊 Zarządzanie lekami / Medicine Management

| PL | EN |
|---|---|
| Dodawanie leków z polami: nazwa, dawka, ilość, jednostka, kategoria, data ważności, uwagi | Add medicines: name, dosage, quantity, unit, category, expiry date, notes |
| Edycja i usuwanie leków | Edit and delete medicines |
| Szybka zmiana ilości (+/−) bezpośrednio z listy | Quick quantity adjustment (+/−) from the list |
| 15 predefiniowanych kategorii z emoji | 15 predefined categories with emoji icons |

### 📅 Monitorowanie terminów / Expiry Monitoring

| PL | EN |
|---|---|
| Automatyczne statusy: ✅ w terminie · ⚠️ < 30 dni · ❌ po terminie | Auto status badges: ✅ valid · ⚠️ < 30 days · ❌ expired |
| Kafelki podsumowujące z liczbami | Summary tiles with counts |
| Filtrowanie po statusie i kategorii | Filter by status and category |
| Sortowanie po dacie, nazwie, kategorii lub ilości | Sort by date, name, category, or quantity |

### 🗓️ Plany leczenia / Treatment Plans

| PL | EN |
|---|---|
| Tworzenie planów z przypisaniem leku, dniami tygodnia i godzinami | Create plans linked to a medicine with days and times |
| Widok kalendarza miesięcznego z zaznaczonymi dawkami | Monthly calendar view with scheduled doses |
| Edycja i usuwanie planów | Edit and delete plans |
| Obsługa planów bezterminowych | Support for open-ended plans |

### 👨‍👩‍👧 Rodzina / Family

| PL | EN |
|---|---|
| Grupy rodzinne z systemem ról (właściciel / admin / członek / obserwator) | Family groups with roles (owner / admin / member / viewer) |
| Podgląd leków innych członków rodziny | View other members' medicines |
| Edycja ilości leków członka rodziny (zależnie od roli) | Edit member medicine quantities (role-dependent) |

### 👤 Profil / Profile

| PL | EN |
|---|---|
| Edycja imienia, daty urodzenia i płci | Edit name, date of birth, and gender |
| Zmiana hasła | Change password |
| Automatyczne wyliczanie wieku | Automatic age calculation |

---

## 🛠 Stos technologiczny / Tech Stack

| Warstwa / Layer | Technologia / Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Routing | React Router v6 |
| Stylowanie / Styling | Tailwind CSS v4 |
| Backend / BaaS | Firebase (Authentication, Firestore, Storage) |
| Bundler | Vite (with HMR) |
| Daty / Dates | date-fns |

---

## 📁 Struktura projektu / Project Structure

```
src/
├── components/
│   ├── DashboardLayout.tsx    # Layout z sidebar / Layout with sidebar
│   └── ProtectedRoute.tsx     # Ochrona ścieżek / Route protection HOC
├── constants/
│   └── categories.ts          # 15 kategorii leków + emoji / Medicine categories
├── lib/
│   └── firebase.ts            # Konfiguracja Firebase / Firebase config
├── pages/
│   ├── Login.tsx              # Logowanie / Login (email + Google)
│   ├── Register.tsx           # Rejestracja / Registration
│   ├── MyMeds.tsx             # Lista leków / Medicine list + filters
│   ├── AddMed.tsx             # Dodaj lek / Add medicine form
│   ├── EditMed.tsx            # Edytuj lek / Edit medicine form
│   ├── Plans.tsx              # Kalendarz planów / Treatment plans calendar
│   ├── AddPlan.tsx            # Dodaj plan / Add plan form
│   ├── EditPlan.tsx           # Edytuj plan / Edit plan form
│   ├── Profile.tsx            # Profil + hasło / Profile + password
│   ├── Family.tsx             # Grupa rodzinna / Family management
│   └── FamilyMemberMeds.tsx   # Leki członka / Member's medicines
├── types.ts                   # Typy TS / TypeScript types
├── App.tsx                    # Routing
├── main.tsx                   # Punkt wejścia / Entry point
└── index.css                  # Tailwind + komponenty / Tailwind + components
```

---

## 🚀 Instalacja / Getting Started

### Wymagania / Prerequisites

- Node.js ≥ 18
- npm lub / or yarn
- Projekt Firebase z Authentication i Firestore / A Firebase project with Authentication and Firestore enabled

### Kroki / Steps

```bash
# 1. Sklonuj repozytorium / Clone the repository
git clone https://github.com/<your-username>/domowa-apteczka.git
cd domowa-apteczka

# 2. Zainstaluj zależności / Install dependencies
npm install

# 3. Skonfiguruj zmienne środowiskowe / Set up environment variables
cp .env.example .env
# → uzupełnij dane Firebase / fill in Firebase credentials (see below)

# 4. Uruchom serwer deweloperski / Start development server
npm run dev
```

Aplikacja będzie dostępna pod / The app will be available at `http://localhost:5173`.

### Budowanie / Production Build

```bash
npm run build
npm run preview
```

---

## 🔥 Konfiguracja Firebase / Firebase Configuration

1. Utwórz projekt w / Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Włącz / Enable **Authentication** → Email/Password + Google.
3. Utwórz / Create **Firestore Database** (production mode).
4. Skopiuj dane do `.env` / Copy config to `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

---

## ⚡ Konfiguracja Vite / Vite Setup

Projekt używa Vite z React + TypeScript i HMR (Hot Module Replacement).
This project uses Vite with React + TypeScript and HMR.

### Oficjalne pluginy / Official Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Babel (lub / or [oxc](https://oxc.rs) w [rolldown-vite](https://vite.dev/guide/rolldown)) dla / for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - [SWC](https://swc.rs/) dla / for Fast Refresh

### Rozszerzanie konfiguracji ESLint / Expanding ESLint Configuration

Dla aplikacji produkcyjnej zalecamy włączenie reguł z obsługą typów:
For a production application, we recommend enabling type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // lub / or: tseslint.configs.strictTypeChecked,
      // opcjonalnie / optionally: tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

Opcjonalnie zainstaluj pluginy React / Optionally install React-specific lint plugins:

```bash
npm install -D eslint-plugin-react-x eslint-plugin-react-dom
```

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

> ℹ️ React Compiler nie jest włączony domyślnie ze względu na wpływ na wydajność. Szczegóły: [dokumentacja](https://react.dev/learn/react-compiler/installation).
> ℹ️ React Compiler is not enabled by default due to dev & build performance impact. See [docs](https://react.dev/learn/react-compiler/installation).

---

## 🗄 Model danych / Data Model

### `users/{uid}`

| Pole / Field | Typ / Type | PL | EN |
|---|---|---|---|
| `uid` | string | ID użytkownika Firebase | Firebase user ID |
| `email` | string | Adres e-mail | Email address |
| `name` | string | Imię i nazwisko | Full name |
| `birth_date` | string? | Data urodzenia (YYYY-MM-DD) | Date of birth (YYYY-MM-DD) |
| `age` | number? | Wyliczony wiek | Calculated age |
| `gender` | string | `male` / `female` / `other` | `male` / `female` / `other` |
| `createdAt` | timestamp | Data rejestracji | Registration date |

### `medicines/{id}`

| Pole / Field | Typ / Type | PL | EN |
|---|---|---|---|
| `name` | string | Nazwa leku | Medicine name |
| `dose` | string | Dawka (np. „500mg") | Dosage (e.g. "500mg") |
| `quantity` | number | Aktualna ilość | Current quantity |
| `unit` | string | Jednostka (`pcs` / `ml` / `mg`) | Unit (`pcs` / `ml` / `mg`) |
| `category` | string | ID kategorii (np. `pain`) | Category ID (e.g. `pain`) |
| `date` | string | Data ważności (YYYY-MM-DD) | Expiry date (YYYY-MM-DD) |
| `notes` | string | Dodatkowe uwagi | Additional notes |

### `medicines_sets/{id}`

| Pole / Field | Typ / Type | PL | EN |
|---|---|---|---|
| `owner` | string | UID właściciela | Owner's UID |
| `medicines_id` | string[] | Tablica ID leków | Array of medicine IDs |
| `createdAt` | timestamp | Data utworzenia | Creation date |

### `plans/{id}`

| Pole / Field | Typ / Type | PL | EN |
|---|---|---|---|
| `owner` | string | UID właściciela | Owner's UID |
| `name` | string | Nazwa planu | Plan name |
| `medicine_id` | string | ID powiązanego leku | Linked medicine ID |
| `frequency` | string[] | Dni tygodnia (np. `["monday"]`) | Days of week (e.g. `["monday"]`) |
| `hours` | string[] | Godziny (np. `["08:00"]`) | Intake times (e.g. `["08:00"]`) |
| `start_date` | string | Data rozpoczęcia | Start date (YYYY-MM-DD) |
| `end_date` | string | Data zakończenia (puste = bezterminowy) | End date (empty = open-ended) |
| `notes` | string | Uwagi | Notes |

### `family/{id}`

| Pole / Field | Typ / Type | PL | EN |
|---|---|---|---|
| `name` | string | Nazwa grupy rodzinnej | Family group name |
| `users_id` | string[] | Lista UID członków | Member UIDs |
| `roles` | Record\<string, string\> | Mapa UID → rola | UID → role mapping |

**Role / Roles:** `owner` · `admin` · `member` · `viewer`

---

## 📄 Licencja / License

Ten projekt jest udostępniony na licencji / This project is licensed under the [MIT License](LICENSE).

---

> Stworzono z ❤️ / Built with ❤️
