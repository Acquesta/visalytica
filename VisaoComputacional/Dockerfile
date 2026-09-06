# ============================================================
# Visao Computacional Visalytica - YOLOv8 + Flask-SocketIO
#
# Base CPU (python:3.11-slim), roda em qualquer maquina, sem
# precisar de GPU NVIDIA nem do NVIDIA Container Toolkit.
# Se voce tiver GPU NVIDIA e quiser acelerar a inferencia,
# me avise que eu preparo uma variante com base nvidia/cuda +
# torch com suporte a CUDA.
# ============================================================
FROM python:3.11-slim

WORKDIR /app

# libgl1/libglib2.0-0: dependencias de sistema do opencv
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Instala a build CPU-only do torch antes do ultralytics, para nao
# baixar a build com CUDA (muito maior e desnecessaria sem GPU).
RUN pip3 install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu \
 && pip3 install --no-cache-dir -r requirements.txt

COPY versao_final.py .
COPY my_model.pt .

EXPOSE 5000

CMD ["python3", "versao_final.py"]
