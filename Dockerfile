# Stage 1: Build frontend
FROM node:20 AS frontend

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
# RUN npm config set registry http://registry.npmjs.org/
# RUN npm set progress=false
RUN npm install --verbose
COPY frontend ./
RUN npm run build

# Stage 2: Build backend and final image
FROM python:3.12-slim AS backend

WORKDIR /app
COPY backend/ ./backend/
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy frontend build
COPY --from=frontend /app/frontend/dist ./frontend/dist

ENV FLASK_APP=backend/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=production

# Expose port
EXPOSE 5000

# Run the app
# CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "-b", "0.0.0.0:5000", "backend.app:app"]
CMD ["python", "-m", "backend.app"]
