"use client";

import Image from "next/image";
import LogoVisalytica from "../assets/logoVisalyticaAzulClaro.svg";
import LogoDasa from "../../public/LogoDasa.svg";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { NotificationPanel } from '../components/NotificationPanel';
import { useState } from 'react'; // Importar useState
import { Menu, X } from 'lucide-react'; // Importar ícones

// PASSO 3: Extrair o conteúdo do Sidebar
function SidebarContent({ user, pathName, handleLogout, closeMobileMenu, isMobile = false }) {
    const isPacientesActive = pathName === '/ConsultarPacientes' || pathName.startsWith('/pacientes/');
    
    // Função para fechar o menu ao clicar em um link (opcional)
    const handleLinkClick = () => {
        if (closeMobileMenu) {
            closeMobileMenu();
        }
    };

    return (
        <>
            {/* Top Section: Logos */}
            
            <div className="w-full">
{!isMobile && (
            <div className="flex flex-col items-center gap-3 mb-16">
                <Link href={user.role === "medico" ? "/Home" : "/Criar_usuario"} onClick={handleLinkClick}>
                    <Image
                        src={LogoVisalytica}
                        alt="Logo da Visalytica"
                        className="w-full px-10"
                        priority // Add priority for LCP
                    />
                </Link>
                <div className="w-20 h-0.5 bg-cinza dark:bg-cinza_escuro"></div>
                <a href="https://www.dasa.com.br" target="_blank" rel="noreferrer">
                    <Image src={LogoDasa} alt="Logo da Dasa" className="h-5" />
                </a>
            </div>
            )}

            {/* Middle Section: Links */}
            <div className="flex flex-col w-full"> {/* Adicionado w-full */}
                {user.role == "medico" ? (
                    <>
                        <Link href={`/Home`} onClick={handleLinkClick}>
                            <div
                                className="flex gap-4 px-6 py-4 w-full font-semibold hover:bg-gray-100 dark:hover:bg-noturno_claro transition-colors duration-150" // Melhorar hover
                                style={
                                  pathName == `/Home`
                                  ? { backgroundImage: `linear-gradient(to right, #166DED, #716FEA)` }
                                  : {}
                                }
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 17H9V12H7V17ZM15 17H17V7H15V17ZM11 17H13V14H11V17ZM11 12H13V10H11V12ZM5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V5H5V19Z" fill={pathName == `/Home` ? "white" : `#9B9B9B`} />
                                </svg>
                                <h2 style={pathName == `/Home` ? { color: `white` } : { color: `#9b9b9b` }}>
                                    Dashboard
                                </h2>
                            </div>
                        </Link>
                         {/* ... (Restante dos links para médico, adicionar onClick={handleLinkClick} em cada Link) ... */}
                        <Link href={`/Analise`} onClick={handleLinkClick}>
                             <div
                                className="flex gap-4 px-6 py-4 font-semibold hover:bg-gray-100 dark:hover:bg-noturno_claro transition-colors duration-150"
                                style={
                                  pathName == `/Analise` || pathName == "/GeraPDF"
                                  ? { backgroundImage: `linear-gradient(to right, #166DED, #716FEA)` }
                                  : {}
                                }
                                >
                                {/* SVG Analise */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M5 21V19H10V17C8.61667 17 7.4375 16.5125 6.4625 15.5375C5.4875 14.5625 5 13.3833 5 12C5 10.9833 5.27917 10.0583 5.8375 9.225C6.39583 8.39167 7.15 7.78333 8.1 7.4C8.23333 6.83333 8.52917 6.375 8.9875 6.025C9.44583 5.675 9.96667 5.5 10.55 5.5L10 3.95L10.95 3.6L10.6 2.7L12.5 2L12.8 2.95L13.75 2.6L16.5 10.1L15.55 10.45L15.9 11.4L14 12.1L13.7 11.15L12.75 11.5L12.15 9.85C11.9 10.0833 11.6125 10.2583 11.2875 10.375C10.9625 10.4917 10.6333 10.5333 10.3 10.5C9.93333 10.4667 9.59167 10.3542 9.275 10.1625C8.95833 9.97083 8.68333 9.73333 8.45 9.45C8 9.71667 7.64583 10.075 7.3875 10.525C7.12917 10.975 7 11.4667 7 12C7 12.8333 7.29167 13.5417 7.875 14.125C8.45833 14.7083 9.16667 15 10 15H18V17H13V19H19V21H5ZM13.65 9.55L14.55 9.2L12.85 4.5L11.9 4.85L13.65 9.55ZM10.5 9C10.7833 9 11.0208 8.90417 11.2125 8.7125C11.4042 8.52083 11.5 8.28333 11.5 8C11.5 7.71667 11.4042 7.47917 11.2125 7.2875C11.0208 7.09583 10.7833 7 10.5 7C10.2167 7 9.97917 7.09583 9.7875 7.2875C9.59583 7.47917 9.5 7.71667 9.5 8C9.5 8.28333 9.59583 8.52083 9.7875 8.7125C9.97917 8.90417 10.2167 9 10.5 9Z" fill={ pathName == `/Analise` || pathName == "/GeraPDF" ? "white" : `#9B9B9B` } /> </svg>
                                <h2 style={pathName == `/Analise` || pathName == "/GeraPDF" ? { color: `white` } : { color: `#9b9b9b` }}>
                                    Fazer análise
                                </h2>
                             </div>
                         </Link>
                         <Link href={`/ConsultarPacientes`} onClick={handleLinkClick}>
                             <div
                                className="flex gap-4 px-6 py-4 font-semibold hover:bg-gray-100 dark:hover:bg-noturno_claro transition-colors duration-150"
                                style={
                                  isPacientesActive
                                  ? { backgroundImage: `linear-gradient(to right, #166DED, #716FEA)` }
                                  : {}
                                }
                                >
                                {/* SVG Pacientes */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M0 18V16.425C0 15.7083 0.366667 15.125 1.1 14.675C1.83333 14.225 2.8 14 4 14C4.21667 14 4.425 14.0042 4.625 14.0125C4.825 14.0208 5.01667 14.0417 5.2 14.075C4.96667 14.425 4.79167 14.7917 4.675 15.175C4.55833 15.5583 4.5 15.9583 4.5 16.375V18H0ZM6 18V16.375C6 15.8417 6.14583 15.3542 6.4375 14.9125C6.72917 14.4708 7.14167 14.0833 7.675 13.75C8.20833 13.4167 8.84583 13.1667 9.5875 13C10.3292 12.8333 11.1333 12.75 12 12.75C12.8833 12.75 13.6958 12.8333 14.4375 13C15.1792 13.1667 15.8167 13.4167 16.35 13.75C16.8833 14.0833 17.2917 14.4708 17.575 14.9125C17.8583 15.3542 18 15.8417 18 16.375V18H6ZM19.5 18V16.375C19.5 15.9417 19.4458 15.5333 19.3375 15.15C19.2292 14.7667 19.0667 14.4083 18.85 14.075C19.0333 14.0417 19.2208 14.0208 19.4125 14.0125C19.6042 14.0042 19.8 14 20 14C21.2 14 22.1667 14.2208 22.9 14.6625C23.6333 15.1042 24 15.6917 24 16.425V18H19.5ZM8.125 16H15.9C15.7333 15.6667 15.2708 15.375 14.5125 15.125C13.7542 14.875 12.9167 14.75 12 14.75C11.0833 14.75 10.2458 14.875 9.4875 15.125C8.72917 15.375 8.275 15.6667 8.125 16ZM4 13C3.45 13 2.97917 12.8042 2.5875 12.4125C2.19583 12.0208 2 11.55 2 11C2 10.4333 2.19583 9.95833 2.5875 9.575C2.97917 9.19167 3.45 9 4 9C4.56667 9 5.04167 9.19167 5.425 9.575C5.80833 9.95833 6 10.4333 6 11C6 11.55 5.80833 12.0208 5.425 12.4125C5.04167 12.8042 4.56667 13 4 13ZM20 13C19.45 13 18.9792 12.8042 18.5875 12.4125C18.1958 12.0208 18 11.55 18 11C18 10.4333 18.1958 9.95833 18.5875 9.575C18.9792 9.19167 19.45 9 20 9C20.5667 9 21.0417 9.19167 21.425 9.575C21.8083 9.95833 22 10.4333 22 11C22 11.55 21.8083 12.0208 21.425 12.4125C21.0417 12.8042 20.5667 13 20 13ZM12 12C11.1667 12 10.4583 11.7083 9.875 11.125C9.29167 10.5417 9 9.83333 9 9C9 8.15 9.29167 7.4375 9.875 6.8625C10.4583 6.2875 11.1667 6 12 6C12.85 6 13.5625 6.2875 14.1375 6.8625C14.7125 7.4375 15 8.15 15 9C15 9.83333 14.7125 10.5417 14.1375 11.125C13.5625 11.7083 12.85 12 12 12ZM12 10C12.2833 10 12.5208 9.90417 12.7125 9.7125C12.9042 9.52083 13 9.28333 13 9C13 8.71667 12.9042 8.47917 12.7125 8.2875C12.5208 8.09583 12.2833 8 12 8C11.7167 8 11.4792 8.09583 11.2875 8.2875C11.0958 8.47917 11 8.71667 11 9C11 9.28333 11.0958 9.52083 11.2875 9.7125C11.4792 9.90417 11.7167 10 12 10Z" fill={ isPacientesActive ? "white" : `#9B9B9B` } /> </svg>
                                <h2 style={ isPacientesActive ? { color: `white` } : { color: `#9b9b9b` }}>
                                    Consultar pacientes
                                </h2>
                             </div>
                         </Link>
                    </>
                    
                ) : (
                  <>
                        {/* ... (Links para admin, adicionar onClick={handleLinkClick} em cada Link) ... */}
                         <Link href={`/Criar_usuario`} onClick={handleLinkClick}>
                             <div
                                className="flex gap-4 px-6 py-4 font-semibold hover:bg-gray-100 dark:hover:bg-noturno_claro transition-colors duration-150"
                                style={ pathName == `/Criar_usuario` ? { backgroundImage: `linear-gradient(to right, #166DED, #716FEA)` } : {} }
                            >
                                {/* SVG Criar Usuário */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 25 20" fill="none"> <path d="M24.375 8.125H21.875V5.625C21.875 5.28125 21.5938 5 21.25 5H20C19.6562 5 19.375 5.28125 19.375 5.625V8.125H16.875C16.5312 8.125 16.25 8.40625 16.25 8.75V10C16.25 10.3438 16.5312 10.625 16.875 10.625H19.375V13.125C19.375 13.4688 19.6562 13.75 20 13.75H21.25C21.5938 13.75 21.875 13.4688 21.875 13.125V10.625H24.375C24.7188 10.625 25 10.3438 25 10V8.75C25 8.40625 24.7188 8.125 24.375 8.125ZM8.75 10C11.5117 10 13.75 7.76172 13.75 5C13.75 2.23828 11.5117 0 8.75 0C5.98828 0 3.75 2.23828 3.75 5C3.75 7.76172 5.98828 10 8.75 10ZM12.25 11.25H11.5977C10.7305 11.6484 9.76562 11.875 8.75 11.875C7.73438 11.875 6.77344 11.6484 5.90234 11.25H5.25C2.35156 11.25 0 13.6016 0 16.5V18.125C0 19.1602 0.839844 20 1.875 20H15.625C16.6602 20 17.5 19.1602 17.5 18.125V16.5C17.5 13.6016 15.1484 11.25 12.25 11.25Z" fill={pathName == `/Criar_usuario` ? "white" : `#9B9B9B`} /> </svg>
                                <h2 style={pathName == `/Criar_usuario` ? { color: `white` } : { color: `#9b9b9b` }}>
                                    Criar usuário
                                </h2>
                             </div>
                         </Link>
                         <Link href={`/Excluir_amostras`} onClick={handleLinkClick}>
                             <div
                                className="flex gap-4 px-6 py-4 font-semibold hover:bg-gray-100 dark:hover:bg-noturno_claro transition-colors duration-150"
                                style={ pathName == `/Excluir_amostras` ? { backgroundImage: `linear-gradient(to right, #166DED, #716FEA)` } : {} }
                            >
                                {/* SVG Excluir Amostras */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M5 21V19H10V17C8.61667 17 7.4375 16.5125 6.4625 15.5375C5.4875 14.5625 5 13.3833 5 12C5 10.9833 5.27917 10.0583 5.8375 9.225C6.39583 8.39167 7.15 7.78333 8.1 7.4C8.23333 6.83333 8.52917 6.375 8.9875 6.025C9.44583 5.675 9.96667 5.5 10.55 5.5L10 3.95L10.95 3.6L10.6 2.7L12.5 2L12.8 2.95L13.75 2.6L16.5 10.1L15.55 10.45L15.9 11.4L14 12.1L13.7 11.15L12.75 11.5L12.15 9.85C11.9 10.0833 11.6125 10.2583 11.2875 10.375C10.9625 10.4917 10.6333 10.5333 10.3 10.5C9.93333 10.4667 9.59167 10.3542 9.275 10.1625C8.95833 9.97083 8.68333 9.73333 8.45 9.45C8 9.71667 7.64583 10.075 7.3875 10.525C7.12917 10.975 7 11.4667 7 12C7 12.8333 7.29167 13.5417 7.875 14.125C8.45833 14.7083 9.16667 15 10 15H18V17H13V19H19V21H5ZM13.65 9.55L14.55 9.2L12.85 4.5L11.9 4.85L13.65 9.55ZM10.5 9C10.7833 9 11.0208 8.90417 11.2125 8.7125C11.4042 8.52083 11.5 8.28333 11.5 8C11.5 7.71667 11.4042 7.47917 11.2125 7.2875C11.0208 7.09583 10.7833 7 10.5 7C10.2167 7 9.97917 7.09583 9.7875 7.2875C9.59583 7.47917 9.5 7.71667 9.5 8C9.5 8.28333 9.59583 8.52083 9.7875 8.7125C9.97917 8.90417 10.2167 9 10.5 9Z" fill={ pathName == `/Excluir_amostras` ? "white" : `#9B9B9B` } /> </svg>
                                <h2 style={ pathName == `/Excluir_amostras` ? { color: `white` } : { color: `#9b9b9b` }}>
                                    Excluir amostras
                                </h2>
                             </div>
                         </Link>
                         <Link href={`/Excluir_pacientes`} onClick={handleLinkClick}>
                             <div
                                className="flex gap-4 px-6 py-4 font-semibold hover:bg-gray-100 dark:hover:bg-noturno_claro transition-colors duration-150"
                                style={ pathName == `/Excluir_pacientes` ? { backgroundImage: `linear-gradient(to right, #166DED, #716FEA)` } : {} }
                            >
                                {/* SVG Excluir Pacientes */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M0 18V16.425C0 15.7083 0.366667 15.125 1.1 14.675C1.83333 14.225 2.8 14 4 14C4.21667 14 4.425 14.0042 4.625 14.0125C4.825 14.0208 5.01667 14.0417 5.2 14.075C4.96667 14.425 4.79167 14.7917 4.675 15.175C4.55833 15.5583 4.5 15.9583 4.5 16.375V18H0ZM6 18V16.375C6 15.8417 6.14583 15.3542 6.4375 14.9125C6.72917 14.4708 7.14167 14.0833 7.675 13.75C8.20833 13.4167 8.84583 13.1667 9.5875 13C10.3292 12.8333 11.1333 12.75 12 12.75C12.8833 12.75 13.6958 12.8333 14.4375 13C15.1792 13.1667 15.8167 13.4167 16.35 13.75C16.8833 14.0833 17.2917 14.4708 17.575 14.9125C17.8583 15.3542 18 15.8417 18 16.375V18H6ZM19.5 18V16.375C19.5 15.9417 19.4458 15.5333 19.3375 15.15C19.2292 14.7667 19.0667 14.4083 18.85 14.075C19.0333 14.0417 19.2208 14.0208 19.4125 14.0125C19.6042 14.0042 19.8 14 20 14C21.2 14 22.1667 14.2208 22.9 14.6625C23.6333 15.1042 24 15.6917 24 16.425V18H19.5ZM8.125 16H15.9C15.7333 15.6667 15.2708 15.375 14.5125 15.125C13.7542 14.875 12.9167 14.75 12 14.75C11.0833 14.75 10.2458 14.875 9.4875 15.125C8.72917 15.375 8.275 15.6667 8.125 16ZM4 13C3.45 13 2.97917 12.8042 2.5875 12.4125C2.19583 12.0208 2 11.55 2 11C2 10.4333 2.19583 9.95833 2.5875 9.575C2.97917 9.19167 3.45 9 4 9C4.56667 9 5.04167 9.19167 5.425 9.575C5.80833 9.95833 6 10.4333 6 11C6 11.55 5.80833 12.0208 5.425 12.4125C5.04167 12.8042 4.56667 13 4 13ZM20 13C19.45 13 18.9792 12.8042 18.5875 12.4125C18.1958 12.0208 18 11.55 18 11C18 10.4333 18.1958 9.95833 18.5875 9.575C18.9792 9.19167 19.45 9 20 9C20.5667 9 21.0417 9.19167 21.425 9.575C21.8083 9.95833 22 10.4333 22 11C22 11.55 21.8083 12.0208 21.425 12.4125C21.0417 12.8042 20.5667 13 20 13ZM12 12C11.1667 12 10.4583 11.7083 9.875 11.125C9.29167 10.5417 9 9.83333 9 9C9 8.15 9.29167 7.4375 9.875 6.8625C10.4583 6.2875 11.1667 6 12 6C12.85 6 13.5625 6.2875 14.1375 6.8625C14.7125 7.4375 15 8.15 15 9C15 9.83333 14.7125 10.5417 14.1375 11.125C13.5625 11.7083 12.85 12 12 12ZM12 10C12.2833 10 12.5208 9.90417 12.7125 9.7125C12.9042 9.52083 13 9.28333 13 9C13 8.71667 12.9042 8.47917 12.7125 8.2875C12.5208 8.09583 12.2833 8 12 8C11.7167 8 11.4792 8.09583 11.2875 8.2875C11.0958 8.47917 11 8.71667 11 9C11 9.28333 11.0958 9.52083 11.2875 9.7125C11.4792 9.90417 11.7167 10 12 10Z" fill={ pathName == `/Excluir_pacientes` ? "white" : `#9B9B9B` } /> </svg>
                                <h2 style={ pathName == `/Excluir_pacientes` ? { color: `white` } : { color: `#9b9b9b` }}>
                                    Excluir pacientes
                                </h2>
                             </div>
                         </Link>
                         <Link href={`/Excluir_medicos`} onClick={handleLinkClick}>
                             <div
                                className="flex gap-4 px-6 py-4 font-semibold hover:bg-gray-100 dark:hover:bg-noturno_claro transition-colors duration-150"
                                style={ pathName == `/Excluir_medicos` ? { backgroundImage: `linear-gradient(to right, #166DED, #716FEA)` } : {} }
                            >
                                {/* SVG Excluir Médicos */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 19 21" fill="none"> <path d="M9.5 10.5C12.4984 10.5 14.9286 8.1498 14.9286 5.25C14.9286 2.3502 12.4984 0 9.5 0C6.50156 0 4.07143 2.3502 4.07143 5.25C4.07143 8.1498 6.50156 10.5 9.5 10.5ZM4.41071 17.3906C4.41071 17.9361 4.86451 18.375 5.42857 18.375C5.99263 18.375 6.44643 17.9361 6.44643 17.3906C6.44643 16.8451 5.99263 16.4062 5.42857 16.4062C4.86451 16.4062 4.41071 16.8451 4.41071 17.3906ZM13.5714 11.8371V13.8469C15.1194 14.1504 16.2857 15.4793 16.2857 17.0625V18.7729C16.2857 19.0846 16.0567 19.3553 15.7386 19.4168L14.373 19.6793C14.1906 19.7162 14.0125 19.6014 13.9743 19.4209L13.8429 18.777C13.8047 18.6006 13.9234 18.4242 14.11 18.3914L14.9286 18.2314V17.0625C14.9286 14.4867 10.8571 14.3924 10.8571 17.1404V18.2355L11.6757 18.3955C11.858 18.4324 11.9768 18.6047 11.9429 18.7811L11.8114 19.425C11.7732 19.6014 11.5951 19.7162 11.4127 19.6834L10.0895 19.5111C9.75446 19.466 9.50424 19.1912 9.50424 18.859V17.0625C9.50424 15.4793 10.6705 14.1545 12.2185 13.8469V11.993C12.1252 12.0217 12.0319 12.0381 11.9386 12.0709C11.1752 12.3293 10.3567 12.4729 9.50424 12.4729C8.65179 12.4729 7.83326 12.3293 7.06987 12.0709C6.75603 11.9643 6.43795 11.8986 6.11138 11.8576V15.2045C7.09107 15.4875 7.80781 16.357 7.80781 17.3947C7.80781 18.6621 6.7433 19.6916 5.43281 19.6916C4.12232 19.6916 3.05781 18.6621 3.05781 17.3947C3.05781 16.357 3.77455 15.4875 4.75424 15.2045V11.9068C2.05692 12.3457 0 14.5934 0 17.325V19.1625C0 20.1756 0.852455 21 1.9 21H17.1C18.1475 21 19 20.1756 19 19.1625V17.325C19 14.3719 16.5911 11.9807 13.5714 11.8371Z" fill={ pathName == `/Excluir_medicos` ? "white" : `#9B9B9B` } /> </svg>
                                <h2 style={ pathName == `/Excluir_medicos` ? { color: `white` } : { color: `#9b9b9b` }}>
                                    Excluir médicos
                                </h2>
                             </div>
                         </Link>
                         

                    </>
                )}
                </div>
            </div>

            {/* Bottom Section: User Info & Logout */}
            <div className="relative">
                <div className="flex flex-col items-center gap-3"> {/* Removido cursor-pointer */}
                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                        {user.role !== 'admin' && <NotificationPanel />}
                    </div>
                    <div className="w-20 mt-2 h-[1px] bg-cinza dark:bg-noturno_borda"></div>
                    {/* SVG Profile Icon */}
                    {user.role == "medico" ? 

                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="25" viewBox="0 0 22 25" fill="none"> <path d="M10.9375 12.5C14.3896 12.5 17.1875 9.70215 17.1875 6.25C17.1875 2.79785 14.3896 0 10.9375 0C7.48535 0 4.6875 2.79785 4.6875 6.25C4.6875 9.70215 7.48535 12.5 10.9375 12.5ZM5.07812 20.7031C5.07812 21.3525 5.60059 21.875 6.25 21.875C6.89941 21.875 7.42188 21.3525 7.42188 20.7031C7.42188 20.0537 6.89941 19.5312 6.25 19.5312C5.60059 19.5312 5.07812 20.0537 5.07812 20.7031ZM15.625 14.0918V16.4844C17.4072 16.8457 18.75 18.4277 18.75 20.3125V22.3486C18.75 22.7197 18.4863 23.042 18.1201 23.1152L16.5479 23.4277C16.3379 23.4717 16.1328 23.335 16.0889 23.1201L15.9375 22.3535C15.8936 22.1436 16.0303 21.9336 16.2451 21.8945L17.1875 21.7041V20.3125C17.1875 17.2461 12.5 17.1338 12.5 20.4053V21.709L13.4424 21.8994C13.6523 21.9434 13.7891 22.1484 13.75 22.3584L13.5986 23.125C13.5547 23.335 13.3496 23.4717 13.1396 23.4326L11.6162 23.2275C11.2305 23.1738 10.9424 22.8467 10.9424 22.4512V20.3125C10.9424 18.4277 12.2852 16.8506 14.0674 16.4844V14.2773C13.96 14.3115 13.8525 14.3311 13.7451 14.3701C12.8662 14.6777 11.9238 14.8486 10.9424 14.8486C9.96094 14.8486 9.01855 14.6777 8.13965 14.3701C7.77832 14.2432 7.41211 14.165 7.03613 14.1162V18.1006C8.16406 18.4375 8.98926 19.4727 8.98926 20.708C8.98926 22.2168 7.76367 23.4424 6.25488 23.4424C4.74609 23.4424 3.52051 22.2168 3.52051 20.708C3.52051 19.4727 4.3457 18.4375 5.47363 18.1006V14.1748C2.36816 14.6973 0 17.373 0 20.625V22.8125C0 24.0186 0.981445 25 2.1875 25H19.6875C20.8936 25 21.875 24.0186 21.875 22.8125V20.625C21.875 17.1094 19.1016 14.2627 15.625 14.0918Z" fill="#166DED" /> </svg> : 
                        <svg width="31" height="25" viewBox="0 0 31 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.5742 18.2275C29.7002 17.5391 29.7002 16.8359 29.5742 16.1475L30.824 15.4199C30.9694 15.3369 31.0323 15.166 30.9839 15.0049C30.6593 13.9502 30.1022 12.9932 29.3756 12.2021C29.2642 12.0801 29.0849 12.0508 28.9396 12.1338L27.6898 12.8613C27.1618 12.4072 26.5562 12.0557 25.9023 11.8213V10.3662C25.9023 10.2002 25.786 10.0537 25.6261 10.0195C24.5459 9.77539 23.4462 9.78516 22.4192 10.0195C22.2594 10.0537 22.1431 10.2002 22.1431 10.3662V11.8213C21.4891 12.0557 20.8836 12.4072 20.3556 12.8613L19.1058 12.1338C18.9653 12.0508 18.7812 12.0801 18.6698 12.2021C17.9431 12.9932 17.3861 13.9502 17.0615 15.0049C17.013 15.166 17.0809 15.3369 17.2213 15.4199L18.4712 16.1475C18.3452 16.8359 18.3452 17.5391 18.4712 18.2275L17.2213 18.9551C17.076 19.0381 17.013 19.209 17.0615 19.3701C17.3861 20.4248 17.9431 21.377 18.6698 22.1729C18.7812 22.2949 18.9604 22.3242 19.1058 22.2412L20.3556 21.5137C20.8836 21.9678 21.4891 22.3193 22.1431 22.5537V24.0088C22.1431 24.1748 22.2594 24.3213 22.4192 24.3555C23.4995 24.5996 24.5992 24.5898 25.6261 24.3555C25.786 24.3213 25.9023 24.1748 25.9023 24.0088V22.5537C26.5562 22.3193 27.1618 21.9678 27.6898 21.5137L28.9396 22.2412C29.0801 22.3242 29.2642 22.2949 29.3756 22.1729C30.1022 21.3818 30.6593 20.4248 30.9839 19.3701C31.0323 19.209 30.9645 19.0381 30.824 18.9551L29.5742 18.2275ZM24.0275 19.5557C22.7293 19.5557 21.6781 18.4912 21.6781 17.1875C21.6781 15.8838 22.7341 14.8193 24.0275 14.8193C25.321 14.8193 26.377 15.8838 26.377 17.1875C26.377 18.4912 25.3258 19.5557 24.0275 19.5557ZM10.8511 12.5C14.276 12.5 17.0518 9.70215 17.0518 6.25C17.0518 2.79785 14.276 0 10.8511 0C7.42625 0 4.65049 2.79785 4.65049 6.25C4.65049 9.70215 7.42625 12.5 10.8511 12.5ZM20.5978 23.5596C20.4864 23.501 20.375 23.4326 20.2684 23.3691L19.8857 23.5938C19.595 23.7598 19.2656 23.8525 18.9362 23.8525C18.4082 23.8525 17.8995 23.6279 17.5362 23.2373C16.6497 22.2705 15.9715 21.0938 15.5888 19.8389C15.3224 18.9746 15.6809 18.0615 16.456 17.6074L16.8387 17.3828C16.8338 17.2559 16.8338 17.1289 16.8387 17.002L16.456 16.7773C15.6809 16.3281 15.3224 15.4102 15.5888 14.5459C15.6324 14.4043 15.6954 14.2627 15.7438 14.1211C15.5598 14.1064 15.3805 14.0625 15.1916 14.0625H14.3826C13.3072 14.5605 12.1107 14.8438 10.8511 14.8438C9.59164 14.8438 8.39995 14.5605 7.31968 14.0625H6.51069C2.91624 14.0625 0 17.002 0 20.625V22.6562C0 23.9502 1.04152 25 2.32525 25H19.377C19.8663 25 20.3217 24.8438 20.6947 24.585C20.6366 24.3994 20.5978 24.209 20.5978 24.0088V23.5596Z" fill="#166DED"/>
</svg>

                    }
                    <h3 className="text-cinza_escuro font-light dark:text-cinza_claro tracking-wider"> {/* Melhor contraste dark */}
                        Olá,
                        <span className="ml-1 font-bold ">{user.nome.split(" ")[0]}</span>
                    </h3>
                    <p className="text-roxo dark:text-azul underline cursor-pointer" onClick={handleLogout}>Sair</p>
                </div>
            </div>
        </>
    );
}


export default function Sidebar() {
    const router = useRouter();
    const auth = useAuth();
    const pathName = usePathname();
    // PASSO 1: Estado para controlar o menu mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        auth.logout();
        setIsMobileMenuOpen(false); // Fecha o menu ao deslogar
        router.push("/login");
    };

    // Funções para abrir/fechar o menu
    const openMobileMenu = () => setIsMobileMenuOpen(true);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    if (!auth.user) {
        // Idealmente, o layout principal cuidaria disso, mas mantendo a lógica original
        return null; 
    }

    const user = auth.user;

    return (
        <>
            {/* --- Sidebar Desktop --- */}
            <div className="fixed top-0 left-0 z-30 flex flex-col h-screen w-[270px] max-md:hidden items-center justify-between py-10 bg-white dark:bg-noturno_medio shadow-sm border-r border-cinza dark:border-noturno_borda">
                <SidebarContent 
                    user={user} 
                    pathName={pathName} 
                    handleLogout={handleLogout} 
                    // Não precisa fechar no desktop
                />
            </div>

            {/* --- Header Mobile --- */}
            <div className="md:hidden h-[76px] fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white dark:bg-noturno_medio border-b border-cinza dark:border-noturno_borda">
                 {/* Logo Menor no Mobile */}
                <button 
                    onClick={openMobileMenu} 
                    className="text-azul"
                    aria-label="Abrir menu"
                >
                    <Menu size={28} />
                </button>
                <div className="flex items-center gap-4">

                 <Link href={user.role === "medico" ? "/Home" : "/Criar_usuario"}>
                    <Image
                        src={LogoVisalytica}
                        alt="Logo Visalytica"
                        className="h-8 w-auto" // Ajustar tamanho
                        priority
                        />
                 </Link>
                 <div className="border-l border-cinza w-1 h-8"></div>
                                 <a href="https://www.dasa.com.br" target="_blank" rel="noreferrer">
                    <Image src={LogoDasa} alt="Logo da Dasa" className="h-5 w-fit" />
                </a>
                        </div>
            </div>

            {/* --- Mobile Drawer Menu --- */}
            {/* Overlay */}
            <div 
                className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeMobileMenu}
                aria-hidden={!isMobileMenuOpen}
            />
            {/* Drawer */}
            <div 
                className={`md:hidden  fixed top-0 left-0 z-40 flex flex-col h-full w-80 bg-white dark:bg-noturno_medio border-r border-cinza dark:border-noturno_borda transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
             >
                {/* Drawer Header com Botão Fechar */}
                <div className="flex justify-between items-center p-4 pt-6">
                                      <Image
                        src={LogoVisalytica}
                        alt="Logo Visalytica"
                        className="h-6 w-auto"
                        priority
                    />
                    <button 
                        onClick={closeMobileMenu} 
                        className="text-azul"
                        aria-label="Fechar menu"
                     >
                        <X size={24} />
                    </button>
                </div>

                {/* Conteúdo do Sidebar dentro do Drawer */}
                <div className="flex flex-col flex-grow items-center justify-between py-6 gap-8 overflow-y-auto"> {/* Adicionado padding e overflow */}
                     <SidebarContent 
                         user={user} 
                         pathName={pathName} 
                         handleLogout={handleLogout} 
                         closeMobileMenu={closeMobileMenu}
                         isMobile={true}
                     />
                 </div>
            </div>
        </>
    );
}