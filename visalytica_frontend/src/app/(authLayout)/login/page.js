"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

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
  const router = useRouter();
  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      toast.success("Login realizado com sucesso!");
      await auth.login(data.access_token);

      router.push("/Home");
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
      <div className="flex flex-col w-full -mt-[10px] xs:-mt-[12px] sm:-mt-[15px]">
        {/* Título Login */}
        <div className="flex w-full justify-center mb-[5px] xs:mb-[6px] sm:mb-[8px]">
          <h1 className="text-[18px] xs:text-[20px] sm:text-[24px] font-bold bg-gradient-to-r from-azul to-azul_escuro bg-clip-text text-transparent">Login</h1>
        </div>

        {/* Campo Usuário */}
        <div className="mb-[6px] xs:mb-[7px] sm:mb-[9px]">
          <label className="block text-black font-medium text-[13px] xs:text-[14px] sm:text-base mb-[4px] xs:mb-[5px] sm:mb-[6px]">
            Usuário
          </label>
          <Input
            placeHolder={"Digite seu CRM"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            hasError={mutation.isError}
            hasSuccess={mutation.isSuccess}
            className="w-full"
          />
        </div>

        {/* Campo Senha */}
        <div className="mb-[1px] xs:mb-[1px] sm:mb-[2px]">
          <label className="block text-black font-medium text-[13px] xs:text-[14px] sm:text-base mb-[4px] xs:mb-[5px] sm:mb-[6px]">
            Senha
          </label>
          <Input
            placeHolder={"*********"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hasError={mutation.isError}
            hasSuccess={mutation.isSuccess}
            className="w-full"
          />
        </div>

        {/* Link Esqueceu a senha */}
        <div className="mb-[16px]">
          <a
            href="#"
            className="text-azul font-medium text-[10px] xs:text-[11px] sm:text-xs hover:underline"
          >
            Esqueceu a senha ou não tem login? Contate o admin
          </a>
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
            classes={
              "bg-gradient-to-r from-azul to-azul_escuro w-fit py-2.5 px-16 !mt-2.5 text-white"
            }
            onClick={handleLogin}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Login;
