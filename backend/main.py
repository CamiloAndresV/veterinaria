from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db, SessionLocal
from models import Veterinario
from api.veterinario import router as veterinario_router

app = FastAPI()


# Lista de orígenes permitidos (React suele correr en localhost:3000 durante el desarrollo)
origins = [
    "http://localhost:5174",  # Origen del frontend en desarrollo
]

# Agregar el middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Lista de orígenes permitidos
    allow_credentials=True,  # Permitir cookies y credenciales
    allow_methods=["*"],  # Permitir todos los métodos HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)

@app.get("/")
def root():
    return "Hola, FastAPI"


if __name__ == "__main__":
    create_db()

app.include_router(veterinario_router)