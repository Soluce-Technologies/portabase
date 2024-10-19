import os

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from routes.main import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

if os.getenv("ENV") == "production":
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    app.mount("/static", StaticFiles(directory="static", html=True), name="static")


@app.get("/{full_path:path}")
def read_react_app(full_path: str):
    return FileResponse("static/index.html")
