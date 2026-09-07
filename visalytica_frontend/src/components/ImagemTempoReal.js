"use client";

import { useEffect, useState } from "react";
import ServerFrame from "./ServerFrame";

export default function ImagemTempoReal({
  label,
  selectedDevice,
  refVideo,
  frameCaptura,
  medidas,
  status = false,
  qr,
}) {
  const [classeIdentificada, setClasseIdentificada] = useState(null);

  useEffect(() => console.log(classeIdentificada), [classeIdentificada])

  return (
    <div
      className={`flex flex-col items-center w-auto h-full relative rounded-xl`}
    >
      <div className="w-full flex justify-between items-center my-2 xs:my-3">
        <p className="text-[#444444] text-xs xs:text-sm sm:text-base dark:text-cinza">
          {label}
        </p>
        <div className="flex">
          {classeIdentificada && (
            <p
              className={`px-3 xs:px-4 sm:px-5 py-1 xs:py-1.5 rounded-[10px] text-xs mr-5 bg-azul text-white font-semibold`}
            >
              {classeIdentificada}
            </p>
          )}
          <p
            style={{
              backgroundColor: status ? "#439F57" : "#CFCFCF",
              color: status && "#fff",
            }}
            className={`px-3 xs:px-4 sm:px-5 py-1 xs:py-1.5 rounded-[10px] text-xs mr-5 whitespace-nowrap dark:text-black`}
          >
            {status ? "Capturado" : "Não capturado"}
          </p>
        </div>
      </div>
      {selectedDevice ? (
        <ServerFrame
          camera={selectedDevice}
          refVideo={refVideo}
          frameCaptura={frameCaptura}
          medidas={medidas}
          setClasse={setClasseIdentificada}
          qr={qr}
        />
      ) : (
        <div className="bg-gray-900 h-full w-full max-lg:min-h-40 flex justify-center items-center rounded-[10px]">
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
        </div>
      )}
    </div>
  );
}
