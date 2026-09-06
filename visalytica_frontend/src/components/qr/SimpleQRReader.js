import React, { useRef, useEffect, useState } from "react";

const SimpleQRReader = ({ constraints, onRead, onClose }) => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [stream, setStream] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!imageMode) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.removeEventListener("loadeddata", startQRDetection);
      }
      setIsScanning(false);
    };
  }, [constraints, imageMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: constraints || {
          facingMode: "environment",
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 30, min: 15 },
        },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.removeEventListener("loadeddata", startQRDetection);

        videoRef.current.srcObject = mediaStream;

        videoRef.current.onloadedmetadata = async () => {
          try {
            if (videoRef.current) {
              await videoRef.current.play();
              startQRDetection();
            }
          } catch (playError) {
            console.warn("Erro ao reproduzir vídeo:", playError);
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current
                  .play()
                  .catch((e) => console.warn("Retry play failed:", e));
              }
            }, 100);
          }
        };
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setError(`Erro ao acessar câmera: ${err.message}`);
      setIsLoading(false);
    }
  };

  const startQRDetection = () => {
    setIsScanning(true);
    let detectionInterval;
    let isProcessing = false;

    const detectQR = () => {
      if (
        !videoRef.current ||
        !canvasRef.current ||
        imageMode ||
        manualMode ||
        isProcessing
      ) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        isProcessing = true;

        try {
          const scale = 0.5;
          canvas.width = video.videoWidth * scale;
          canvas.height = video.videoHeight * scale;

          const context = canvas.getContext("2d", { willReadFrequently: true });
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          if (window.jsQR) {
            const code = window.jsQR(
              imageData.data,
              imageData.width,
              imageData.height,
              {
                inversionAttempts: "dontInvert",
              }
            );

            if (code && code.data) {
              setIsScanning(false);
              if (detectionInterval) clearInterval(detectionInterval);

              setTimeout(() => {
                if (onRead) {
                  onRead(code.data);
                }
              }, 50);

              return;
            }
          }
        } catch (err) {
        } finally {
          isProcessing = false;
        }
      }
    };

    detectionInterval = setInterval(detectQR, 50);

    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
    };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      const img = new Image();
      img.onload = async () => {
        try {
          if (window.jsQR) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = window.jsQR(
              imageData.data,
              imageData.width,
              imageData.height
            );

            if (code && code.data) {
              setIsLoading(false);
              if (onRead) {
                onRead(code.data);
              }
              return;
            }
          }

          setError("QR Code não detectado na imagem. Use a opção manual.");
          setIsLoading(false);
        } catch (err) {
          console.error("Erro ao processar imagem:", err);
          setError(
            "Erro ao processar a imagem. Tente novamente ou use a opção manual."
          );
          setIsLoading(false);
        }

        URL.revokeObjectURL(imageUrl);
      };

      img.onerror = () => {
        setError(
          "Erro ao carregar a imagem. Verifique se o arquivo é uma imagem válida."
        );
        setIsLoading(false);
        URL.revokeObjectURL(imageUrl);
      };

      img.src = imageUrl;
    } catch (err) {
      console.error("Erro no upload:", err);
      setError("Erro ao processar o arquivo.");
      setIsLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (manualInput.trim() && onRead) {
      onRead(manualInput.trim());
    }
  };

  const handleTestData = () => {
    const testData = {
      cpf: "123.456.789-00",
      nomePaciente: "Paciente Teste",
      dataNascimento: "1990-01-15",
      nomePeca: "Pulmão",
    };
    if (onRead) {
      onRead(JSON.stringify(testData));
    }
  };

  useEffect(() => {
    if (!window.jsQR && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
      script.async = true;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  if (manualMode) {
    return (
      <div className="flex flex-col items-center justify-center p-3 xs:p-4 space-y-3 xs:space-y-4">
        <h2 className="text-lg font-bold mb-2">Inserir Dados Manualmente</h2>

        <div className="w-full max-w-xs space-y-3">
          <textarea
            className="w-full p-3 border rounded-md resize-none"
            rows="4"
            placeholder='Digite o JSON do QR Code, ex:
{"cpf":"123.456.789-00","nomePaciente":"João Silva"}'
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleManualSubmit}
            >
              Confirmar
            </button>
            <button
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleTestData}
            >
              Dados Teste
            </button>
          </div>

          <button
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => {
              setManualMode(false);
              setImageMode(false);
            }}
          >
            Voltar à Câmera
          </button>
        </div>
      </div>
    );
  }

  if (imageMode) {
    return (
      <div className="flex flex-col items-center justify-center p-3 xs:p-4 space-y-3 xs:space-y-4">
        <h2 className="text-lg font-bold mb-2">Upload de Imagem QR Code</h2>

        <div className="w-full max-w-xs space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 border-2 border-dashed border-blue-300"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? " Processando..." : " Selecionar Imagem"}
          </button>

          {uploadedImage && (
            <div className="text-center">
              <img
                src={uploadedImage}
                alt="QR Code"
                className="max-w-full h-32 object-contain mx-auto border rounded"
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => {
                setImageMode(false);
                setUploadedImage(null);
                setError("");
              }}
            >
              📷 Usar Câmera
            </button>
            <button
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              onClick={() => setManualMode(true)}
            >
              📝 Manual
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 xs:p-4">
      {isLoading && (
        <div className="mb-2 text-blue-600 text-sm">Carregando câmera...</div>
      )}

      <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black bg-opacity-40">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>

              {isScanning && (
                <div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                  style={{
                    animation: "whatsappScan 1s ease-in-out infinite",
                    boxShadow: "0 0 15px rgba(74, 222, 128, 0.8)",
                  }}
                ></div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes whatsappScan {
            0% { top: 10%; opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { top: 90%; opacity: 0; }
          }
        `}</style>
      </div>

      {error && (
        <div className="mt-4 text-center text-red-600">
          <p className="font-semibold">❌ {error}</p>
          <p className="text-xs mt-1 text-gray-600">
            Verifique as permissões da câmera
          </p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SimpleQRReader;
