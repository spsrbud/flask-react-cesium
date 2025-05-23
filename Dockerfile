# Stage 1: Build frontend
FROM node:20-alpine AS frontend

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ .
# Debug: Inspect cesium Workers directory
RUN ls -la node_modules/cesium/Source/Workers || true
RUN npm run build
# Debug: Verify built Cesium Workers files
RUN ls -la dist/cesium/Workers || true
RUN test -f dist/cesium/Workers/createVerticesFromHeightmap.js && echo "Worker file found" || echo "Worker file missing"

# Stage 2: Build backend and final image
FROM python:3.12-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 5000

# Run the app
CMD ["gunicorn", "-b", "0.0.0.0:5000", "backend.app:app"]
