"use client";

import Image from "next/image";
import LogoVisalytica from "../assets/logoVisalyticaAzulClaro.svg";
import LogoDasa from "../../public/LogoDasa.svg";
import IconePessoa from "../../public/IconePessoa.svg";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Hotbar() {
  const [onHover, setOnHover] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    router.push("/login");
  };

  if (!auth.user) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex h-[60px] xs:h-[70px] sm:h-[80px] md:h-[90px] lg:h-[101px] items-center justify-between px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-1 xs:py-1.5 sm:py-2 bg-white shadow-sm">
      
      <div className="flex justify-between items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
        <Link href={"/Home"}>
          <Image
            src={LogoVisalytica}
            alt="Logo da Visalytica"
            className="w-20 xs:w-24 sm:w-28 md:w-32 lg:w-36 xl:w-44"
          />
        </Link>
        <div className="w-0.5 h-[18px] xs:h-[20px] sm:h-[22px] md:h-[25px] lg:h-[30px] xl:h-[37px] bg-azul"></div>
        <a href="https://www.dasa.com.br" target="_blank" rel="noreferrer">
          <Image 
            src={LogoDasa} 
            alt="Logo da Dasa" 
            className="h-4 xs:h-5 sm:h-5.5 md:h-6 lg:h-7 xl:h-8 w-auto" 
          />
        </a>
      </div>
      
      {/* User Section */}
      <div
        className="relative"
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
      >
        {/* User Section (Trigger) - eventos de hover foram REMOVIDOS daqui */}
        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 cursor-pointer">
          <Image 
            src={IconePessoa} 
            alt="Icone de uma pessoa" 
          />
          
          <h3 className="text-azul text-xs xs:text-sm sm:text-base font-semibold">
            Olá, 
            <span className="ml-1">{auth.user.nome.split(' ')[0]}</span>
          </h3>
        </div>
        
        {/* Dropdown Logout */}
        {onHover && (
          <div
            onClick={handleLogout}
            // 2. POSIÇÃO AJUSTADA para ficar relativa ao novo container pai
            className="absolute top-[15px] right-0 md:right-[-20px] mt-2 flex items-center h-10 w-[90px] md:w-[150px] rounded-[10px] border border-cinza bg-white cursor-pointer"
          >
            <div className="ml-4 mr-2 md:mr-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="10"
                className="xs:w-[14px] xs:h-[11px] sm:w-[16px] sm:h-[12px] md:w-[18px] md:h-[14px] lg:w-[20px] lg:h-[15px] xl:w-[22px] xl:h-[17px]"
                viewBox="0 0 22 17"
                fill="none"
              >
                <path
                  d="M21.6955 9.25201L14.3618 16.6883C13.707 17.3522 12.5721 16.8875 12.5721 15.9358V11.6865H6.63525C6.05467 11.6865 5.58758 11.2129 5.58758 10.6242V6.37488C5.58758 5.78618 6.05467 5.31256 6.63525 5.31256H12.5721V1.06326C12.5721 0.116027 13.7027 -0.353166 14.3618 0.310786L21.6955 7.74705C22.1015 8.16313 22.1015 8.83593 21.6955 9.25201ZM8.38137 16.467V14.6964C8.38137 14.4043 8.14564 14.1653 7.85753 14.1653H4.19068C3.41803 14.1653 2.79379 13.5323 2.79379 12.7488V4.25024C2.79379 3.46677 3.41803 2.8338 4.19068 2.8338H7.85753C8.14564 2.8338 8.38137 2.59478 8.38137 2.30264V0.532103C8.38137 0.239964 8.14564 0.000941421 7.85753 0.000941421H4.19068C1.87708 0.000941421 0 1.90427 0 4.25024V12.7488C0 15.0948 1.87708 16.9981 4.19068 16.9981H7.85753C8.14564 16.9981 8.38137 16.7591 8.38137 16.467Z"
                  fill="#166DED"
                />
              </svg>
            </div>
            <p className="text-azul font-semibold text-xs xs:text-sm">Sair</p>
          </div>
        )}
      </div>
    </div>
  );
}