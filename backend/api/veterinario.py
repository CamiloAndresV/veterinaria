from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import VeterinarioLogin,VeterinarioSchema
from models import Veterinario

router = APIRouter(prefix="/api/v1/veterinario",tags=["veterinario"])

@router.post("/")
def login(veterinario_data:VeterinarioLogin,db:Session = Depends(get_db)):
    print(veterinario_data)
    veterinario = db.query(Veterinario).filter(Veterinario.username == veterinario_data.username, Veterinario.password == veterinario_data.password).first()
    if not veterinario: 
        return {"message":"Usuario no encontrado o contraseña invalida"} 
    return veterinario