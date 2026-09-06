import Link from "next/link";
import AcoesTabela from "./AcoesTabela";

export default function TabelaPacientes({ pacientes }) {
  const headers = [
    "Nome",
    "CPF",
    "Última atualização",
    "Data criação",
    "Exames",
    "Ações",
  ];

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

    const dataFormatada = new Intl.DateTimeFormat("pt-BR", options).format(
      data2
    );

    return dataFormatada;
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return "";
    const cpfLimpo = cpf.replace(/\D/g, "");
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  return (
    <>
      <div className="bg-white shadow-md md:rounded-xl md:border md:border-cinza overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full text-sm text-center">
            <thead className="text-sm font-semibold border-b">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="bg-cinza_medio px-6 py-4 text-sm border-r"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr
                  key={paciente.cpf}
                  className="border-cinza bg-white border-b hover:bg-cinza_escuro/30"
                >
                  <td className="px-6 py-4 border-r font-medium">
                    {paciente.nome_paciente}
                  </td>
                  <td className="px-6 py-4 border-r">
                    {formatarCPF(paciente.cpf)}
                  </td>
                  <td className="px-6 py-4 border-r">
                    {transformaDatas(paciente.ultima_atualizacao_exame)}
                  </td>
                  <td className="px-6 py-4 border-r">
                    {transformaDatas(paciente.data_criacao_paciente)}
                  </td>
                  <td className="px-6 py-4 border-r">
                    <Link
                      href={`/pacientes/${paciente.cpf}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {paciente.quantidade_exames} exame
                      {paciente.quantidade_exames > 1 ? "s" : ""}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <AcoesTabela paciente={paciente} />
                  </td>
                </tr>
              ))}
              {pacientes.length === 0 && (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-8 text-gray-500"
                  >
                    Nenhum paciente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="md:hidden gap-3 flex flex-col w-full">
        {pacientes.map((paciente) => (
          <div
            key={paciente.cpf}
            className="border w-full p-4 rounded-[10px] space-y-3"
          >
            <div className="flex justify-between items-start gap-1">
              <div className="font-bold text-lg text-azul">
                {paciente.nome_paciente}
              </div>
              <div className="flex-shrink-0">
                <AcoesTabela paciente={paciente} />
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-semibold text-gray-600">CPF: </span>
                <span>{formatarCPF(paciente.cpf)}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Última atualização:{" "}
                </span>
                <span>
                  {transformaDatas(paciente.ultima_atualizacao_exame)}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">
                  Data de criação:{" "}
                </span>
                <span>{transformaDatas(paciente.data_criacao_paciente)}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Exames: </span>
                <Link
                  href={`/pacientes/${paciente.cpf}`}
                  className="font-medium text-blue-600 underline"
                >
                  {paciente.quantidade_exames} exame
                  {paciente.quantidade_exames > 1 ? "s" : ""}
                </Link>
              </div>
            </div>
          </div>
        ))}
        {pacientes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum paciente encontrado.
          </div>
        )}
      </div>
    </>
  );
}
