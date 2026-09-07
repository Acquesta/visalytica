"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import TabelaUsuarios from "@/components/TabelaUsuarios";
import { api } from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";

function Excluir_medico() {
  const [solicitacao, setSolicitacao] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSolicitacoes = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        `/admin/medicos?page=${page}&limit=10&search=${termoPesquisa}`
      );
      setSolicitacao(data.items);
      setMeta(data.meta);
      console.log(data);
    } catch (e) {
      console.log(e);
      setSolicitacao([]);
      setMeta(null);
      toast.error("Erro ao buscar solicitações.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, [page, termoPesquisa]);

  const handlePesquisaChange = (e) => {
    setTermoPesquisa(e.target.value);
    setPage(1);
  };

  return (
    <div className="w-full h-full p-9 flex flex-col gap-7">
      <div className="w-full flex max-md:flex-col justify-between gap-8 bg-white dark:bg-noturno_medio px-9 py-5 rounded-[10px]">
        <Link className="flex text-azul items-center gap-2" href={"/Criar_usuario"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 20C4.47581 20 0 15.5242 0 10C0 4.47581 4.47581 0 10 0C15.5242 0 20 4.47581 20 10C20 15.5242 15.5242 20 10 20ZM14.6774 8.22581H10V5.36694C10 4.93548 9.47581 4.71774 9.17339 5.02419L4.56452 9.65726C4.375 9.84677 4.375 10.1492 4.56452 10.3387L9.17339 14.9718C9.47984 15.2782 10 15.0605 10 14.629V11.7742H14.6774C14.9435 11.7742 15.1613 11.5565 15.1613 11.2903V8.70968C15.1613 8.44355 14.9435 8.22581 14.6774 8.22581Z"
              fill="#166DED"
            />
          </svg>
          <h3 className="">Voltar</h3>
        </Link>
        <div className="flex w-full gap-5">
          <Input
            type="text"
            placeHolder="Pesquise por nome, username, crm ou cpf"
            onChange={handlePesquisaChange}
            className="!h-[50px]"
          />
          <Button
            classes={
              "bg-gradient-to-b from-azul to-roxo_gradient w-[50px] h-[50px] min-w-[50px] rounded-2xl"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
      </div>
         <>
      <TabelaUsuarios
        colunas={[
          `Nome`,
          `Data de nascimento`,
          `CPF`,
          `CRM`,
          `Username`,
          `Ação`,
        ]}
        linhas={solicitacao}
        onUpdate={fetchSolicitacoes}
        meta={meta}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
      />
      </>
    </div>
  );
}

export default Excluir_medico;
