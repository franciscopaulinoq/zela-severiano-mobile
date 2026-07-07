import React, { createContext, useState } from "react";

export const RegisterContext = createContext<any>({});

export const RegisterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    email: "",
    senha: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
  });

  const validateStep1 = () => {
    return (
      formData.nomeCompleto && formData.cpf && formData.email && formData.senha
    );
  };

  const validateStep2 = () => {
    return formData.logradouro && formData.numero && formData.bairro;
  };

  return (
    <RegisterContext.Provider
      value={{ formData, setFormData, validateStep1, validateStep2 }}
    >
      {children}
    </RegisterContext.Provider>
  );
};
