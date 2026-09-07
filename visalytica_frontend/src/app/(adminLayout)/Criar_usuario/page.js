"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputRadio from "@/components/InputRadio";
import { api } from "@/services/api";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Criar_usuario() {
  const [selected, setSelected] = useState([true, false]); // Médico = [true,false], Admin = [false,true]
  const initialInputsState = {
    nome: "",
    username: "",
    cpf: "",
    crm: "",
    senha: "",
    confirmaSenha: "",
  };
  const [inputs, setInputs] = useState(initialInputsState);

  const [inputError, setInputsError] = useState({
    nome: false,
    username: false,
    cpf: false,
    crm: false,
    senha: false,
    confirmaSenha: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [changePasswordInputs, setChangePasswordInputs] = useState({
    username: "",
    newPassword: ""
  });
  const [changePasswordErrors, setChangePasswordErrors] = useState({
    username: false,
    newPassword: false
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleSelected = (id) => {
    id === 0 ? setSelected([true, false]) : setSelected([false, true]);
  };

  const handleInputChange = useCallback(
    (field) => (e) => {
      let value = e.target.value;

      if (field === "cpf") {
        // Remove tudo que não for número
        value = value.replace(/\D/g, "");

        // Limita a 11 números
        if (value.length > 11) value = value.slice(0, 11);

        // Aplica a formatação automaticamente
        if (value.length > 9) {
          value = value.replace(
            /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
            "$1.$2.$3-$4"
          );
        } else if (value.length > 6) {
          value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
        } else if (value.length > 3) {
          value = value.replace(/(\d{3})(\d{0,3})/, "$1.$2");
        }
      }

      setInputs((prev) => ({
        ...prev,
        [field]: value,
      }));

      setInputsError((prev) => ({
        ...prev,
        [field]: false,
      }));
    },
    []
  );

  const handleChangePasswordInputChange = useCallback(
    (field) => (e) => {
      setChangePasswordInputs((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      setChangePasswordErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    },
    []
  );

  const handleRegistrar = async () => {
    // Reset dos erros
    setInputsError({
      nome: false,
      username: false,
      cpf: false,
      crm: false,
      senha: false,
      confirmaSenha: false,
    });

    // ---- Validações ----
    if (!inputs.nome.trim()) {
      toast.error("O usuário precisa ter um nome");
      setInputsError((prev) => ({ ...prev, nome: true }));
      return;
    }

    if (!inputs.username.trim()) {
      toast.error("O usuário precisa de um username");
      setInputsError((prev) => ({ ...prev, username: true }));
      return;
    }

    if (inputs.cpf.length !== 14) {
      toast.error("CPF inválido");
      setInputsError((prev) => ({ ...prev, cpf: true }));
      return;
    }

    if (selected[0] && !inputs.crm.trim()) {
      toast.error("CRM inválido");
      setInputsError((prev) => ({ ...prev, crm: true }));
      return;
    }

    if (inputs.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setInputsError((prev) => ({ ...prev, senha: true }));
      return;
    }

    if (inputs.senha !== inputs.confirmaSenha) {
      toast.error("As senhas não são iguais");
      setInputsError((prev) => ({ ...prev, confirmaSenha: true }));
      return;
    }

    try {
      // Exemplo de envio (descomente se já tiver rota)
      const cpfLimpo = inputs.cpf.replace(/\D/g, "");
      await api.post("/auth/registrar", {
        nome: inputs.nome,
        username: inputs.username,
        senha: inputs.senha,
        cpf: cpfLimpo,
        crm: selected[0] ? inputs.crm : "",
        role: selected[0] ? "medico" : "admin",
      });
      toast.success("Usuário registrado com sucesso!");
      setInputs(initialInputsState);

      console.log("Usuário válido:", inputs);
    } catch (error) {
      console.error("Erro completo do backend:", error.response?.data || error);

      const defaultErrorMessage = "Erro ao registrar usuário. Tente novamente.";

      const messages = error?.response?.data?.message;

      if (Array.isArray(messages) && messages.length > 0) {
        messages.forEach((msg) => {
          if (typeof msg === "string") {
            toast.error(msg);
          }
        });
      } else if (typeof messages === "string" && messages.trim() !== "") {
        toast.error(messages);
      } else {
        toast.error(defaultErrorMessage);
      }
    }
  };

  const handleAlterarSenha = async () => {
    setChangePasswordErrors({
      username: false,
      newPassword: false
    });

    if (!changePasswordInputs.username.trim()) {
      toast.error("Username é obrigatório");
      setChangePasswordErrors((prev) => ({ ...prev, username: true }));
      return;
    }

    if (changePasswordInputs.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      setChangePasswordErrors((prev) => ({ ...prev, newPassword: true }));
      return;
    }

    try {
      await api.patch(`/admin/users/${changePasswordInputs.username}`, {
        newPassword: changePasswordInputs.newPassword
      });
      toast.success("Senha alterada com sucesso!");
      setChangePasswordInputs({ username: "", newPassword: "" });
    } catch (error) {
      console.error("Erro ao alterar senha:", error.response?.data || error);
      
      const messages = error?.response?.data?.message;
      if (Array.isArray(messages) && messages.length > 0) {
        messages.forEach((msg) => {
          if (typeof msg === "string") {
            toast.error(msg);
          }
        });
      } else if (typeof messages === "string" && messages.trim() !== "") {
        toast.error(messages);
      } else {
        toast.error("Erro ao alterar senha. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex max-xl:flex-col mx-12 gap-4 max-md:gap-8 max-md:my-12">
    <div className="h-full max-md:min-h-fit max-md:w-[90vw] bg-white dark:bg-noturno_medio rounded-[10px] px-6 py-10 flex flex-col justify-between">
      <span className="text-center text-azul font-bold text-xl mb-4">Criar usuário</span>
      <div className="w-full flex justify-center gap-5">
        <InputRadio
          selected={selected[0]}
          text={"Médico"}
          handle={() => handleSelected(0)}
        />
        <InputRadio
          selected={selected[1]}
          text={"Admin"}
          handle={() => handleSelected(1)}
        />
      </div>

      <div className="flex max-md:flex-col py-6 gap-6 flex-1">
        <div className="flex flex-1 flex-col gap-2 justify-between">
          <Input
            className="font-medium text-cinza_texto w-full"
            label="Nome"
            value={inputs.nome}
            onChange={handleInputChange("nome")}
            placeHolder="Digite o nome"
            hasError={inputError.nome}
            classDiv="flex-col"
          />
          <Input
            className="font-medium text-cinza_texto w-full"
            label="CPF"
            value={inputs.cpf} // ← campo controlado
            onChange={handleInputChange("cpf")}
            placeHolder="000.000.000-00"
            hasError={inputError.cpf}
            classDiv="flex-col"
          />
          <div className="relative w-full">
            <Input
              className="font-medium text-cinza_texto w-full"
              label="Senha"
              value={inputs.senha}
              type={showPassword ? "text" : "password"}
              onChange={handleInputChange("senha")}
              placeHolder="**********"
              hasError={inputError.senha}
              classDiv="flex-col"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute bottom-3.5 right-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEye size={20} />
              ) : (
                <AiOutlineEyeInvisible size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2  justify-between">
          <Input
            className="font-medium text-cinza_texto w-full"
            label="Username"
            value={inputs.username}
            onChange={handleInputChange("username")}
            placeHolder="Digite o username"
            hasError={inputError.username}
            classDiv="flex-col"
          />
          <Input
            className={`font-medium text-cinza_texto w-full ${
              selected[1] && "opacity-50"
            }`}
            label="CRM"
            value={inputs.crm}
            disabled={selected[1]}
            onChange={handleInputChange("crm")}
            placeHolder="00000SP"
            hasError={inputError.crm}
            classDiv="flex-col"
          />
          <div className="relative w-full">
            <Input
              className="font-medium text-cinza_texto w-full"
              label="Repetir senha"
              value={inputs.confirmaSenha}
              type={showConfirmPassword ? "text" : "password"}
              onChange={handleInputChange("confirmaSenha")}
              placeHolder="**********"
              hasError={inputError.confirmaSenha}
              classDiv="flex-col"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute bottom-3.5 right-3 text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEye size={20} />
              ) : (
                <AiOutlineEyeInvisible size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleRegistrar}
          classes="text-white max-md:w-full px-4 py-3 bg-gradient-to-r from-azul to-roxo_gradient hover:opacity-90 w-1/4 rounded-xl transition-all duration-200"
        >
          Registrar
        </Button>
      </div>
    </div>

    <div className=" h-fit max-md:w-[90vw] gap-6 bg-white dark:bg-noturno_medio rounded-[10px] px-6 py-10 flex flex-col justify-center">
      <span className="text-center text-azul font-bold text-xl">Alterar senha</span>
      <div className="flex max-md:flex-col gap-4">
        <div className="w-full">
        <Input
          className="font-medium text-cinza_texto w-full"
          label="Username"
          value={changePasswordInputs.username}
          onChange={handleChangePasswordInputChange("username")}
          placeHolder="Digite o username"
          hasError={changePasswordErrors.username}
          classDiv="flex-col"
          />
          </div>
        <div className="relative w-full">
          <Input
            className="font-medium text-cinza_texto w-full"
            label="Nova senha"
            value={changePasswordInputs.newPassword}
            type={showNewPassword ? "text" : "password"}
            onChange={handleChangePasswordInputChange("newPassword")}
            placeHolder="**********"
            hasError={changePasswordErrors.newPassword}
            classDiv="flex-col"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute bottom-3.5 right-3 text-gray-500 cursor-pointer"
          >
            {showNewPassword ? (
              <AiOutlineEye size={20} />
            ) : (
              <AiOutlineEyeInvisible size={20} />
            )}
          </button>
        </div>
      </div>
      <Button
        onClick={handleAlterarSenha}
        classes="text-white max-md:w-full self-center px-4 py-3 bg-gradient-to-r from-azul to-roxo_gradient hover:opacity-90 w-1/4 rounded-xl transition-all duration-200"
      >
        Alterar
      </Button>
    </div>
    </div>
  );
}
