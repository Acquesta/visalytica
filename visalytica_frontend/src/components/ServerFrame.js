"use client";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function VideoReceiver({ camera, refVideo, frameCaptura, medidas, qr, setClasse }) {
  const videoRef = refVideo;
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    navigator.mediaDevices
      .getUserMedia({ video: camera.id ? { deviceId: { exact: camera.id } } : true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Erro câmera:", err));

    const sendFrames = setInterval(() => {
      if (!videoRef?.current) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpg");

      frameCaptura(dataUrl)

      socketRef.current.emit("frame", { cameraId: camera.id, data: dataUrl, posicao: camera.posicao });
    }, 500); // 5 FPS

    return () => {
      clearInterval(sendFrames);
      socketRef.current.disconnect();
    };
  }, []);

  // Pega webCam processado do servidor
  const [frame, setFrame] = useState("");

  useEffect(() => {
    socket.on("server_frame_yolo", (data) => {
      if (data.cameraId == camera.id) {
        setFrame(data.frame)
        frameCaptura(data.frame)
        setClasse(data.classe)
        

        if (camera.posicao == `cima` && data.medidas[0]) {
          if (data.medidas[0][0]) {
            data.medidas[0][0] < medidas.comprimento_cm || medidas.comprimento_cm == 0 ? medidas.comprimento_cm = data?.medidas[0][0] : ``
          }
          if (data?.medidas[0][1]) {
            data.medidas[0][1] < medidas.largura_cm || medidas.largura_cm == 0 ? medidas.largura_cm = data?.medidas[0][1] : ``
          }
        } else if (data.medidas[0]) {
          if (data?.medidas[0][0]) {
            data.medidas[0][0] < medidas.altura_cm || medidas.altura_cm == 0 ? medidas.altura_cm = data?.medidas[0][1] : ``
          }
        }

        // console.log(data.medidas);

      }
    });
  }, []);


  return (
    <div className="w-full h-full">
      {
        qr && <video ref={videoRef} autoPlay playsInline className="hidden" />
      }
      {(qr && frame) ? <img src={frame} alt="frame" className="h-[32vh] mx-auto bg-gray-900" /> : 
      
      <div className="bg-gray-900 h-full w-full flex justify-center items-center rounded-[10px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="150"
          height="110"
          viewBox="0 0 150 110"
          fill="none"
        >
          <path
            d="M135.938 110H14.0625C6.2959 110 0 103.844 0 96.25V13.75C0 6.15599 6.2959 0 14.0625 0H135.938C143.704 0 150 6.15599 150 13.75V96.25C150 103.844 143.704 110 135.938 110ZM32.8125 16.0417C23.7516 16.0417 16.4062 23.2238 16.4062 32.0833C16.4062 40.9429 23.7516 48.125 32.8125 48.125C41.8734 48.125 49.2188 40.9429 49.2188 32.0833C49.2188 23.2238 41.8734 16.0417 32.8125 16.0417ZM18.75 91.6667H131.25V59.5833L105.611 34.5139C104.238 33.1716 102.012 33.1716 100.639 34.5139L60.9375 73.3333L44.6733 57.4306C43.3005 56.0883 41.0745 56.0883 39.7014 57.4306L18.75 77.9167V91.6667Z"
            fill="#CFCFCF"
          />
        </svg>
      </div>}
    </div>
  );
}
