import "../globals.css";
import logoVisalytica from "../../assets/logoVisalyticaGrad.svg";
import logoDasa from "../../assets/logoDasa.svg";
import Image from "next/image";

export default function RootLayout({ children }) {
  return (
    <main className="flex h-screen">
      <div className="h-screen w-full relative overflow-hidden hidden lg:flex">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/authvideo.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="mt-auto flex flex-col items-center">
          <Image
            src={logoVisalytica}
            alt="logo visalytica"
            className="w-64 h-24"
          />
          <div className="mt-14 p-[30px] border border-azul rounded-[10px] max-w-96 mx-4 shadow-[4px_4px_0_1px_#166DED]">
            {children}
          </div>
        </div>
        <div className="my-auto">
          <a href="https://www.dasa.com.br" target="_blank" rel="noreferrer">
          <Image src={logoDasa} alt="logo dasa" />
          </a>
        </div>
      </div>
    </main>
  );
}
