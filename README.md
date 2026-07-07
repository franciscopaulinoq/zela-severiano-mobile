# Zela Severiano - Aplicativo Mobile

O **Zela Severiano** é um aplicativo mobile focado em zeladoria urbana para o município de Doutor Severiano/RN. Ele permite que os cidadãos registrem e acompanhem ocorrências de problemas na infraestrutura urbana local (como iluminação pública, buracos no asfalto, saneamento e limpeza) enviando descrições, fotos capturadas na hora e coordenadas geográficas exatas via GPS.

---

## 🚀 Funcionalidades Principais

* **Autenticação e Registro:** Criação de conta em duas etapas e login seguro utilizando CPF e senha.
* **Abertura de Ocorrências:** Fluxo simplificado para registrar novos relatos divididos por categorias.
* **Evidência Fotográfica:** Integração nativa com a câmera do dispositivo para anexar fotos aos relatos.
* **Geolocalização Automatizada:** Captura precisa da localização do problema via GPS e renderização do mapa em tempo real.
* **Histórico de Chamados:** Listagem e visualização detalhada de todas as ocorrências abertas pelo cidadão.
* **Suporte a Temas:** Alternância entre Modo Claro (Light) e Modo Escuro (Dark).

---

## 📁 Estrutura do Projeto

O projeto adota a arquitetura de **Atomic Design** para os componentes de interface e utiliza o **Expo Router** para navegação baseada em arquivos.

```text
zela-severiano-mobile/
├── app/                         # Rotas e Telas (Expo Router)
│   ├── (tabs)/                  # Navegação por Abas (Home e Perfil)
│   │   ├── _layout.tsx
│   │   ├── home.tsx             # Feed de relatos do cidadão
│   │   └── profile.tsx          # Configurações e troca de tema
│   ├── register/                # Fluxo de Criação de Conta
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Etapa 1: Dados Pessoais
│   │   ├── address.tsx          # Etapa 2: Endereço do Cidadão
│   │   └── success.tsx          # Etapa 3: Tela de Sucesso
│   ├── report/
│   │   └── [id].tsx             # Detalhes de um relato específico
│   ├── _layout.tsx              # Provedor global de contextos
│   ├── index.tsx                # Redirecionador inicial (Guarda de rotas)
│   ├── category.tsx             # Seleção de categoria do novo relato
│   ├── camera.tsx               # Captura de foto da ocorrência
│   └── submit.tsx               # Revisão do mapa, endereço e envio
├── assets/                      # Recursos visuais do sistema (Logo e Splash)
└── src/                         # Código fonte estruturado
    ├── components/              # Design System (Atomic Design)
    │   ├── atoms/               # Badge, Button, Input, Typography, ZelaLogo
    │   └── molecules/           # InputGroup, ReportCard
    ├── contexts/                # Provedores de Estado (Auth, Register, Theme)
    ├── services/                # Camada de Integração (Configuração Axios)
    ├── styles/                  # Variáveis de Design (Paleta de cores dos temas)
    └── utils/                   # Formatadores (Máscaras de CPF e manipulação de texto)

```

---

## 🛠️ Tecnologias Utilizadas

* **Framework Base:** React Native com Expo (SDK 54)
* **Linguagem:** TypeScript
* **Roteamento:** Expo Router (File-system)
* **Estilização:** StyleSheet nativo integrado com Context API para Temas
* **Integração HTTP:** Axios
* **Recursos Nativos:** `expo-camera`, `expo-location`, `react-native-maps`, `expo-secure-store`, `expo-blur`, `expo-linear-gradient`

---

## ⚙️ Pré-requisitos para Execução

Antes de iniciar, certifique-se de ter instalado em sua máquina:

1. **Node.js** (versão estável LTS recomendada).
2. **Backend do Zela Severiano** ativo e rodando (geralmente na porta `8080`).
3. Aplicativo **Expo Go** instalado no seu smartphone físico (disponível na Google Play Store ou Apple App Store).

---

## 🏃 Passo a Passo para Executar

### 1. Clonar e Acessar o Projeto

No terminal do seu computador, navegue até a pasta correta do aplicativo mobile:

```bash
cd zela-severiano-mobile

```

### 2. Instalar as Dependências

Instale os pacotes necessários utilizando o NPM com a flag para contornar conflitos de dependências paritárias do React 19:

```bash
npm install --legacy-peer-deps

```

### 3. Configurar a Variável de Ambiente

Abra o arquivo `.env` localizado na raiz do projeto e certifique-se de que a URL aponta para o **endereço de IP local (IPv4)** do seu computador (não utilize *localhost*, pois o celular físico não o reconhecerá):

```text
EXPO_PUBLIC_API_URL=http://192.168.X.X:8080/api/v1

```

> **Nota:** Garanta que seu computador e seu smartphone estejam conectados à **mesma rede Wi-Fi**.

### 4. Inicializar o App com Limpeza de Cache

Suba o servidor de desenvolvimento limpando qualquer cache residual do Metro Bundler:

```bash
npx expo start -c

```

### 5. Ler o QR Code

* **No Android:** Abra o aplicativo **Expo Go**, clique em "Scan QR Code" e aponte para o código gerado no terminal do seu computador.
* **No iOS:** Abra a câmera nativa do iPhone, leia o QR Code e aceite abrir no aplicativo Expo Go.