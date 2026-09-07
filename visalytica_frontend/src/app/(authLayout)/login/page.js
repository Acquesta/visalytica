"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";

import Input from "../../../components/Input";
import Button from "../../../components/Button";

const loginRequest = async (credentials) => {
  const { data } = await api.post("/auth/entrar", credentials);
  return data;
};

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      toast.success("Login realizado com sucesso!");
      const userData = {
        id: data.id,
        nome: data.nome,
        username: data.username,
        role: data.role,
        cpf: data.cpf,
        crm: data.crm
      };
      await auth.login(data.access_token, userData);
      data.role == 'medico' ? router.push("/Home") : router.push("/Criar_usuario")   
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Usuário ou senha inválidos.";
      toast.error(errorMessage);
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    mutation.mutate({ username, senha: password });
  };

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="flex flex-col w-full -mt-[10px] xs:-mt-[12px] sm:-mt-[15px]"
      >
        {/* Título Login */}
        <div className="flex w-full justify-center mb-[5px] xs:mb-[6px] sm:mb-[8px]">
          <h1 className="text-[18px] xs:text-[20px] sm:text-[24px] font-bold bg-gradient-to-r from-azul to-roxo_gradient bg-clip-text text-transparent">
            Login
          </h1>
        </div>

        {/* Campo Usuário */}
        <div className="mb-[6px] xs:mb-[7px] sm:mb-[9px]">
          <label className="block text-black dark:text-cinza font-medium text-[13px] xs:text-[14px] sm:text-base mb-[4px] xs:mb-[5px] sm:mb-[6px]">
            Usuário
          </label>
          <Input
            placeHolder={"Digite seu CRM"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            hasError={mutation.isError}
            hasSuccess={mutation.isSuccess}
            className="w-full"
            classDiv="flex-col"
          />
        </div>

        {/* Campo Senha */}
        <div className="mb-[1px] xs:mb-[1px] sm:mb-[2px]">
          <label className="block text-black dark:text-cinza font-medium text-[13px] xs:text-[14px] sm:text-base mb-[4px] xs:mb-[5px] sm:mb-[6px]">
            Senha
          </label>
        <div className="relative w-full">
            <Input
              placeHolder={"*********"}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasError={mutation.isError}
              hasSuccess={mutation.isSuccess}
              className="w-full"
              classDiv="flex-col"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Link Esqueceu a senha */}
        <div className="mb-[16px]">
          <p className="mt-2 text-azul font-medium text-[10px] xs:text-[11px] sm:text-xs">
            Esqueceu a senha ou não tem login? Contate o admin
          </p>
        </div>

        {/* Mensagem de erro */}
        {mutation.isError && (
          <div className="mb-[6px]">
            <p className="text-vermelho font-medium text-[15px]">
              Usuário não cadastrado!
            </p>
          </div>
        )}

        {/* Botão Entrar */}
        <div className="w-full flex justify-center">
          <Button
            type="submit"
            classes={
              "bg-gradient-to-r from-azul to-roxo_gradient w-fit py-2.5 px-16 !mt-2.5 text-white"
            }
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default Login;