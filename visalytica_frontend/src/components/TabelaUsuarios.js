"use client";

import toast from "react-hot-toast";
import Button from "./Button";
import { api } from "@/services/api";
import { Trash } from "lucide-react";
import ConfirmationPopup from "./ConfirmationPopup";

import BotoesPaginacao from "./BotoesPaginacao";

const transformaDatas = (data) => {
  const dataISO = data;

  const data2 = new Date(dataISO);

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
  if (!cpf) return "-";

  const regexLetras = /[a-zA-Z]/;

  if (regexLetras.test(cpf)) {
    return cpf;
  }

  const cpfLimpo = cpf.replace(/\D/g, "");

  const cpfFinal = cpfLimpo.slice(0, 11);

  return cpfFinal.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

function TabelaUsuarios({
  colunas = [],
  linhas = [],
  onUpdate,
  meta,
  page,
  setPage,
  isLoading
}) {
  const handleAceita = async (id) => {
    try {
      const { data } = await api.delete(`/admin/medicos/${id}`);
      console.log(data);
      console.log(id);
      onUpdate();
      toast.success("Requisição aprovada");
    } catch (e) {
      console.log(e);
    }
  };
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

  return (
    <div className="bg-white dark:bg-noturno_medio p-10 pb-5 rounded-[10px] h-full flex flex-col justify-between">
       {isLoading ? (
        <LoadingIndicator />
      ) : linhas.length > 0 ? (
        <div className="flex flex-col">
          {/* Desktop Table */}
          <div className="max-lg:hidden">
            <div className="flex justify-around items-center text-center dark:text-white dark:bg-noturno_medio_claro bg-cinza_medio rounded-t-[10px] text-cinza_texto font-medium p-5">
              {colunas.map((coluna) => (
                <h3 key={coluna} className="w-full">
                  {coluna}
                </h3>
              ))}
            </div>
            <div className="flex flex-col justify-between px-5 py-2 text-cinza_texto ">
              {linhas.map((linha, index) => (
                <div
                  key={index}
                  className="flex hover:bg-cinza_medio dark:hover:bg-noturno_medio_claro justify-around text-center items-center dark:text-white py-2 border-b border-cinza_medio dark:border-noturno_medio_claro"
                >
                  <h3 className="w-full">{linha.nome}</h3>
                  <h3 className="w-full">
                    {transformaDatas(linha.dataNascimento)}
                  </h3>
                  <h3 className="w-full">{formatarCPF(linha.cpf)}</h3>
                  <h3 className="w-full">{linha.crm}</h3>
                  <h3 className="w-full">{linha.username}</h3>
                  <div className="w-full flex justify-center gap-3">
                    <ConfirmationPopup
                      title="Excluir Usuário"
                      message={`Tem certeza que deseja excluir o usuário ${linha.nome}?`}
                      confirmText="Excluir"
                      confirmButtonClass="bg-[#FA3E3E] hover:bg-red-700 text-white"
                      onConfirm={() => handleAceita(linha.id)}
                    >
                      <Button classes="h-9 w-9 bg-[#FA3E3E]">
                        <Trash color="white" />
                      </Button>
                    </ConfirmationPopup>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:hidden gap-3 flex flex-col w-full">
            {linhas.map((linha, index) => (
              <div
                key={index}
                className="border w-full p-4 bg-white dark:bg-noturno_medio_claro rounded-[10px] space-y-3"
              >
                <div className="flex justify-between items-start gap-1">
                  <div className="font-bold text-lg text-azul">
                    {linha.nome}
                  </div>
                  <div className="flex-shrink-0">
                    <ConfirmationPopup
                      title="Excluir Usuário"
                      message={`Tem certeza que deseja excluir o usuário ${linha.nome}?`}
                      confirmText="Excluir"
                      confirmButtonClass="bg-[#FA3E3E] hover:bg-red-700 text-white"
                      onConfirm={() => handleAceita(linha.id)}
                    >
                      <Button classes="h-9 w-9 bg-[#FA3E3E]">
                        <Trash color="white" />
                      </Button>
                    </ConfirmationPopup>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-cinza_escuro">Data de nascimento: </span>
                    <span>{transformaDatas(linha.dataNascimento)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-cinza_escuro">CPF: </span>
                    <span>{formatarCPF(linha.cpf)}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-cinza_escuro">CRM: </span>
                    <span>{linha.crm}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600 dark:text-cinza_escuro">Username: </span>
                    <span>{linha.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
              <div className="flex-1 flex flex-col gap-2 justify-center items-center">
                <h2 className="text-azul text-2xl">Dados não encontrados</h2>
              </div>
            )}
      
            {!isLoading && meta && meta.totalPages > 1 && (
              <div className="self-end flex justify-end">
                <BotoesPaginacao meta={meta} page={page} setPage={setPage} />
              </div>
            )}
          </div>
  );
}

export default TabelaUsuarios;
