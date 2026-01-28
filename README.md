# 🏆 SportHub - Club Management System

<div align="center">

![SportHub Logo](https://img.shields.io/badge/SportHub-Club%20Management-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTYgOWE2IDYgMCAxIDAgMTIgMEE2IDYgMCAwIDAgNiA5Ii8+PHBhdGggZD0iTTEyIDE1djYiLz48cGF0aCBkPSJNOSAxOGg2Ii8+PC9zdmc+)

**A modern, full-stack sports club management application**

[![Django](https://img.shields.io/badge/Django-5.2-green?logo=django)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [User Guide](#-user-guide)
  - [Public Pages](#public-pages-no-login-required)
  - [Admin Dashboard](#admin-dashboard-login-required)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)

---

## 🎯 Overview

**SportHub** is a comprehensive sports club management system designed to help administrators manage members, activities, and enrollments efficiently. The application features a modern, responsive design with dark/light theme support, real-time statistics, and intuitive navigation.

### Key Capabilities
- 👥 **Member Management** - Add, edit, delete, and search members
- 🎾 **Activity Management** - Create activities with photos, pricing, and capacity
- 📝 **Enrollment System** - Register members for activities with automatic validation
- 📊 **Statistics Dashboard** - Real-time analytics and visualizations
- 🔐 **Secure Authentication** - JWT-based authentication system
- 🌙 **Theme Support** - Dark and light mode

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Secure JWT-based login with token refresh |
| 👥 Members CRUD | Full member management with search & filters |
| 🎾 Activities CRUD | Activity management with photo uploads |
| 📝 Enrollments | Member-activity registration system |
| 📊 Statistics | Real-time charts and analytics |
| 🌙 Dark/Light Mode | Theme toggle with system preference support |
| 📱 Responsive Design | Works on desktop, tablet, and mobile |
| 🔔 Notifications | Toast notifications for all actions |

---

## 🛠 Tech Stack

### Backend
- **Framework**: Django 5.2 with Django REST Framework
- **Authentication**: Simple JWT (JSON Web Tokens)
- **Database**: SQLite (development) / PostgreSQL (production)
- **CORS**: django-cors-headers

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Charts**: Recharts

---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Bun (or npm/yarn)

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
bun install
# or: npm install

# Start development server
bun run dev
# or: npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000
- **Django Admin**: http://127.0.0.1:8000/admin

---

## 📁 Project Structure

```
📦 full project
├── 📂 Backend/
│   ├── 📂 club/
│   │   ├── 📂 api/
│   │   │   ├── activities.py    # Activity endpoints
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── enrollments.py   # Enrollment endpoints
│   │   │   ├── members.py       # Member endpoints
│   │   │   └── statistics.py    # Statistics endpoints
│   │   ├── models.py            # Database models
│   │   ├── urls.py              # URL routing
│   │   └── admin.py             # Django admin config
│   ├── 📂 myproject/
│   │   ├── settings.py          # Django settings
│   │   └── urls.py              # Main URL config
│   ├── 📂 media/                # Uploaded files
│   └── db.sqlite3               # Database
│
└── 📂 Frontend/
    └── 📂 src/
        ├── 📂 components/
        │   ├── 📂 admin/        # Dashboard components
        │   ├── 📂 landing/      # Landing page components
        │   └── 📂 ui/           # shadcn/ui components
        ├── 📂 contexts/
        │   └── AuthContext.tsx  # Authentication context
        ├── 📂 lib/
        │   └── api.ts           # API service layer
        ├── 📂 pages/
        │   ├── 📂 admin/        # Dashboard pages
        │   ├── LandingPage.tsx  # Home page
        │   └── LoginPage.tsx    # Login page
        └── App.tsx              # Main app component
```

---

## 📖 User Guide

### Public Pages (No Login Required)

#### 🏠 Landing Page (`/`)

The landing page is the first thing visitors see. It showcases the club's features and encourages sign-up.

| Section | Description |
|---------|-------------|
| **Hero Section** | Welcome message with animated gradient background |
| **Features Section** | Highlights of the club management features |
| **About Section** | Information about the club |
| **CTA Section** | Call-to-action to join or learn more |
| **Footer** | Contact information and links |

**Buttons & Actions:**

| Button | Location | Action | Result |
|--------|----------|--------|--------|
| `Connexion` | Navbar (top right) | Click | Redirects to login page |
| `Commencer` | Hero section | Click | Redirects to login page |
| `En savoir plus` | Hero section | Click | Scrolls to features section |
| Theme Toggle (🌙/☀️) | Navbar | Click | Switches between dark/light mode |

---

#### 🔐 Login Page (`/login`)

Secure authentication page for administrators.

| Field | Description | Validation |
|-------|-------------|------------|
| **Nom d'utilisateur** | Admin username | Required |
| **Mot de passe** | Admin password | Required |

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `Se Connecter` | Submit login form | On success: Redirects to dashboard<br>On failure: Shows error message |
| `Retour à l'accueil` | Navigate back | Returns to landing page |
| Theme Toggle | Click | Switches theme |

**Error Messages:**
- ❌ "Identifiants incorrects" - Wrong username or password
- ❌ "Erreur de connexion" - Network or server error

---

### Admin Dashboard (Login Required)

After successful login, administrators access the full dashboard.

---

#### 📊 Dashboard Home (`/dashboard`)

The main dashboard displays key statistics and recent activity.

| Widget | Description |
|--------|-------------|
| **Total Members** | Count of all registered members |
| **Active Activities** | Count of all activities |
| **Total Enrollments** | Count of all member-activity registrations |
| **Revenue** | Total monthly revenue (sum of all enrollments × tariff) |
| **Membership Chart** | Line chart showing member registrations over time |
| **Activity Popularity** | Bar chart comparing activity enrollments |
| **Recent Activity Feed** | Latest actions (new members, enrollments, etc.) |

**Sidebar Navigation:**

| Icon | Label | Route | Description |
|------|-------|-------|-------------|
| 📊 | Tableau de bord | `/dashboard` | Main statistics overview |
| 👥 | Membres | `/dashboard/members` | Member management |
| 🎾 | Activités | `/dashboard/activities` | Activity management |
| 📝 | Inscriptions | `/dashboard/registrations` | Enrollment management |
| 📈 | Statistiques | `/dashboard/statistics` | Detailed analytics |

**Sidebar Features:**
- **Collapse/Expand**: Click the `≡` button to toggle sidebar
- **Tooltips**: When collapsed, hover over icons to see labels
- **Settings**: Opens settings dialog (theme toggle)
- **Logout**: Click to log out and return to login page

---

#### 👥 Members Page (`/dashboard/members`)

Complete member management interface.

**Header Section:**

| Element | Description |
|---------|-------------|
| **Title** | "Membres" with member count |
| **Search Bar** | Real-time search by name |
| **View Toggle** | Switch between grid/list view |
| **Add Button** | "Ajouter un Membre" |

**Member Card (Grid View):**

| Element | Description |
|---------|-------------|
| **Avatar** | Initials of member name |
| **Name** | Full name (Prénom Nom) |
| **Age** | Member's age |
| **Phone** | 8-digit phone number |
| **Edit Button** (✏️) | Opens edit page |
| **Delete Button** (🗑️) | Deletes member (with confirmation) |

**Member Row (List View):**

| Column | Description |
|--------|-------------|
| **Membre** | Avatar + full name |
| **Âge** | Age in years |
| **Téléphone** | Phone number |
| **Actions** | Edit/Delete buttons |

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `Ajouter un Membre` | Click | Navigates to `/dashboard/members/add` |
| `Grid View` (⊞) | Click | Displays members as cards |
| `List View` (☰) | Click | Displays members as table rows |
| `Edit` (✏️) | Click on member | Navigates to `/dashboard/members/edit/{id}` |
| `Delete` (🗑️) | Click on member | Shows confirmation → Deletes member |
| `Search` | Type in search bar | Filters members in real-time |

---

#### ➕ Add Member Page (`/dashboard/members/add`)

Form to create a new member.

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| **Prénom** | Text | Required | Member's first name |
| **Nom** | Text | Required | Member's last name |
| **Âge** | Number | Required, min: 1 | Member's age |
| **Téléphone** | Text | Required, 8 digits | Tunisian phone format |

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `← Back Arrow` | Click | Returns to members list |
| `Annuler` | Click | Returns to members list |
| `Créer le Membre` | Submit form | On success: Creates member, shows success toast, redirects<br>On error: Shows error message |

**Validation Messages:**
- ❌ "Le numéro de téléphone doit contenir exactement 8 chiffres"
- ❌ "Ce numéro de téléphone existe déjà"
- ✅ "Membre créé avec succès !"

---

#### ✏️ Edit Member Page (`/dashboard/members/edit/{id}`)

Form to modify an existing member.

| Field | Type | Pre-filled | Description |
|-------|------|------------|-------------|
| **Prénom** | Text | ✅ Current value | Member's first name |
| **Nom** | Text | ✅ Current value | Member's last name |
| **Âge** | Number | ✅ Current value | Member's age |
| **Téléphone** | Text | ✅ Current value | Phone number |

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `← Back Arrow` | Click | Returns to members list |
| `Annuler` | Click | Returns to members list |
| `Enregistrer les Modifications` | Submit form | Updates member, shows success toast, redirects |

---

#### 🎾 Activities Page (`/dashboard/activities`)

Complete activity management with photo support.

**Header Section:**

| Element | Description |
|---------|-------------|
| **Title** | "Activités" with activity count |
| **Search Bar** | Search activities by name |
| **View Toggle** | Grid/List view switch |
| **Add Button** | "Ajouter une Activité" |

**Activity Card (Grid View):**

| Element | Description |
|---------|-------------|
| **Photo** | Activity image (or placeholder) |
| **Code Badge** | Activity code (e.g., ACT001) |
| **Name** | Activity name |
| **Tarif** | Monthly price in DT (Dinar Tunisien) |
| **Participants** | Current/Max capacity with progress bar |
| **Fill Rate** | Percentage of capacity filled |
| **Edit Button** (✏️) | Edit activity |
| **Delete Button** (🗑️) | Delete activity |

**Activity Row (List View):**

| Column | Description |
|--------|-------------|
| **Activité** | Photo thumbnail + name |
| **Code** | Activity code badge |
| **Tarif** | Monthly price |
| **Capacité** | Current/Max enrolled |
| **Actions** | Edit/Delete buttons |

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `Ajouter une Activité` | Click | Navigates to `/dashboard/activities/add` |
| `Edit` (✏️) | Click on activity | Navigates to `/dashboard/activities/edit/{id}` |
| `Delete` (🗑️) | Click on activity | Shows confirmation → Deletes activity |

---

#### ➕ Add Activity Page (`/dashboard/activities/add`)

Form to create a new activity with photo upload.

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| **Photo** | Image Upload | Optional, max 5MB | Activity image (JPG, PNG, GIF) |
| **Code Activité** | Text | Required, unique | Unique identifier (e.g., YOGA01) |
| **Nom de l'Activité** | Text | Required | Activity name |
| **Tarif Mensuel** | Number | Required, min: 0 | Monthly price in DT |
| **Capacité Maximum** | Number | Required, min: 1 | Max participants |

**Photo Upload Section:**

| Element | Description |
|---------|-------------|
| **Preview** | Shows uploaded image |
| **Upload Area** | Click or drag to upload |
| **Remove Button** (✕) | Removes selected photo |
| **File Info** | Accepted formats and size limit |

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `← Back Arrow` | Click | Returns to activities list |
| `Télécharger une photo` | Click | Opens file picker |
| `Annuler` | Click | Returns to activities list |
| `Créer l'Activité` | Submit form | Creates activity with photo, redirects |

**Validation Messages:**
- ❌ "Le code activité 'XXX' existe déjà"
- ❌ "La photo ne doit pas dépasser 5 Mo"
- ✅ "Activité créée avec succès !"

---

#### ✏️ Edit Activity Page (`/dashboard/activities/edit/{id}`)

Form to modify an existing activity.

| Field | Pre-filled | Description |
|-------|------------|-------------|
| **Photo** | Current photo (if any) | Can change or remove |
| **Code Activité** | ✅ | Can be modified |
| **Nom** | ✅ | Activity name |
| **Tarif** | ✅ | Monthly price |
| **Capacité** | ✅ | Max participants |

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `Changer la photo` | Click | Select new photo |
| `Remove` (✕) | Click on photo | Removes current photo |
| `Enregistrer les Modifications` | Submit | Updates activity |

---

#### 📝 Registrations Page (`/dashboard/registrations`)

Manage member enrollments in activities.

**Header Section:**

| Element | Description |
|---------|-------------|
| **Title** | "Inscriptions" with count |
| **Search Bar** | Search by member or activity name |
| **Add Button** | "Nouvelle Inscription" |

**Enrollment Card/Row:**

| Element | Description |
|---------|-------------|
| **Member Name** | Full name of enrolled member |
| **Activity Name** | Name of the activity |
| **Date** | Registration date |
| **Delete Button** | Cancel enrollment |

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `Nouvelle Inscription` | Click | Navigates to `/dashboard/registrations/add` |
| `Delete` (🗑️) | Click | Cancels enrollment (with confirmation) |

---

#### ➕ Add Enrollment Page (`/dashboard/registrations/add`)

Register a member for an activity.

| Field | Type | Description |
|-------|------|-------------|
| **Membre** | Dropdown | Select from existing members |
| **Activité** | Dropdown | Select from available activities |

**Activity Card Display:**
When selecting an activity, shows:
- Activity name and code
- Current enrollment / capacity
- Available spots
- Monthly price

**Buttons & Actions:**

| Button | Action | Result |
|--------|--------|--------|
| `← Back Arrow` | Click | Returns to registrations list |
| `Annuler` | Click | Returns to registrations list |
| `Créer l'Inscription` | Submit | Registers member for activity |

**Validation Messages:**
- ❌ "Ce membre est déjà inscrit à cette activité"
- ❌ "L'activité est complète (capacité maximale atteinte)"
- ✅ "Inscription créée avec succès !"

---

#### 📈 Statistics Page (`/dashboard/statistics`)

Detailed analytics and reports.

**Statistics Cards:**

| Card | Description |
|------|-------------|
| **Total Membres** | Total member count |
| **Activités Actives** | Number of activities |
| **Inscriptions Totales** | Total enrollments |
| **Revenus Mensuels** | Sum of (enrollments × activity price) |

**Charts:**

| Chart | Type | Description |
|-------|------|-------------|
| **Inscriptions par Activité** | Bar Chart | Compares enrollment counts across activities |
| **Évolution des Membres** | Line Chart | Member registration trend over time |
| **Taux de Remplissage** | Progress Bars | Capacity fill rate per activity |

**Activity Details Table:**

| Column | Description |
|--------|-------------|
| **Activité** | Activity name |
| **Code** | Activity code |
| **Tarif** | Monthly price |
| **Inscrits** | Current enrollments |
| **Capacité** | Maximum capacity |
| **Taux** | Fill percentage |

---

### ⚙️ Settings & Preferences

**Accessed via:** Settings icon (⚙️) in sidebar

| Setting | Options | Description |
|---------|---------|-------------|
| **Theme** | Light / Dark / System | Changes application appearance |

**Theme Behavior:**
- 🌙 **Dark Mode**: Dark backgrounds, light text
- ☀️ **Light Mode**: Light backgrounds, dark text
- 💻 **System**: Follows OS preference

---

### 🔔 Notification System

All actions display toast notifications:

| Type | Color | Example |
|------|-------|---------|
| ✅ Success | Green | "Membre créé avec succès !" |
| ❌ Error | Red | "Le code activité existe déjà" |
| ⚠️ Warning | Yellow | "Êtes-vous sûr de vouloir supprimer ?" |
| ℹ️ Info | Blue | "Chargement en cours..." |

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login/` | Login with credentials |
| POST | `/auth/token/refresh/` | Refresh access token |
| GET | `/auth/me/` | Get current user info |

### Member Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/membres/` | List all members |
| POST | `/api/membres/` | Create new member |
| GET | `/api/membres/{id}/` | Get member details |
| PUT | `/api/membres/{id}/` | Update member |
| DELETE | `/api/membres/{id}/` | Delete member |

### Activity Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activites/` | List all activities |
| POST | `/api/activites/` | Create new activity (supports FormData for photo) |
| GET | `/api/activites/{id}/` | Get activity details |
| PUT | `/api/activites/{id}/` | Update activity |
| DELETE | `/api/activites/{id}/` | Delete activity |

### Enrollment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inscriptions/` | List all enrollments |
| POST | `/api/inscriptions/` | Create enrollment |
| DELETE | `/api/inscriptions/{id}/` | Cancel enrollment |

### Statistics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/overview/` | General statistics |
| GET | `/api/stats/activities/` | Per-activity statistics |
| GET | `/api/stats/recent-activity/` | Recent actions feed |

---

## 🎨 Screenshots

### Landing Page
```
┌─────────────────────────────────────────┐
│  🏆 SportHub          [Connexion] [🌙]  │
├─────────────────────────────────────────┤
│                                         │
│     Bienvenue à SportHub               │
│     Gérez votre club sportif           │
│     avec efficacité                     │
│                                         │
│     [Commencer]  [En savoir plus]      │
│                                         │
└─────────────────────────────────────────┘
```

### Dashboard
```
┌────┬──────────────────────────────────────┐
│ 📊 │  Bienvenue, Admin! 👋                │
│ 👥 ├──────────────────────────────────────┤
│ 🎾 │  [247]     [12]      [156]    [8.5K] │
│ 📝 │  Membres   Activités  Inscrip  DT    │
│ 📈 ├──────────────────────────────────────┤
│    │  ┌─────────────┐ ┌─────────────┐    │
│ ⚙️ │  │ Chart 1     │ │ Chart 2     │    │
│ 🚪 │  └─────────────┘ └─────────────┘    │
└────┴──────────────────────────────────────┘
```

---

## 📄 License

This project is developed for educational purposes.

---

## 👨‍💻 Author
Ahmed Dachraoui and Rayen Ben Othmen

**SportHub Club Management System**

Built with ❤️ using Django & React

---

<div align="center">

**[⬆ Back to Top](#-sporthub---club-management-system)**

</div>
