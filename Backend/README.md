# 🏆 Sport Club Management System

A comprehensive Django REST API for managing a sports club. This system handles **members**, **activities** (gym, swimming, tennis, etc.), and **enrollments**.

---

## 📋 Table of Contents

- [Project Structure](#-project-structure)
- [Data Models](#-data-models)
- [Installation & Setup](#-installation--setup)
- [Getting Started](#-getting-started)
- [Authentication](#-authentication)
- [API Endpoints](#-api-endpoints)
  - [Members Management](#1-members-management)
  - [Activities Management](#2-activities-management)
  - [Enrollments Management](#3-enrollments-management)
  - [Statistics](#4-statistics)
- [Code Architecture](#-code-architecture)
- [Usage Examples](#-usage-examples)

---

## 📁 Project Structure

```
django_python_project/
├── manage.py                    # Django management script
├── db.sqlite3                   # SQLite database
├── myproject/                   # Main Django project settings
│   ├── settings.py              # Project configuration
│   ├── urls.py                  # Root URL routing
│   ├── wsgi.py                  # WSGI entry point
│   └── asgi.py                  # ASGI entry point
└── club/                        # Main application
    ├── models.py                # Database models (Member, Activity, Enrollment)
    ├── admin.py                 # Django admin configuration
    ├── urls.py                  # API URL routing
    ├── api/                     # API views (controllers)
    │   ├── auth.py              # Authentication endpoints
    │   ├── members.py           # Member CRUD operations
    │   ├── activities.py        # Activity CRUD operations
    │   ├── enrollments.py       # Enrollment CRUD operations
    │   └── statistics.py        # Statistics endpoints
    ├── services/                # Business logic layer
    │   └── statistics.py        # Statistics calculations
    └── migrations/              # Database migrations
```

---

## 🗄️ Data Models

### Member (Membre)

| Field       | Type         | Description                              |
|-------------|--------------|------------------------------------------|
| `id`        | Integer (PK) | Auto-generated primary key               |
| `nom`       | String(100)  | Last name                                |
| `prenom`    | String(100)  | First name                               |
| `age`       | Integer      | Member's age                             |
| `telephone` | String(8)    | Phone number (exactly 8 digits)          |

**Code Implementation** (`club/models.py`):
```python
class Member(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    age = models.IntegerField()
    telephone = models.CharField(
        max_length=8,
        validators=[
            RegexValidator(
                regex=r'^\d{8}$',
                message='Le numéro de téléphone doit contenir exactement 8 chiffres.'
            )
        ]
    )
```

---

### Activity (Activité)

| Field          | Type         | Description                    |
|----------------|--------------|--------------------------------|
| `id`           | Integer (PK) | Auto-generated primary key     |
| `code_act`     | String(20)   | Unique activity code           |
| `nom_act`      | String(100)  | Activity name (Gym, Tennis...) |
| `tarif_mensuel`| Float        | Monthly fee                    |
| `capacite`     | Integer      | Maximum number of participants |
| `photo`        | Image        | Activity photo (optional)      |

**Code Implementation**:
```python
class Activity(models.Model):
    code_act = models.CharField(max_length=20, unique=True)
    nom_act = models.CharField(max_length=100)
    tarif_mensuel = models.FloatField()
    capacite = models.IntegerField()
    photo = models.ImageField(upload_to='activities/', null=True, blank=True)
```

---

### Enrollment (Inscription)

| Field              | Type         | Description                      |
|--------------------|--------------|----------------------------------|
| `id`               | Integer (PK) | Auto-generated primary key       |
| `membre`           | ForeignKey   | Reference to Member              |
| `activite`         | ForeignKey   | Reference to Activity            |
| `date_inscription` | Date         | Auto-set enrollment date         |

**Code Implementation**:
```python
class Enrollment(models.Model):
    membre = models.ForeignKey(Member, on_delete=models.CASCADE)
    activite = models.ForeignKey(Activity, on_delete=models.CASCADE)
    date_inscription = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('membre', 'activite')  # Prevents duplicate enrollments
```

---

## ⚙️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install all required dependencies
pip install django pillow django-cors-headers djangorestframework djangorestframework-simplejwt
```

### 2. Project Configuration

Ensure your `settings.py` includes the following configuration:

```python
# myproject/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',          # CORS handling
    'rest_framework',       # Django REST Framework
    'club',                 # Your main app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration for frontend integration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",    # React default port
    "http://127.0.0.1:3000",
    "http://localhost:8080",    # Vue.js default port
    "http://127.0.0.1:8080",
]

# Allow credentials for session-based auth
CORS_ALLOW_CREDENTIALS = True

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

### 3. Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Admin User

```bash
python manage.py createsuperuser
```

### 5. Run Server

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`

### 6. Quick Fix for Missing Dependencies

If you encounter `ModuleNotFoundError` for any package, install it:

```bash
# For CORS headers
pip install django-cors-headers

# For image handling
pip install pillow

# For REST API features
pip install djangorestframework

# For JWT authentication (if used)
pip install djangorestframework-simplejwt

# Install all at once
pip install django pillow django-cors-headers djangorestframework djangorestframework-simplejwt
```

---

## 🚀 Getting Started

### Server is Running Successfully! ✅

When you see this output, your Django server is working correctly:

```
System check identified no issues (0 silenced).
Django version 6.0.1, using settings 'myproject.settings'
Starting development server at http://127.0.0.1:8000/
```

### Available URLs

Your API is accessible at these URLs:

| URL | Description |
|-----|-------------|
| `http://127.0.0.1:8000/admin/` | **Django Admin Panel** (login with superuser) |
| `http://127.0.0.1:8000/auth/login/` | **API Login** endpoint |
| `http://127.0.0.1:8000/members/` | **Members** API endpoints |
| `http://127.0.0.1:8000/activities/` | **Activities** API endpoints |
| `http://127.0.0.1:8000/enrollments/` | **Enrollments** API endpoints |
| `http://127.0.0.1:8000/stats/` | **Statistics** API endpoints |

### Quick Test

1. **Access Admin Panel**: Go to `http://127.0.0.1:8000/admin/` and login with your superuser credentials
2. **Test API Login**: 
   ```bash
   curl -X POST http://127.0.0.1:8000/auth/login/ \
     -d "username=youradmin&password=yourpassword"
   ```

### Note About Root URL (/)

The 404 error at `http://127.0.0.1:8000/` is **normal** - there's no homepage configured. Use the specific API endpoints listed above.

---

## 🔐 Authentication

All API endpoints (except login) require **staff authentication**. The system uses Django's session-based authentication.

### Login

**Endpoint:** `POST /api/auth/login/`

**Code** (`club/api/auth.py`):
```python
@csrf_exempt
def admin_login(request):
    user = authenticate(
        request,
        username=request.POST.get("username"),
        password=request.POST.get("password")
    )
    if user and user.is_staff:
        login(request, user)
        return JsonResponse({"success": True})
    return JsonResponse({"success": False}, status=401)
```

**Request:**
```
POST /api/auth/login/
Content-Type: application/x-www-form-urlencoded

username=admin&password=yourpassword
```

### Logout

**Endpoint:** `GET /api/auth/logout/`

---

## 📡 API Endpoints

### 1. Members Management

#### List All Members
**`GET /api/members/`**

| Query Param | Description                              |
|-------------|------------------------------------------|
| `search`    | Search by `nom` OR `prenom` (partial)    |
| `id`        | Search by exact member ID                |
| `sort`      | `age` (ascending) or `-age` (descending) |

**Code Logic** (`club/api/members.py`):
```python
def members(request):
    if request.method == "GET":
        search = request.GET.get("search")
        search_id = request.GET.get("id")
        sort = request.GET.get("sort")

        queryset = Member.objects.all()

        # Search by ID (exact match)
        if search_id:
            queryset = queryset.filter(id=search_id)
        # Search by nom OR prénom (partial match)
        elif search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(nom__icontains=search) | Q(prenom__icontains=search)
            )

        # Sort by age
        if sort == "age":
            queryset = queryset.order_by("age")
        elif sort == "-age":
            queryset = queryset.order_by("-age")

        return JsonResponse(list(queryset.values()), safe=False)
```

**Examples:**
```
GET /api/members/                    # All members
GET /api/members/?search=Ahmed       # Search by name
GET /api/members/?id=5               # Search by ID
GET /api/members/?sort=age           # Sort by age (young first)
GET /api/members/?sort=-age          # Sort by age (old first)
GET /api/members/?search=Ali&sort=age  # Combined search + sort
```

---

#### Create Member
**`POST /api/members/`**

**Request Body (JSON):**
```json
{
    "nom": "Ben Ali",
    "prenom": "Ahmed",
    "age": 25,
    "telephone": "12345678"
}
```

**Response:**
```json
{"id": 1}
```

---

#### Get Single Member
**`GET /api/members/{id}/`**

**Response:**
```json
{
    "id": 1,
    "nom": "Ben Ali",
    "prenom": "Ahmed",
    "age": 25,
    "telephone": "12345678"
}
```

---

#### Update Member
**`PUT /api/members/{id}/`**

**Request Body (JSON):** Only include fields to update
```json
{
    "age": 26,
    "telephone": "87654321"
}
```

**Code Logic:**
```python
def member_detail(request, member_id):
    member = Member.objects.get(id=member_id)
    
    if request.method == "PUT":
        data = json.loads(request.body)
        for field, value in data.items():
            setattr(member, field, value)  # Dynamic field update
        member.save()
        return JsonResponse({"success": True})
```

---

#### Delete Member
**`DELETE /api/members/{id}/`**

**Response:**
```json
{"success": true}
```

---

### 2. Activities Management

#### List All Activities
**`GET /api/activities/`**

| Query Param | Description                                      |
|-------------|--------------------------------------------------|
| `search`    | Search by activity name (partial match)          |
| `sort`      | `capacite` (ascending) or `-capacite` (descending) |

**Examples:**
```
GET /api/activities/                     # All activities
GET /api/activities/?search=Gym          # Search by name
GET /api/activities/?sort=capacite       # Sort by capacity (small first)
```

---

#### Create Activity
**`POST /api/activities/`**

**Request:** `multipart/form-data` (supports file upload)

| Field          | Type   | Required |
|----------------|--------|----------|
| `code_act`     | String | Yes      |
| `nom_act`      | String | Yes      |
| `tarif_mensuel`| Float  | Yes      |
| `capacite`     | Integer| Yes      |
| `photo`        | File   | No       |

**Code Logic:**
```python
if request.method == "POST":
    activity = Activity.objects.create(
        code_act=request.POST["code_act"],
        nom_act=request.POST["nom_act"],
        tarif_mensuel=request.POST["tarif_mensuel"],
        capacite=request.POST["capacite"],
        photo=request.FILES.get("photo")  # Optional file
    )
    return JsonResponse({"id": activity.id})
```

---

#### Get Single Activity
**`GET /api/activities/{id}/`**

**Response:**
```json
{
    "id": 1,
    "code_act": "GYM001",
    "nom_act": "Gym",
    "tarif_mensuel": 50.0,
    "capacite": 30,
    "photo": "/media/activities/gym.jpg"
}
```

---

#### Update Activity
**`PUT /api/activities/{id}/`**

**Request:** `multipart/form-data`

---

#### Delete Activity
**`DELETE /api/activities/{id}/`**

---

### 3. Enrollments Management

#### List All Enrollments
**`GET /api/enrollments/`**

**Response:**
```json
[
    {
        "id": 1,
        "membre__nom": "Ben Ali",
        "membre__prenom": "Ahmed",
        "activite__nom_act": "Gym",
        "date_inscription": "2026-01-22"
    }
]
```

**Code Logic** (uses `select_related` for optimized queries):
```python
def enrollments(request):
    if request.method == "GET":
        data = Enrollment.objects.select_related("membre", "activite").values(
            "id",
            "membre__nom",
            "membre__prenom",
            "activite__nom_act",
            "date_inscription"
        )
        return JsonResponse(list(data), safe=False)
```

---

#### Create Enrollment
**`POST /api/enrollments/`**

**Request Body:**
```json
{
    "membre_id": 1,
    "activite_id": 2
}
```

**Capacity Check Logic:**
```python
if request.method == "POST":
    membre = Member.objects.get(id=data["membre_id"])
    activite = Activity.objects.get(id=data["activite_id"])

    # Check if activity is full
    count = Enrollment.objects.filter(activite=activite).count()
    if count >= activite.capacite:
        return JsonResponse({"error": "Activity is full"}, status=400)

    enrollment = Enrollment.objects.create(membre=membre, activite=activite)
```

**Error Response (if full):**
```json
{"error": "Activity is full"}
```

---

#### Get Single Enrollment
**`GET /api/enrollments/{id}/`**

**Response:**
```json
{
    "id": 1,
    "membre_id": 1,
    "membre_nom": "Ben Ali",
    "membre_prenom": "Ahmed",
    "activite_id": 2,
    "activite_nom": "Gym",
    "date_inscription": "2026-01-22"
}
```

---

#### Update Enrollment
**`PUT /api/enrollments/{id}/`**

Change member or activity of an enrollment:

```json
{
    "activite_id": 3
}
```

**Capacity Check on Update:**
```python
if "activite_id" in data:
    new_activite = Activity.objects.get(id=data["activite_id"])
    # Exclude current enrollment from count
    count = Enrollment.objects.filter(activite=new_activite).exclude(id=enrollment_id).count()
    if count >= new_activite.capacite:
        return JsonResponse({"error": "Activity is full"}, status=400)
    enrollment.activite = new_activite
```

---

#### Delete Enrollment
**`DELETE /api/enrollments/{id}/`**

---

### 4. Statistics

#### Overview Statistics
**`GET /api/stats/`**

**Response:**
```json
{
    "total_members": 45,
    "most_popular_activity": {
        "nom": "Gym",
        "inscriptions": 25
    },
    "least_popular_activity": {
        "nom": "Tennis",
        "inscriptions": 5
    }
}
```

---

#### Activities Statistics
**`GET /api/stats/activities/`**

**Response:**
```json
[
    {
        "code_act": "GYM001",
        "nom_act": "Gym",
        "tarif_mensuel": 50.0,
        "capacite": 30,
        "nb_inscriptions": 25,
        "places_disponibles": 5
    },
    {
        "code_act": "TEN001",
        "nom_act": "Tennis",
        "tarif_mensuel": 40.0,
        "capacite": 20,
        "nb_inscriptions": 5,
        "places_disponibles": 15
    }
]
```

---

#### Members per Activity
**`GET /api/stats/members-per-activity/`**

**Response:**
```json
{
    "Gym": [
        {"nom": "Ben Ali", "prenom": "Ahmed"},
        {"nom": "Trabelsi", "prenom": "Sami"}
    ],
    "Tennis": [
        {"nom": "Mejri", "prenom": "Amine"}
    ]
}
```

---

## 🏗️ Code Architecture

### Services Layer (`club/services/statistics.py`)

Business logic is separated from API views for better maintainability:

```python
from django.db.models import Count
from club.models import Member, Activity, Enrollment


def total_members():
    """Returns total number of members in the club"""
    return Member.objects.count()


def activities_with_counts():
    """
    Returns all activities annotated with enrollment count.
    Uses Django's annotate() for efficient SQL aggregation.
    """
    return (
        Activity.objects
        .annotate(nb_inscriptions=Count("enrollment"))
        .order_by("-nb_inscriptions")
    )


def most_popular_activity():
    """Returns the activity with the most enrollments"""
    return activities_with_counts().first()


def least_popular_activity():
    """Returns the activity with the fewest enrollments"""
    return activities_with_counts().last()


def members_per_activity():
    """
    Groups members by activity.
    Returns: {"Gym": [{nom, prenom}, ...], "Tennis": [...]}
    """
    result = {}
    enrollments = (
        Enrollment.objects
        .select_related("membre", "activite")  # Optimized SQL joins
        .order_by("activite__nom_act")
    )

    for enrollment in enrollments:
        activity_name = enrollment.activite.nom_act
        if activity_name not in result:
            result[activity_name] = []
        result[activity_name].append({
            "nom": enrollment.membre.nom,
            "prenom": enrollment.membre.prenom
        })
    return result
```

### Decorators Used

| Decorator                  | Purpose                                    |
|----------------------------|--------------------------------------------|
| `@csrf_exempt`             | Allows API calls without CSRF token        |
| `@staff_member_required`   | Restricts access to admin/staff users only |

---

## 📝 Usage Examples

### Prerequisites

Before making API calls, ensure you have:

1. **Installed all dependencies:**
   ```bash
   pip install django pillow django-cors-headers djangorestframework djangorestframework-simplejwt
   ```

2. **Configured CORS** in your `settings.py` (see Installation section)

3. **Created an admin user:**
   ```bash
   python manage.py createsuperuser
   ```

### Using cURL

```bash
# Login
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -d "username=admin&password=admin123" -c cookies.txt

# Create a member
curl -X POST http://127.0.0.1:8000/api/members/ \
  -H "Content-Type: application/json" \
  -d '{"nom":"Ben Ali","prenom":"Ahmed","age":25,"telephone":"12345678"}' \
  -b cookies.txt

# Search members by name, sorted by age
curl "http://127.0.0.1:8000/api/members/?search=Ahmed&sort=age" -b cookies.txt

# Create activity with photo
curl -X POST http://127.0.0.1:8000/api/activities/ \
  -F "code_act=GYM001" \
  -F "nom_act=Gym" \
  -F "tarif_mensuel=50" \
  -F "capacite=30" \
  -F "photo=@gym.jpg" \
  -b cookies.txt

# Enroll member to activity
curl -X POST http://127.0.0.1:8000/api/enrollments/ \
  -H "Content-Type: application/json" \
  -d '{"membre_id":1,"activite_id":1}' \
  -b cookies.txt

# Get statistics
curl http://127.0.0.1:8000/api/stats/ -b cookies.txt
```

### Using JavaScript (Fetch API)

```javascript
// Login
const login = await fetch('/api/auth/login/', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'username=admin&password=admin123',
    credentials: 'include'
});

// Get all members sorted by age
const members = await fetch('/api/members/?sort=age', {
    credentials: 'include'
}).then(r => r.json());

// Create enrollment
const enrollment = await fetch('/api/enrollments/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({membre_id: 1, activite_id: 2}),
    credentials: 'include'
}).then(r => r.json());
```

---

## 🛠️ Troubleshooting

### Common Issues

| Error/Issue | Solution |
|-------------|----------|
| `ModuleNotFoundError: No module named 'corsheaders'` | `pip install django-cors-headers` |
| `ModuleNotFoundError: No module named 'PIL'` | `pip install pillow` |
| `ModuleNotFoundError: No module named 'rest_framework'` | `pip install djangorestframework` |
| `ModuleNotFoundError: No module named 'rest_framework_simplejwt'` | `pip install djangorestframework-simplejwt` |
| **404 error at `http://127.0.0.1:8000/`** | **This is normal!** Use specific endpoints like `/admin/` or `/members/` |
| CORS errors in browser | Add your frontend URL to `CORS_ALLOWED_ORIGINS` |
| 403 Forbidden on API calls | Ensure you're logged in as staff user |
| Can't access admin panel | Create superuser: `python manage.py createsuperuser` |

### Server Status Messages

| Message | Meaning |
|---------|---------|
| `Starting development server at http://127.0.0.1:8000/` | ✅ **Success!** Server is running |
| `System check identified no issues` | ✅ **Good!** No configuration problems |
| `Not Found: /` | ℹ️ **Normal** - Root URL doesn't exist, use API endpoints |

### Complete Dependencies List

Create a `requirements.txt` file in your project root:

```txt
Django>=4.2.0
Pillow>=9.0.0
django-cors-headers>=4.0.0
djangorestframework>=3.14.0
djangorestframework-simplejwt>=5.2.0
```

Install with: `pip install -r requirements.txt`

### Alternative: Remove JWT if Not Needed

If your project doesn't actually use JWT authentication (since you're using session-based auth), you can:

1. **Check your `settings.py`** - look for `rest_framework_simplejwt` in `INSTALLED_APPS`
2. **Remove JWT references** if not needed:
   ```python
   # In settings.py, remove these if present:
   # 'rest_framework_simplejwt',
   # 'rest_framework_simplejwt.token_blacklist',
   ```
3. **Check `urls.py`** for JWT token endpoints and remove if not used

### Quick Fix Command

Run this single command to install all dependencies:

```bash
pip install django pillow django-cors-headers djangorestframework djangorestframework-simplejwt
```

---

## 📊 API Summary Table

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| POST   | `/api/auth/login/`              | Admin login                    |
| GET    | `/api/auth/logout/`             | Logout                         |
| GET    | `/api/members/`                 | List members (search, sort)    |
| POST   | `/api/members/`                 | Create member                  |
| GET    | `/api/members/{id}/`            | Get single member              |
| PUT    | `/api/members/{id}/`            | Update member                  |
| DELETE | `/api/members/{id}/`            | Delete member                  |
| GET    | `/api/activities/`              | List activities                |
| POST   | `/api/activities/`              | Create activity                |
| GET    | `/api/activities/{id}/`         | Get single activity            |
| PUT    | `/api/activities/{id}/`         | Update activity                |
| DELETE | `/api/activities/{id}/`         | Delete activity                |
| GET    | `/api/enrollments/`             | List enrollments               |
| POST   | `/api/enrollments/`             | Create enrollment              |
| GET    | `/api/enrollments/{id}/`        | Get single enrollment          |
| PUT    | `/api/enrollments/{id}/`        | Update enrollment              |
| DELETE | `/api/enrollments/{id}/`        | Delete enrollment              |
| GET    | `/api/stats/`                   | Overview statistics            |
| GET    | `/api/stats/activities/`        | Activities with counts         |
| GET    | `/api/stats/members-per-activity/` | Members grouped by activity |

---

## 📜 License

This project was developed for educational purposes - Sports Club Management System.

---

**Made with ❤️ using Django**
