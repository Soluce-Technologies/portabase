# Stage 1: Build the frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend
FROM python:3.11-slim AS backend-build
WORKDIR /app/backend
COPY backend/requirements/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
RUN apt-get -y update
RUN apt-get -y install curl

# Copy the built frontend to the backend's static directory
COPY --from=frontend-build /app/frontend/dist /app/backend/static

# Expose the backend port (e.g., 80 for FastAPI)
EXPOSE 80

# Set the environment to production
ENV ENV=production

# Set the command to run the backend server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
#CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:80","--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker"]
