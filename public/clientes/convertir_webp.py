import os
from PIL import Image

def convertir_a_webp(calidad=80):
    # Formatos que vamos a buscar
    extensiones_validas = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')
    
    # Crear carpeta de salida si no existe
    carpeta_salida = "webp_result"
    if not os.path.exists(carpeta_salida):
        os.makedirs(carpeta_salida)

    print(f"--- Iniciando conversión (Calidad: {calidad}%) ---")
    
    contador = 0
    for archivo in os.listdir('.'):
        if archivo.lower().endswith(extensiones_validas):
            try:
                # Abrir la imagen
                nombre_sin_ext = os.path.splitext(archivo)[0]
                img = Image.open(archivo)
                
                # Convertir a RGB (necesario para JPG/PNG con transparencia a veces)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")
                
                # Guardar como WebP
                img.save(f"{carpeta_salida}/{nombre_sin_ext}.webp", "WEBP", quality=calidad)
                print(f"✅ Convertido: {archivo}")
                contador += 1
            except Exception as e:
                print(f"❌ Error con {archivo}: {e}")

    print(f"\n--- Proceso terminado. {contador} imágenes convertidas en '{carpeta_salida}/' ---")

if __name__ == "__main__":
    # Puedes ajustar la calidad de 0 a 100
    convertir_a_webp(calidad=80)