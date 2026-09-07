"use client";

import { Pencil, Trash2, Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import DownloadPDF from "./pdf/DownloadPDF";
import { useRouter } from "next/navigation";
import Popup from "./Popup";
import { api } from "@/services/api";

export default function CardExame({ exame, paciente, medico }) {
  const router = useRouter();

  const handleDownload = async () => {
    console.log(exame);

    try {
      const blob = await pdf(
        <DownloadPDF dados={{ ...exame, paciente }} medico={medico} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analise-${exame.nomeAmostra}-${paciente.nome}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    }
  };

  const handleEdit = async () => {
    router.push(
      `/GeraPDF?${new URLSearchParams({
        cpf: paciente.cpf,
        nomePaciente: paciente.nome,
        dataNascimento: paciente.dataNascimento,
        nomePeca: exame.nomeAmostra,
        comprimento: exame.comprimento,
        largura: exame.largura,
        altura: exame.altura,
        diagnostico: exame.possivelDiagnostico,
        observacoes: exame.observacoes,
        modo: "edit",
        id: exame.id,
      }).toString()}`
    );
  };

  const handleDelete = () => {
    console.log(`Deletar exame ${exame.id} do paciente ${paciente.nome}`);
  };

  const formatarData = (dataString) => {
    if (!dataString) return "N/A";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <div className="bg-white dark:bg-noturno_medio_claro rounded-[10px] shadow-sm hover:shadow-md transition-shadow w-full min-h-[250px] flex flex-col">
      <div className="flex justify-between items-center bg-gradient-to-r from-azul to-roxo_gradient text-white text-center p-4 rounded-t-[10px] ">
        <h3 className="font-semibold text-sm">Nº exame: {exame.numeroExame}</h3>
        {exame.statusExclusao === "pendente" && (
          <h3 className="text-sm bg-vermelho text-white px-3 py-1 rounded-md">
            Solicitado exclusão
          </h3>
        )}
      </div>
      <div className="flex px-5 py-3 h-full">
        <div className="flex-1 flex flex-col justify-between pb-0 gap-2 text-sm w-3/4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 17 20"
                fill="none"
              className="h-5 w-5"
              >
                <path
                  d="M16.5446 6.25H0.455357C0.204911 6.25 0 6.03906 0 5.78125V4.375C0 3.33984 0.815848 2.5 1.82143 2.5H3.64286V0.46875C3.64286 0.210938 3.84777 0 4.09821 0H5.61607C5.86652 0 6.07143 0.210938 6.07143 0.46875V2.5H10.9286V0.46875C10.9286 0.210938 11.1335 0 11.3839 0H12.9018C13.1522 0 13.3571 0.210938 13.3571 0.46875V2.5H15.1786C16.1842 2.5 17 3.33984 17 4.375V5.78125C17 6.03906 16.7951 6.25 16.5446 6.25ZM0.455357 7.5H16.5446C16.7951 7.5 17 7.71094 17 7.96875V18.125C17 19.1602 16.1842 20 15.1786 20H1.82143C0.815848 20 0 19.1602 0 18.125V7.96875C0 7.71094 0.204911 7.5 0.455357 7.5ZM12.4464 12.9688C12.4464 12.7109 12.2415 12.5 11.9911 12.5H9.71429V10.1562C9.71429 9.89844 9.50938 9.6875 9.25893 9.6875H7.74107C7.49062 9.6875 7.28571 9.89844 7.28571 10.1562V12.5H5.00893C4.75848 12.5 4.55357 12.7109 4.55357 12.9688V14.5312C4.55357 14.7891 4.75848 15 5.00893 15H7.28571V17.3438C7.28571 17.6016 7.49062 17.8125 7.74107 17.8125H9.25893C9.50938 17.8125 9.71429 17.6016 9.71429 17.3438V15H11.9911C12.2415 15 12.4464 14.7891 12.4464 14.5312V12.9688Z"
                  fill="#166DED"
                />
              </svg>
              <span className="text-[#444444] dark:text-cinza font-bold">
                Data realização:{" "}
              </span>
              <span className="text-[#444444] dark:text-cinza">
                {formatarData(exame.dataCriacao)}
              </span>
            </div>
            <div className="flex max-md:hidden justify-center gap-2 ">
              <button
                onClick={handleDownload}
                className="w-[30px] h-[30px] bg-azul text-white rounded-[8px] xs:rounded-[10px] hover:bg-blue-700 transition-colors flex items-center justify-center"
                aria-label="Upload do Exame"
                title="Upload"
              >
                <Download size={16} className="xs:w-[18px] xs:h-[18px]" />
              </button>

              <button
                onClick={handleEdit}
                disabled={!exame.canEdit}
                className="disabled:bg-gray-400 disabled:cursor-not-allowed w-[30px] h-[30px] bg-[#F4DB1D] text-white rounded-[8px] xs:rounded-[10px] hover:bg-yellow-400 transition-colors flex items-center justify-center"
                aria-label="Editar Exame"
                title="Editar"
              >
                <Pencil size={16} className="xs:w-[18px] xs:h-[18px]" />
              </button>

              <Popup
                classTrigger={
                  "w-[30px] h-[30px] bg-vermelho text-white justify-center rounded-[8px] xs:rounded-[10px] hover:bg-red-700 transition-colors flex items-center justify-center"
                }
                paciente={paciente}
                type="delete amostras"
                key={exame.id}
                id={exame.id}
                triggerText={
                  <Trash2 size={16} className="xs:w-[18px] xs:h-[18px]" />
                }
                title={`Você deseja solicitar a exclusão permanentemente de ${exame.nomeAmostra}`}
              />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="19"
              viewBox="0 0 17 19"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M16.5446 5.9375H0.455357C0.203886 5.9375 0 5.73811 0 5.49219V4.15625C0 3.17248 0.815469 2.375 1.82143 2.375H3.64286V0.445312C3.64286 0.199389 3.84674 0 4.09821 0H5.61607C5.86754 0 6.07143 0.199389 6.07143 0.445312V2.375H10.9286V0.445312C10.9286 0.199389 11.1325 0 11.3839 0H12.9018C13.1533 0 13.3571 0.199389 13.3571 0.445312V2.375H15.1786C16.1845 2.375 17 3.17248 17 4.15625V5.49219C17 5.73811 16.7961 5.9375 16.5446 5.9375ZM0.455357 7.125H16.5446C16.7961 7.125 17 7.32439 17 7.57031V17.2188C17 18.2025 16.1845 19 15.1786 19H1.82143C0.815469 19 0 18.2025 0 17.2188V7.57031C0 7.32439 0.203886 7.125 0.455357 7.125ZM13.1027 10.6855L12.0338 9.6317C11.8567 9.4571 11.5684 9.45595 11.3899 9.62918L7.36616 13.5325L5.62138 11.8124C5.44429 11.6378 5.15593 11.6366 4.9774 11.8099L3.89983 12.8552C3.72129 13.0284 3.72012 13.3104 3.89725 13.485L7.03166 16.5751C7.20876 16.7497 7.49708 16.7508 7.67561 16.5776L13.1002 11.3153C13.2787 11.1421 13.2799 10.8601 13.1027 10.6855Z"
                fill="#166DED"
              />
            </svg>
            <span className="text-[#444444] dark:text-cinza font-bold">
              Data atualização:{" "}
            </span>
            <span className="text-[#444444] dark:text-cinza">
              {formatarData(exame.dataAtualizacao)}
            </span>
          </div>

          <div className="flex gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="20"
              viewBox="0 0 17 20"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M8.5 10C11.1828 10 13.3571 7.76172 13.3571 5C13.3571 2.23828 11.1828 0 8.5 0C5.81719 0 3.64286 2.23828 3.64286 5C3.64286 7.76172 5.81719 10 8.5 10ZM3.94643 16.5625C3.94643 17.082 4.35246 17.5 4.85714 17.5C5.36183 17.5 5.76786 17.082 5.76786 16.5625C5.76786 16.043 5.36183 15.625 4.85714 15.625C4.35246 15.625 3.94643 16.043 3.94643 16.5625ZM12.1429 11.2734V13.1875C13.5279 13.4766 14.5714 14.7422 14.5714 16.25V17.8789C14.5714 18.1758 14.3665 18.4336 14.0819 18.4922L12.86 18.7422C12.6969 18.7773 12.5375 18.668 12.5033 18.4961L12.3857 17.8828C12.3516 17.7148 12.4578 17.5469 12.6248 17.5156L13.3571 17.3633V16.25C13.3571 13.7969 9.71429 13.707 9.71429 16.3242V17.3672L10.4467 17.5195C10.6098 17.5547 10.7161 17.7188 10.6857 17.8867L10.5681 18.5C10.5339 18.668 10.3746 18.7773 10.2114 18.7461L9.02746 18.582C8.72768 18.5391 8.50379 18.2773 8.50379 17.9609V16.25C8.50379 14.7422 9.54732 13.4805 10.9324 13.1875V11.4219C10.8489 11.4492 10.7654 11.4648 10.6819 11.4961C9.99888 11.7422 9.26652 11.8789 8.50379 11.8789C7.74107 11.8789 7.00871 11.7422 6.32567 11.4961C6.04487 11.3945 5.76027 11.332 5.46808 11.293V14.4805C6.34464 14.75 6.98594 15.5781 6.98594 16.5664C6.98594 17.7734 6.03348 18.7539 4.86094 18.7539C3.68839 18.7539 2.73594 17.7734 2.73594 16.5664C2.73594 15.5781 3.37723 14.75 4.25379 14.4805V11.3398C1.8404 11.7578 0 13.8984 0 16.5V18.25C0 19.2148 0.762723 20 1.7 20H15.3C16.2373 20 17 19.2148 17 18.25V16.5C17 13.6875 14.8446 11.4102 12.1429 11.2734Z"
                fill="#166DED"
              />
            </svg>
            <span className="text-[#444444] dark:text-cinza font-bold">
              Dr(a):{" "}
            </span>
            <span className="text-[#444444] dark:text-cinza">
              {exame.medico.nome}
            </span>
          </div>

          <div className="flex gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="16"
              viewBox="0 0 19 16"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M17.1558 1.09402C15.1222 -0.573804 12.0979 -0.273809 10.2313 1.57973L9.50027 2.30472L8.76923 1.57973C6.90638 -0.273809 3.87831 -0.573804 1.84476 1.09402C-0.485668 3.00827 -0.608127 6.44393 1.47738 8.51889L8.65791 15.6545C9.12177 16.1152 9.87507 16.1152 10.3389 15.6545L17.5195 8.51889C19.6087 6.44393 19.4862 3.00827 17.1558 1.09402Z"
                fill="#166DED"
              />
            </svg>
            <span className="text-[#444444] dark:text-cinza font-bold">
              Peça:{" "}
            </span>
            <span className="text-[#444444] dark:text-cinza">
              {exame.nomeAmostra}
            </span>
          </div>

          {exame.possivelDiagnostico && (
            <div className="flex gap-3 items-start ">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="w-5 h-5"
                >
                  <path
                    d="M6.81778 13.2544C6.7256 13.0694 6.56497 13.0506 6.49997 13.0506C6.43497 13.0506 6.27435 13.0691 6.18685 13.2441L5.94716 13.7234C5.7481 14.1228 5.16498 14.0787 5.02592 13.6581L4.49998 12.0809L4.16842 13.0772C3.98436 13.6291 3.46905 14 2.88717 14H2.49999C2.22374 14 1.99999 13.7762 1.99999 13.5C1.99999 13.2238 2.22374 13 2.49999 13H2.88717C3.03811 13 3.17186 12.9037 3.21967 12.7606L3.78811 11.0531C3.89123 10.7466 4.17686 10.5403 4.49998 10.5403C4.8231 10.5403 5.10873 10.7463 5.21154 11.0531L5.64529 12.3544C6.26247 11.8484 7.33466 12.0513 7.70778 12.7969C7.76684 12.915 7.87934 12.9828 8.00028 12.9925V10.4263L12.0003 6.45469V5H7.74997C7.33747 5 6.99997 4.6625 6.99997 4.25V0H0.749997C0.334374 0 0 0.334375 0 0.75V15.25C0 15.6656 0.334374 16 0.749997 16H11.25C11.6656 16 11.9999 15.6656 11.9999 15.25V14L7.99997 13.9966C7.49622 13.9869 7.04434 13.7066 6.81778 13.2544ZM11.9999 3.80938C11.9999 3.6125 11.9218 3.42188 11.7812 3.28125L8.72184 0.21875C8.58121 0.078125 8.39059 0 8.19059 0H7.99997V4H11.9999V3.80938ZM8.99996 10.8425V13H11.1559L16.2084 7.91313L14.0871 5.79187L8.99996 10.8425ZM17.7668 5.22906L16.7709 4.23313C16.4602 3.9225 15.9562 3.9225 15.6456 4.23313L14.794 5.08469L16.9152 7.20594L17.7668 6.35437C18.0777 6.04375 18.0777 5.53969 17.7668 5.22906Z"
                    fill="#166DED"
                  />
                </svg>
              </div>
              <div className="text-[#444444] dark:text-cinza max-w-[350px] line-clamp-2">
                <strong>Possível diagnóstico:</strong>{" "}
                {exame.possivelDiagnostico}
              </div>
            </div>
          )}
                      <div className="flex md:hidden justify-center gap-2 mt-2">
              <button
                onClick={handleDownload}
                className="w-[30px] h-[30px] bg-azul text-white rounded-[8px] xs:rounded-[10px] hover:bg-blue-700 transition-colors flex items-center justify-center"
                aria-label="Upload do Exame"
                title="Upload"
              >
                <Download size={16} className="xs:w-[18px] xs:h-[18px]" />
              </button>

              <button
                onClick={handleEdit}
                disabled={!exame.canEdit}
                className="disabled:bg-gray-400 disabled:cursor-not-allowed w-[30px] h-[30px] bg-[#F4DB1D] text-white rounded-[8px] xs:rounded-[10px] hover:bg-yellow-400 transition-colors flex items-center justify-center"
                aria-label="Editar Exame"
                title="Editar"
              >
                <Pencil size={16} className="xs:w-[18px] xs:h-[18px]" />
              </button>

              <Popup
                classTrigger={
                  "w-[30px] h-[30px] bg-vermelho text-white items-center justify-center rounded-[8px] xs:rounded-[10px] hover:bg-red-700 transition-colors flex items-center justify-center"
                }
                paciente={paciente}
                type="delete amostras"
                key={exame.id}
                id={exame.id}
                triggerText={
                  <Trash2 size={16} className="xs:w-[18px] xs:h-[18px]" />
                }
                title={`Você deseja solicitar a exclusão permanentemente de ${exame.nomeAmostra}`}
              />
            </div>
        </div>
      </div>
    </div>
  );
}
