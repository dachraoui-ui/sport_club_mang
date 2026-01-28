# 🐳 Docker Setup for SportHub

This folder contains everything needed to run the SportHub project using Docker.

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start

### 1. Open a terminal in this `docker` folder

```bash
cd docker
```

### 2. Build and run both services

```bash
docker-compose up --build
```

### 3. Access the application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **Django Admin** | http://localhost:8000/admin |

## 📝 Commands

### Start services (with logs)
```bash
docker-compose up
```

### Start services (background)
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Create Django superuser (admin account)
```bash
docker-compose exec backend python manage.py createsuperuser
```

## 📁 Files

| File | Description |
|------|-------------|
| `docker-compose.yml` | Orchestrates both services |
| `backend.Dockerfile` | Django backend image |
| `frontend.Dockerfile` | React frontend image |

## 💾 Data Persistence

The following data is persisted on your host machine:

- **Database**: `Backend/db.sqlite3`
- **Uploaded photos**: `Backend/media/`

## ⚠️ Troubleshooting

### Port already in use
```bash
# Change ports in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead of 8000
```

### Permission issues on Linux/Mac
```bash
sudo chown -R $USER:$USER ../Backend/media
```

### Clear everything and start fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 🔧 For Development

The current setup mounts your local files, so changes are reflected immediately:
- Frontend: Hot reload enabled
- Backend: Django auto-reload enabled

---

**Note**: This setup is for local development/portability, not production deployment.
