"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import toast from "react-hot-toast";
import Button from "../../../components/Button";
import CardInputs from "../../../components/CardInputs";
import Input from "../../../components/Input";
import RelatorioMedicoPDF from "../../../components/pdf/RelatorioMedicoPDF";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

function GeraPDF() {
  const auth = useAuth();

  // console.log(auth);

  const searchParams = useSearchParams();
  const [dadosAnalise, setDadosAnalise] = useState({
    nome_amostra: "",
    comprimento: "",
    largura: "",
    altura: "",
    possivel_diagnostico: "",
    observacao: "",
    imagensBase64: [],
    paciente: {
      nome: "",
      cpf: "",
      dataNascimento: "",
    },
    inicio_analise: ""
  });

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const configuracaoRelatorio = {
    clinica: "Visalytica Medical Center",
    endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
    telefone: "(11) 1234-5678",
    email: "contato@visalytica.com.br",
    medico: auth.user.nome,
    crm: auth.user.crm,
    especialidade: auth.user.role,
  };
  const [modo, setModo] = useState("");
  const [disableInputs, setDisableInputs] = useState({
    nome_paciente: true,
    cpf: true,
    data_nascimento: true,
    nome_peca: true,
    dimensoes: true,
    diasnostico: false,
    observacoes: false,
  });

  useEffect(() => {
    setDadosAnalise({
      nome_amostra: searchParams.get("nomePeca") || "",
      comprimento: searchParams.get("comprimento") || "",
      largura: searchParams.get("largura") || "",
      altura: searchParams.get("altura") || "",
      possivel_diagnostico: searchParams.get("diagnostico") || "",
      observacao: searchParams.get("observacoes") || "",
      imagensBase64:
        [
          localStorage.getItem("ImagemCapturada1"),
          localStorage.getItem("ImagemCapturada2"),
        ] || "",
      paciente: {
        nome: searchParams.get("nomePaciente") || "",
        cpf: searchParams.get("cpf") || "",
        dataNascimento: searchParams.get("dataNascimento") || "",
      },
      inicio_analise: searchParams.get("inicio_analise")
    });
    setModo(searchParams.get("modo") || "normal");
  }, [searchParams]);

  useEffect(() => {
    const gerarPDFPreview = async () => {
      if (dadosAnalise.paciente.nome) {
        try {
          setLoading(true);
          const blob = await pdf(
            <RelatorioMedicoPDF
              dados={dadosAnalise}
              configuracao={configuracaoRelatorio}
            />
          ).toBlob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        } catch (error) {
          console.error("Erro ao gerar PDF:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    gerarPDFPreview();
  }, [dadosAnalise]);

  useEffect(() => {
    if (modo === "edit") {
    }
  }, [modo]);

  const handleDiagnosticoChange = (e) => {
    setDadosAnalise((prev) => ({
      ...prev,
      possivel_diagnostico: e.target.value,
    }));
  };

  const handleObservacoesChange = (e) => {
    setDadosAnalise((prev) => ({ ...prev, observacao: e.target.value }));
  };

  const postAnalise = async () => {
    const { data } = await api.post(`/amostras`, dadosAnalise);
    console.log(data);
  };

  const atulizaAnalise = async () => {
    const { data } = await api.patch(`/amostras/${searchParams.get("id")}`, {possivel_diagnostico: dadosAnalise.possivel_diagnostico, observacao: dadosAnalise.observacao});
    console.log(data);
  };

  const handleSalvar = () => {
    var paginaDevolta;
    try {
      if (modo == "edit") {
          atulizaAnalise(dadosAnalise);
          toast.success("Análise atualizada com sucesso!");
          paginaDevolta = '/ConsultarPacientes'
      } else {
          postAnalise(dadosAnalise);
          toast.success("Análise salva com sucesso!");
          paginaDevolta = '/Home'
      }
    } catch (e) {
      console.log(e);
      return;
    }


    setTimeout(() => {
        window.location.href = paginaDevolta;
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full xl:flex-row p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
      <div className="h-full bg-white  dark:bg-noturno_medio p-7 flex flex-col w-full xl:flex-1 rounded-[10px]">
        {/* Preview do PDF */}
        <div className="bg-[#252525] max-md:min-h-96 rounded-[10px] xs:rounded-xl sm:rounded-2xl flex items-center justify-center h-full shadow-lg">
          {loading ? (
            <div className="text-white text-center p-3 xs:p-4">
              <div className="animate-spin w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 border-3 xs:border-4 border-white border-t-transparent rounded-full mx-auto mb-3 xs:mb-4"></div>
              <p className="text-xs xs:text-sm sm:text-base">Gerando PDF...</p>
            </div>
          ) : pdfUrl ? (
            <div className="w-[95%] xs:w-[96%] sm:w-[92%] md:w-[90%] lg:w-[85%] xl:w-[80%] h-full xs:h-[87%] sm:h-[90%] md:h-[92%] lg:h-[93%] flex items-center justify-center overflow-hidden relative">
              <div className="w-full h-full overflow-hidden relative">
                <iframe
                  src={
                    pdfUrl +
                    "#view=FitH&toolbar=0&navpanes=0&scrollbar=0&page=1&zoom=FitH"
                  }
                  className="w-[97%] h-full rounded-md xs:rounded-lg sm:rounded-xl bg-white absolute right-[-10px] xs:right-[-15px] sm:right-[-20px] border-0"
                  title="Preview do PDF"
                />
              </div>
            </div>
          ) : (
            <div className="text-white text-center p-3 xs:p-4">
              <p className="text-sm xs:text-base sm:text-lg md:text-xl">Preview do PDF</p>
              <p className="text-xs xs:text-sm sm:text-base opacity-70 mt-1 xs:mt-2">Visalytica ©</p>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-[10px] flex flex-col w-full xl:w-1/2 xl:max-w-lg h-auto gap-2 justify-between">
        
        <CardInputs className="max-md:space-y-3 h-full w-full flex flex-col justify-between dark:bg-noturno_medio bg-white rounded-[10px] p-7 ">
          <Input
            label={"Nome do Paciente*"}
            value={dadosAnalise.paciente.nome}
            placeHolder={"Nome do paciente..."}
            disabled={disableInputs.nome_paciente}
            classes="text-xs sm:text-sm md:text-base"
          />
          <Input
            label={"CPF*"}
            value={dadosAnalise.paciente.cpf}
            placeHolder={"000.000.000-00"}
            disabled={disableInputs.cpf}
            classes="text-xs sm:text-sm md:text-base"
          />
          <Input
            label={"Data de Nascimento*"}
            value={dadosAnalise.paciente.dataNascimento}
            placeHolder={"dd/mm/aaaa"}
            disabled={disableInputs.data_nascimento}
            classes="text-xs sm:text-sm md:text-base"
          />
          <Input
            label={"Nome da peça*"}
            value={dadosAnalise.nome_amostra}
            placeHolder={"Pulmão"}
            disabled={disableInputs.nome_peca}
            classes="text-xs sm:text-sm md:text-base"
          />
          <Input
            label={"Comprimento x Largura x Altura*"}
            value={
              dadosAnalise.comprimento +
              ` x ` +
              dadosAnalise.largura +
              " x " +
              dadosAnalise.altura
            }
            placeHolder={"3,5 x 2,0 x 1,2 cm"}
            disabled={disableInputs.dimensoes}
            classes="text-xs sm:text-sm md:text-base"
          />
          <Input
            label={"Possível diagnóstico*"}
            value={dadosAnalise.possivel_diagnostico}
            onChange={handleDiagnosticoChange}
            placeHolder={"Digite o possível diagnóstico..."}
            disabled={disableInputs.diasnostico}
            classes="text-xs sm:text-sm md:text-base"
          />

          <div className="flex flex-col gap-2 md:gap-3">
            <label className="text-xs sm:text-sm md:text-base text-cinza_texto font-medium dark:text-white w-full">
              Observações*
            </label>
            <textarea
              value={dadosAnalise.observacao}
              onChange={handleObservacoesChange}
              placeholder="Carcinoma de pulmão"
              disabled={disableInputs.observacoes}
              className="w-full p-2 sm:p-3 bg-cinza_medio border dark:bg-noturno_medio_claro dark:border-none border-cinza rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[50px] sm:min-h-[55px] md:min-h-[60px] lg:min-h-[65px] placeholder-cinza_escuro text-xs sm:text-sm md:text-base"
            />
          </div>
          {/* Container dos botões responsivo */}
        <div className=" space-y-3 md:space-y-4">
          {/* Linha superior: Cancelar e Salvar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Link href="/Analise">
                <Button
                  classes={
                    "w-full h-10 sm:h-12 md:h-14 lg:h-16 bg-gray-400 flex items-center justify-center rounded-xl transition-all duration-200"
                  }
                >
                  <span className="text-white font-medium text-xs sm:text-sm md:text-base lg:text-lg">
                    Cancelar
                  </span>
                </Button>
              </Link>
            </div>

            {/* Botão Salvar - mantém o mesmo JSX */}
            <div className="flex-1">
              <Button
                classes={
                  "w-full h-10 sm:h-12 md:h-14 lg:h-16 bg-gradient-to-r from-azul to-roxo_gradient flex items-center justify-center rounded-xl transition-all duration-200"
                }
                onClick={handleSalvar}
              >
                <span className="text-white font-medium text-xs sm:text-sm md:text-base lg:text-lg">
                  {modo == "edit" ? "Atualizar" : "Salvar"}
                </span>
              </Button>
            </div>
          </div>
        </div>
        </CardInputs>
          

        
      </div>
    </div>
  );
}

export default GeraPDF;
