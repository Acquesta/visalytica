"use client";

import { Pencil, UserRoundX , Download } from "lucide-react";
import Popup from "./Popup.js";

export default function AcoesTabela({ paciente }) {

  return (
    <div className="flex justify-center items-center gap-2">
      {/* Botão de Visualizar/Exames (como link) */}

      <Popup
        triggerText={<Download size={18} />}
        classTrigger="p-2 bg-[#166DED] text-white rounded-[10px] hover:bg-blue-600 transition-colors"
        type="download"
        title="Qual análise de"
        userName={paciente.nome_paciente}
        paciente={paciente}
        onConfirm={(opt) => console.log("Baixar:", opt)}
      />

      {/* Botão de Editar */}
      <Popup
        triggerText={<Pencil size={18} />}
        classTrigger="p-2 bg-[#F4DB1D] text-white rounded-[10px] hover:bg-yellow-500 transition-colors"
        type="edit"
        title="Qual análise de"
        userName={paciente.nome_paciente}
        paciente={paciente}
        onConfirm={(opt) => console.log("Selecionado:", opt)}
      />

      {/* Botão de Deletar */}
      <Popup
        triggerText={<UserRoundX size={18} />}
        classTrigger="p-2 bg-[#FA3E3E] text-white rounded-[10px] hover:bg-red-600 transition-colors"
        type="delete pacientes"
        title={`Você deseja solicitar a exclusão permanentemente do ${paciente.nome_paciente}`}
        onConfirm={(reason) => console.log("Motivo:", reason)}
        paciente={paciente}
      />
    </div>
  );
}
