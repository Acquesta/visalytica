"use client";

import { Pencil, Trash2, Upload } from "lucide-react";
import Popup from "./Popup.js";

export default function AcoesTabela({ paciente }) {

  return (
    <div className="flex justify-center items-center gap-2">
      {/* Botão de Visualizar/Exames (como link) */}

      <Popup
        triggerText={<Upload size={18} />}
        classTrigger="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        type="download"
        title="Qual análise de"
        userName={paciente.nome_paciente}
        paciente={paciente}
        onConfirm={(opt) => console.log("Baixar:", opt)}
      />

      {/* Botão de Editar */}
      <Popup
        triggerText={<Pencil size={18} />}
        classTrigger="p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors"
        type="edit"
        title="Qual análise de"
        userName={paciente.nome_paciente}
        paciente={paciente}
        onConfirm={(opt) => console.log("Selecionado:", opt)}
      />

      {/* Botão de Deletar */}
      <Popup
        triggerText={<Trash2 size={18} />}
        classTrigger="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        type="delete pacientes"
        title={`Você deseja solicitar a exclusão permanentemente do ${paciente.nome_paciente}`}
        onConfirm={(reason) => console.log("Motivo:", reason)}
        paciente={paciente}
      />
    </div>
  );
}
