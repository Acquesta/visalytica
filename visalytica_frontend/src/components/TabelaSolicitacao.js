"use client";

import toast from "react-hot-toast";
import Button from "./Button";
import { api } from "@/services/api";
import Popup from "./Popup";
import ConfirmationPopup from "./ConfirmationPopup";

import BotoesPaginacao from "./BotoesPaginacao";

const transformaDatas = (data) => {
  // A data em formato ISO 8601
  const dataISO = data;

  // Cria um objeto Date
  const data2 = new Date(dataISO);

  // Formata para o padrão brasileiro (pt-BR)
  // O timeZone 'America/Sao_Paulo' ajusta o horário UTC para o fuso local antes de pegar a data
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Sao_Paulo",
  };

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", options).format(data2);

  return dataFormatada;
};
 const formatarCPF = (cpf) => {
    if (!cpf) return "";
    const cpfLimpo = cpf.replace(/\D/g, "");
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };


function TabelaSolicitacao({
  colunas = [],
  linhas = [],
  onUpdate,
  meta,
  page,
  setPage,
  isLoading,
}) {
const LoadingIndicator = () => (
    <div className="flex-1 flex flex-col gap-2 justify-center items-center">
      <h2 className="text-azul text-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="bg-gradient-to-r from-azul to-roxo_gradient bg-clip-text text-transparent">
            Carregando...
          </span>
        </div>
      </h2>
    </div>
  );
  const handlAceita = async (id) => {
    try {
      const { data } = await api.patch(`/admin/requests/${id}/approve`);
      console.log(data);
      toast.success("Requisição aprovada");
      onUpdate();
    } catch (e) {
      console.log(e);
    }
  };

  const handlRecusa = async (id) => {
    try {
      const { data } = await api.patch(`/admin/requests/${id}/reject`);
      console.log(data);
      toast.error("Exclusão negada");
      onUpdate();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="bg-white dark:bg-noturno_medio p-10 pb-5 rounded-[10px] h-full flex flex-col justify-between">
        {isLoading ? (
        <LoadingIndicator />
      ) : linhas.length > 0 ? (
        <div className="flex flex-col">
          {/* Desktop Table */}
          <div className="max-lg:hidden">
            <div className="flex justify-around items-center text-center bg-cinza_medio dark:text-white dark:bg-noturno_medio_claro rounded-t-[10px] text-cinza_texto font-medium p-5">
              {colunas.map((coluna) => (
                <h3 key={coluna} className="w-full">
                  {coluna}
                </h3>
              ))}
            </div>
            <div className="flex flex-col px-5 py-2 text-cinza_texto justify-between">
              {linhas.map((linha, index) => (
                <div
                  key={index}
                  className="flex hover:bg-cinza_medio dark:hover:bg-noturno_medio_claro justify-around text-center items-center dark:text-white py-2 border-b border-cinza_medio dark:border-noturno_medio_claro"
                >
                  <h3 className="w-full truncate">{linha.nomePaciente}</h3>
                  <h3 className="w-full">{formatarCPF(linha.cpf)}</h3>
                  <h3 className="w-full">
                    {transformaDatas(linha.dataSolicitacao)}
                  </h3>
                  <h3 className="w-full truncate">{linha.solicitante.crm} - {linha.solicitante.nome}</h3>
                  <h3 className="w-full truncate text-azul underline font-semibold">
                    <Popup
                      classTrigger="line-clamp-1"
                      title="Justificativa: "
                      userName={linha.justificativa.texto}
                      type="delete"
                      triggerText={linha.justificativa.texto}
                    />
                  </h3>
                  <div className="w-full flex justify-center gap-3">
                    <ConfirmationPopup
                      title="Aprovar Solicitação"
                      message={`Tem certeza que deseja aprovar a solicitação de exclusão?`}
                      confirmText="Aprovar"
                      confirmButtonClass="bg-[#2ACA44] hover:bg-green-700 text-white"
                      onConfirm={() => handlAceita(linha.idSolicitacao)}
                    >
                      <Button classes="h-9 w-9 bg-[#2ACA44] hover:scale-1 hover:opacity-90">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="18"
                          viewBox="0 0 22 18"
                          fill="none"
                        >
                          <path
                            d="M7.47218 17.6465L0.322169 9.80163C-0.10739 9.33032 -0.10739 8.56616 0.322169 8.0948L1.87777 6.38798C2.30733 5.91663 3.00385 5.91663 3.43341 6.38798L8.25 11.6726L18.5666 0.353478C18.9961 -0.117826 19.6927 -0.117826 20.1222 0.353478L21.6778 2.0603C22.1074 2.5316 22.1074 3.29577 21.6778 3.76712L9.02782 17.6465C8.59822 18.1178 7.90174 18.1178 7.47218 17.6465Z"
                            fill="white"
                          />
                        </svg>
                      </Button>
                    </ConfirmationPopup>
                    <ConfirmationPopup
                      title="Recusar Solicitação"
                      message={`Tem certeza que deseja recusar a solicitação de exclusão?`}
                      confirmText="Recusar"
                      confirmButtonClass="bg-[#FA3E3E] hover:bg-red-700 text-white"
                      onConfirm={() => handlRecusa(linha.idSolicitacao)}
                    >
                      <Button classes="h-9 w-9 bg-[#FA3E3E] hover:opacity-90">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M11.8516 8.59375L16.7378 3.70752C17.3374 3.10791 17.3374 2.13574 16.7378 1.53564L15.6519 0.449707C15.0522 -0.149902 14.0801 -0.149902 13.48 0.449707L8.59375 5.33594L3.70752 0.449707C3.10791 -0.149902 2.13574 -0.149902 1.53564 0.449707L0.449707 1.53564C-0.149902 2.13525 -0.149902 3.10742 0.449707 3.70752L5.33594 8.59375L0.449707 13.48C-0.149902 14.0796 -0.149902 15.0518 0.449707 15.6519L1.53564 16.7378C2.13525 17.3374 3.10791 17.3374 3.70752 16.7378L8.59375 11.8516L13.48 16.7378C14.0796 17.3374 15.0522 17.3374 15.6519 16.7378L16.7378 15.6519C17.3374 15.0522 17.3374 14.0801 16.7378 13.48L11.8516 8.59375Z"
                            fill="white"
                          />
                        </svg>
                      </Button>
                    </ConfirmationPopup>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Cards */}
          <div className="lg:hidden gap-3 flex flex-col w-full">
            {linhas.map((linha, index) => (
              <div
                key={index}
                className="border w-full p-4 bg-white dark:bg-noturno_medio_claro rounded-[10px] space-y-3"
              >
                <div className="flex justify-between items-start gap-1">
                  <div className="font-bold text-lg text-azul">
                    {linha.nomePaciente}
                  </div>
                  <div className="flex-shrink-0 flex gap-2">
                    <ConfirmationPopup
                      title="Aprovar Solicitação"
                      message={`Tem certeza que deseja aprovar a solicitação de exclusão?`}
                      confirmText="Aprovar"
                      confirmButtonClass="bg-[#2ACA44] hover:bg-green-700 text-white"
                      onConfirm={() => handlAceita(linha.idSolicitacao)}
                    >
                      <Button classes="h-9 w-9 bg-[#2ACA44] hover:scale-1 hover:opacity-90">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="18"
                          viewBox="0 0 22 18"
                          fill="none"
                        >
                          <path
                            d="M7.47218 17.6465L0.322169 9.80163C-0.10739 9.33032 -0.10739 8.56616 0.322169 8.0948L1.87777 6.38798C2.30733 5.91663 3.00385 5.91663 3.43341 6.38798L8.25 11.6726L18.5666 0.353478C18.9961 -0.117826 19.6927 -0.117826 20.1222 0.353478L21.6778 2.0603C22.1074 2.5316 22.1074 3.29577 21.6778 3.76712L9.02782 17.6465C8.59822 18.1178 7.90174 18.1178 7.47218 17.6465Z"
                            fill="white"
                          />
                        </svg>
                      </Button>
                    </ConfirmationPopup>
                    <ConfirmationPopup
                      title="Recusar Solicitação"
                      message={`Tem certeza que deseja recusar a solicitação de exclusão?`}
                      confirmText="Recusar"
                      confirmButtonClass="bg-[#FA3E3E] hover:bg-red-700 text-white"
                      onConfirm={() => handlRecusa(linha.idSolicitacao)}
                    >
                      <Button classes="h-9 w-9 bg-[#FA3E3E] hover:opacity-90">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M11.8516 8.59375L16.7378 3.70752C17.3374 3.10791 17.3374 2.13574 16.7378 1.53564L15.6519 0.449707C15.0522 -0.149902 14.0801 -0.149902 13.48 0.449707L8.59375 5.33594L3.70752 0.449707C3.10791 -0.149902 2.13574 -0.149902 1.53564 0.449707L0.449707 1.53564C-0.149902 2.13525 -0.149902 3.10742 0.449707 3.70752L5.33594 8.59375L0.449707 13.48C-0.149902 14.0796 -0.149902 15.0518 0.449707 15.6519L1.53564 16.7378C2.13525 17.3374 3.10791 17.3374 3.70752 16.7378L8.59375 11.8516L13.48 16.7378C14.0796 17.3374 15.0522 17.3374 15.6519 16.7378L16.7378 15.6519C17.3374 15.0522 17.3374 14.0801 16.7378 13.48L11.8516 8.59375Z"
                            fill="white"
                          />
                        </svg>
                      </Button>
                    </ConfirmationPopup>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-cinza_escuro">CPF: </span>
                    <span>{formatarCPF(linha.cpf)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-cinza_escuro">Data da solicitação: </span>
                    <span>{transformaDatas(linha.dataSolicitacao)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-cinza_escuro">Solicitante: </span>
                    <span>{linha.solicitante.crm} - {linha.solicitante.nome}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-cinza_escuro">Justificativa: </span>
                    <Popup
                      classTrigger="text-azul underline font-semibold"
                      title="Justificativa: "
                      userName={linha.justificativa.texto}
                      type="delete"
                      triggerText={linha.justificativa.texto}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        ) : (
        // Se não está carregando E NÃO tem linhas, mostra "Dados não encontrados"
        <div className="flex-1 flex flex-col gap-2 justify-center items-center">
          <h2 className="text-azul text-2xl text-center">Dados não encontrados :(</h2>
        </div>
      )}

      {/* Paginação: Mostra apenas se não estiver carregando E houver mais de 1 página */}
      {!isLoading && meta && meta.totalPages > 1 && (
        <div className="self-end flex justify-end">
          <BotoesPaginacao meta={meta} page={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
}

export default TabelaSolicitacao;
