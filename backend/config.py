class Config:
    NEBIUS_API_KEY = None  # Debe ser configurado mediante variable de entorno
    NEBIUS_ENDPOINT = "https://api.studio.nebius.com/v1"  # Actualizando el endpoint correcto
    NEBIUS_IMAGE_API = NEBIUS_ENDPOINT + "/images"
    NEBIUS_TEXT_API = NEBIUS_ENDPOINT + "/text"
