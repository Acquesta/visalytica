"use client";

import { useEffect, useState } from "react";
import MenuDashboardFuncional from "../../../components/MeuDashboardFuncional";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import Link from "next/link";

const getMonthName = (monthNumber) => {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return months[monthNumber - 1];
};

const formatTimeFromMinutes = (decimalMinutes) => {
  if (typeof decimalMinutes !== "number" || decimalMinutes < 0) return "0:00";
  const totalSeconds = Math.round(decimalMinutes * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const data = new Date();

function HomeInicial() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [analiseData, setAnaliseData] = useState([]);
  const [tempoMedioData, setTempoMedioData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && user) {
      const fetchData = async () => {
        try {
          const [analiseResponse, tempoMedioResponse] = await Promise.all([
            api.get("/medicos/stats/monthly-count"),
            api.get("/amostras/media-tempo-mensal"),
          ]);

          setAnaliseData(
            analiseResponse.data.map((item) => ({
              month: getMonthName(item.month),
              value: item.count,
            }))
          );

          setTempoMedioData(
            tempoMedioResponse.data.map((item) => ({
              month: getMonthName(item.mes),
              "Tempo Médio (min)": parseFloat(
                item.mediaTempoMinutos.toFixed(2)
              ),
            }))
          );
        } catch (err) {
          console.error("Erro ao buscar dados:", err);
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthLoading, user]);

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="md:ml-[270px] fixed inset-0 flex justify-center items-center">
        <div className="text-center">
          <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 border-4 border-azul border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm xs:text-base">Carregando dados do médico...</p>
        </div>
      </div>
    );
  }
  console.log("Tempo medio array: ");
  console.log(tempoMedioData);

  return (
    <div className="h-full px-7 w-full flex flex-col justify-between py-6">
      <div className="flex flex-col h-full gap-5 rounded-lg">
        <div className="h-full max-md:flex-col flex gap-16 max-md:gap-6 bg-white dark:bg-noturno_medio rounded-lg px-12 max-md:py-12 py-8">
          <MenuDashboardFuncional
            title={
              <p>
                Análises feitas por{" "}
                <span className="text-azul font-semibold">
                  {user?.nome || "usuário"}
                </span>
              </p>
            }
            data={analiseData}
            dataKey="value"
            tipoGrafico="bar"
          />
          <div className="bg-cinza_escuro dark:bg-gray-700 h-full w-0.5 max-md:h-0.5 max-md:w-full"></div>
          <div className=" flex flex-col justify-center">
            <h2 className="text-center text-cinza_escuro leading-9">
              quantidade realizada em
              <br />
              <span className="text-azul font-semibold text-3xl uppercase">
                {data.toLocaleString("pt-BR", { month: "long" })}:
              </span>
            </h2>
            <p className="bg-gradient-to-t bg-clip-text from-roxo_gradient to-azul text-transparent text-7xl md:text-9xl font-bold text-center">
              {analiseData[analiseData.length - 1].value}
            </p>
            <p className="text-center text-azul text-2xl ">
              análise{analiseData[analiseData.length - 1].value > 1 && "s"}
            </p>
          </div>
        </div>

        <div className="relative h-full max-md:flex-col flex flex-row-reverse gap-16 max-md:gap-6 bg-white dark:bg-noturno_medio rounded-lg max-md:py-12 px-12 py-8">
          <MenuDashboardFuncional
            title="Tempo Médio de Análise por Mês"
            data={tempoMedioData}
            dataKey="Tempo Médio (min)"
            gradient
            tipoGrafico="line"
          />
          <div className="bg-cinza_escuro dark:bg-gray-700 h-full w-0.5 max-md:h-0.5 max-md:w-full"></div>
          <div className=" flex flex-col gap-3 justify-center">
            <h2 className="text-center text-cinza_escuro leading-9">
              seu tempo médio de análise em
              <br />
              <span className="text-azul font-semibold text-3xl uppercase">
                {data.toLocaleString("pt-BR", { month: "long" })}:
              </span>
            </h2>
            <div>
              <p className="bg-gradient-to-t bg-clip-text from-roxo_gradient to-azul text-transparent text-7xl md:text-9xl font-bold text-center">
                {tempoMedioData[tempoMedioData.length - 1]["Tempo Médio (min)"]}
              </p>
              <p className="text-center text-azul text-2xl">
                minuto
                {tempoMedioData[tempoMedioData.length - 1][
                  "Tempo Médio (min)"
                ] > 1 && "s"}
              </p>
            </div>
          </div>
        </div>

        <Link href="/Analise">
          <div
            className="fixed max-md:absolute bottom-5 left-1/2 max-md:transform max-md:-translate-x-1/2 max-md:ml-0 z-50 flex items-center py-3 px-10 ml-8 rounded-[10px] gap-3 hover:opacity-90"
            style={{
              backgroundImage: `linear-gradient(to right, #166DED, #716FEA)`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className=""
            >
              <path
                d="M5 21V19H10V17C8.61667 17 7.4375 16.5125 6.4625 15.5375C5.4875 14.5625 5 13.3833 5 12C5 10.9833 5.27917 10.0583 5.8375 9.225C6.39583 8.39167 7.15 7.78333 8.1 7.4C8.23333 6.83333 8.52917 6.375 8.9875 6.025C9.44583 5.675 9.96667 5.5 10.55 5.5L10 3.95L10.95 3.6L10.6 2.7L12.5 2L12.8 2.95L13.75 2.6L16.5 10.1L15.55 10.45L15.9 11.4L14 12.1L13.7 11.15L12.75 11.5L12.15 9.85C11.9 10.0833 11.6125 10.2583 11.2875 10.375C10.9625 10.4917 10.6333 10.5333 10.3 10.5C9.93333 10.4667 9.59167 10.3542 9.275 10.1625C8.95833 9.97083 8.68333 9.73333 8.45 9.45C8 9.71667 7.64583 10.075 7.3875 10.525C7.12917 10.975 7 11.4667 7 12C7 12.8333 7.29167 13.5417 7.875 14.125C8.45833 14.7083 9.16667 15 10 15H18V17H13V19H19V21H5ZM13.65 9.55L14.55 9.2L12.85 4.5L11.9 4.85L13.65 9.55ZM10.5 9C10.7833 9 11.0208 8.90417 11.2125 8.7125C11.4042 8.52083 11.5 8.28333 11.5 8C11.5 7.71667 11.4042 7.47917 11.2125 7.2875C11.0208 7.09583 10.7833 7 10.5 7C10.2167 7 9.97917 7.09583 9.7875 7.2875C9.59583 7.47917 9.5 7.71667 9.5 8C9.5 8.28333 9.59583 8.52083 9.7875 8.7125C9.97917 8.90417 10.2167 9 10.5 9Z"
                fill={`white`}
              />
            </svg>
            <h2 style={{ color: `white` }} className="whitespace-nowrap">Fazer análise</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default HomeInicial;
