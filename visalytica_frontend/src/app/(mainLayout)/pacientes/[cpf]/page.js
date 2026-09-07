"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../../services/api";
import PrivateRoute from "../../../../components/PrivateRoute";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import CardExame from "../../../../components/CardExame";
import { Frown } from "lucide-react";
import BotoesPaginacao from "@/components/BotoesPaginacao";
import Popup from "@/components/Popup";
import { UserRoundX} from "lucide-react";

const fetchPacienteDetails = async ({ queryKey }) => {
  const [_key, cpf] = queryKey;
  if (!cpf) return null;
  const { data } = await api.get(`/pacientes/${cpf}`);
  return data;
};

export default function PerfilPaciente() {
  const params = useParams();
  const pacienteCpf = params.cpf;
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [exames, setExames] = useState(undefined);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState();
  const [medico, setMedico] = useState("");
  const [isLoadingExames, setIsLoadingExames] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pacienteDetails", pacienteCpf],
    queryFn: fetchPacienteDetails,
    enabled: !!pacienteCpf,
  });

  const paciente = data?.paciente;

  const fetchPacienteExames = async (termoPesquisa, page) => {
    setIsLoadingExames(true);
    try {
      const { data } = await api.get(
        `/pacientes/${pacienteCpf}?page=${page}&limit=2&search=${termoPesquisa}`
      );
      console.log(data);
      setMeta(data?.exames?.meta);
      setExames(data?.exames?.lista || []);
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
    } finally {
      setIsLoadingExames(false);
    }
  };

  const fetchMedico = async () => {
    const { data } = await api.get(`/auth/perfil`);
    setMedico(data);
  };

  useEffect(() => {
    fetchMedico();
  }, [medico]);

  useEffect(() => {
    fetchPacienteExames(termoPesquisa, page);
  }, [termoPesquisa, page]);

  const formatarCPF = (cpf) => {
    if (!cpf) return "";
    const cpfLimpo = cpf.replace(/\D/g, "");
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarDataNascimento = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const handlePesquisaChange = (e) => {
    setTermoPesquisa(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="md:ml-[270px] fixed inset-0 flex justify-center items-center">
        <div className="text-center">
          <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 border-4 border-azul border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm xs:text-base">Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="h-[80vh] mx-4 xs:mx-6 sm:mx-8 md:mx-12 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Frown className="size-8 xs:size-10 text-gray-600 mb-3 xs:mb-4  dark:text-white" />
          <h2 className="text-xl xs:text-2xl font-bold text-gray-600 mb-3 xs:mb-4 dark:text-white">
            Paciente não encontrado
          </h2>
          <Link
            href="/ConsultarPacientes"
            className="text-azul hover:underline text-sm xs:text-base"
          >
            Voltar para lista de pacientes
          </Link>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8 xs:p-10 sm:p-12 text-red-500">
        <p className="text-sm xs:text-base">
          Erro ao buscar dados: {error.message}
        </p>
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div className="h-full py-6 mx-3 xs:mx-4 sm:mx-6 md:mx-8 lg:mx-12 gap-4 xs:gap-5 sm:gap-6">
        <div className="bg-white dark:bg-noturno_medio p-6 mb-6 xs:mb-7 sm:mb-8 rounded-[10px]">
          <div className="w-full flex justify-start mb-4 xs:mb-5 sm:mb-6">
            <Link
              className="flex text-azul items-center gap-1.5 xs:gap-2"
              href={"/ConsultarPacientes"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                className="xs:w-[20px] xs:h-[20px]"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 20C4.47581 20 0 15.5242 0 10C0 4.47581 4.47581 0 10 0C15.5242 0 20 4.47581 20 10C20 15.5242 15.5242 20 10 20ZM14.6774 8.22581H10V5.36694C10 4.93548 9.47581 4.71774 9.17339 5.02419L4.56452 9.65726C4.375 9.84677 4.375 10.1492 4.56452 10.3387L9.17339 14.9718C9.47984 15.2782 10 15.0605 10 14.629V11.7742H14.6774C14.9435 11.7742 15.1613 11.5565 15.1613 11.2903V8.70968C15.1613 8.44355 14.9435 8.22581 14.6774 8.22581Z"
                  fill="#166DED"
                />
              </svg>
              <h3 className="text-base xs:text-lg">Voltar</h3>
            </Link>
          </div>
          <div className="px-5">
            <h1 className="text-2xl xs:text-3xl font-bold text-black dark:text-white mb-4 xs:mb-5 sm:mb-6">
              DADOS PACIENTE
            </h1>
            <h2 className="text-xl xs:text-2xl font-semibold text-azul mb-3 xs:mb-4 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 11.25C13.1055 11.25 15.625 8.73047 15.625 5.625C15.625 2.51953 13.1055 0 10 0C6.89453 0 4.375 2.51953 4.375 5.625C4.375 8.73047 6.89453 11.25 10 11.25ZM15 12.5H12.8477C11.9805 12.8984 11.0156 13.125 10 13.125C8.98438 13.125 8.02344 12.8984 7.15234 12.5H5C2.23828 12.5 0 14.7383 0 17.5V18.125C0 19.1602 0.839844 20 1.875 20H18.125C19.1602 20 20 19.1602 20 18.125V17.5C20 14.7383 17.7617 12.5 15 12.5Z"
                  fill="#166DED"
                />
              </svg>
              {paciente.nome}
               <Popup
                              classTrigger={
                                "w-[30px] ml-5 h-[30px] bg-vermelho text-white items-center justify-center rounded-[8px] xs:rounded-[10px] hover:bg-red-700 transition-colors flex items-center justify-center"
                              }
                              paciente={paciente}
                              type="delete pacientes"
                              key={paciente.id}
                              id={paciente.id}
                              triggerText={
                                <UserRoundX size={18} className="xs:w-[18px] xs:h-[18px]" />
                              }
                              title={`Você deseja solicitar a exclusão permanentemente de ${paciente.nome}`}
                            />
            </h2>
            <div className="space-y-1.5 xs:space-y-2">
              <div>
                <span className="text-azul font-bold text-sm xs:text-base">
                  ID:{" "}
                </span>
                <span className="text-[#444444] dark:text-cinza text-sm xs:text-base">
                  {paciente.id}
                </span>
              </div>
              <div>
                <span className="text-azul font-bold text-sm xs:text-base">
                  CPF:{" "}
                </span>
                <span className="text-[#444444] dark:text-cinza text-sm xs:text-base">
                  {formatarCPF(paciente.cpf)}
                </span>
              </div>
              <div>
                <span className="text-azul font-bold text-sm xs:text-base">
                  Data de nascimento:{" "}
                </span>
                <span className="text-[#444444] dark:text-cinza text-sm xs:text-base">
                  {formatarDataNascimento(paciente.dataNascimento)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-noturno_medio p-5 rounded-[10px] flex flex-col justify-between items-start mb-4 xs:mb-5 sm:mb-6 gap-3 sm:gap-4">

            <div className="flex gap-3 xs:gap-4 sm:gap-5 max-md:w-full w-1/2 items-center justify-end ml-auto">
              <Input
                type="text"
                placeHolder="Pesquise por nome da amostra, médico ou número do exame."
                value={termoPesquisa}
                onChange={handlePesquisaChange}
                className="h-[50px] xs:h-[55px] sm:h-[60px] w-full"
                classDiv="w-full"
              />
              <Button
                classes={
                  "bg-gradient-to-b from-azul to-roxo_gradient min-w-[50px] xs:min-w-[55px] sm:min-w-[60px] h-[50px] xs:h-[55px] sm:h-[60px] rounded-xl xs:rounded-2xl"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  className="xs:w-[22px] xs:h-[22px] sm:w-[25px] sm:h-[25px]"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <path
                    d="M24.6582 21.6162L19.79 16.748C19.5703 16.5283 19.2725 16.4062 18.96 16.4062H18.1641C19.5117 14.6826 20.3125 12.5146 20.3125 10.1562C20.3125 4.5459 15.7666 0 10.1562 0C4.5459 0 0 4.5459 0 10.1562C0 15.7666 4.5459 20.3125 10.1562 20.3125C12.5146 20.3125 14.6826 19.5117 16.4062 18.1641V18.96C16.4062 19.2725 16.5283 19.5703 16.748 19.79L21.6162 24.6582C22.0752 25.1172 22.8174 25.1172 23.2715 24.6582L24.6533 23.2764C25.1123 22.8174 25.1123 22.0752 24.6582 21.6162ZM10.1562 16.4062C6.7041 16.4062 3.90625 13.6133 3.90625 10.1562C3.90625 6.7041 6.69922 3.90625 10.1562 3.90625C13.6084 3.90625 16.4062 6.69922 16.4062 10.1562C16.4062 13.6084 13.6133 16.4062 10.1562 16.4062Z"
                    fill="white"
                  />
                </svg>
              </Button>
            </div>
            {isLoadingExames ? (
              <div className="w-full flex justify-center items-center min-h-96">
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="bg-gradient-to-r from-azul to-roxo_gradient bg-clip-text text-transparent text-2xl">
                    Carregando exames...
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full grid-cols-1 grid md:grid-cols-2 gap-6 justify-items-center justify-center md:px-6 pt-6">
                  {exames &&
                    exames.map((exame) => (
                      <CardExame
                        key={exame.id}
                        exame={exame}
                        paciente={paciente}
                        medico={medico}
                      />
                    ))}
                </div>
                <div className="ml-auto">
                  {exames?.length != 0 && (
                    <BotoesPaginacao meta={meta} setPage={setPage} page={page} className="pt-0"/>
                  )}
                </div>

                {exames && exames.length === 0 && (
                  <div className="text-center py-8 xs:py-10 sm:py-12 mx-auto">
                    <p className="text-gray-500 text-base xs:text-lg dark:text-white">
                      {termoPesquisa
                        ? "Nenhum exame encontrado com os critérios de busca."
                        : "Este paciente ainda não possui exames cadastrados."}
                    </p>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
