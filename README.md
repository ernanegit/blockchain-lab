# ⛓ Blockchain Lab — Contratos Digitais

Sistema completo de assinatura de contratos digitais em blockchain, rodando localmente com Docker, Hardhat e MetaMask.

## 🏗 Arquitetura

```
blockchain-lab/
├── docker-compose.yml
└── hardhat/
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    ├── hardhat.config.js
    ├── contracts/
    │   └── ContratoDigital.sol
    ├── scripts/
    │   ├── deploy.js
    │   └── assinar.js
    └── frontend/
        └── index.html
```

## 🛠 Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| **Solidity 0.8.20** | Smart contract de assinatura digital |
| **Hardhat** | Ambiente de desenvolvimento Ethereum |
| **ethers.js v6** | Comunicação com a blockchain no frontend |
| **MetaMask** | Carteira digital para assinar transações |
| **Docker + Compose** | Orquestração dos containers |
| **Nginx** | Servidor do frontend |

## 📋 Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [MetaMask](https://metamask.io/download/) (extensão do Chrome)
- Node.js (apenas para rodar fora do Docker)

## 🚀 Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/blockchain-lab.git
cd blockchain-lab
```

### 2. Suba os containers

```bash
docker compose up -d --build
```

### 3. Instale as dependências

```bash
docker exec -it hardhat npm install
```

### 4. Inicie a blockchain local

```bash
# Terminal 1 — mantém o nó rodando
docker exec -it hardhat npm run node
```

### 5. Compile e faça o deploy do contrato

```bash
# Terminal 2
docker exec -it hardhat npx hardhat compile --force
docker exec -it hardhat npm run deploy
```

Copie o endereço retornado, ex:
```
✅ Contrato publicado em: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 6. Configure o MetaMask

Adicione a rede Hardhat Local:

| Campo | Valor |
|-------|-------|
| Nome | Hardhat Local |
| RPC URL | `http://localhost:8545` |
| Chain ID | `1337` |
| Símbolo | ETH |

Importe as contas de teste (Parte 1 e Parte 2):

```
Conta 0: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Conta 1: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

> ⚠️ Essas chaves são públicas e de uso exclusivo para testes locais. **Nunca use na Mainnet.**

### 7. Acesse o frontend

```
http://localhost:3000
```

## 💡 Fluxo de uso

```
1. Conectar MetaMask (Conta 0 — Parte 1)
2. Colar o endereço do contrato → Carregar
3. Criar novo contrato informando endereço da Parte 2 e descrição
4. Assinar como Parte 1
5. Trocar para Conta 1 no MetaMask (Parte 2)
6. Na aba "Meus Contratos" → Assinar
7. Consultar status → "Assinado por Ambos ✅"
```

## 📄 Smart Contract

O contrato `ContratoDigital.sol` implementa:

- `criarContrato(address parte2, string descricao)` — cria um novo contrato entre duas partes
- `assinarContrato(uint256 id)` — assina o contrato (apenas as partes envolvidas)
- `cancelarContrato(uint256 id)` — cancela o contrato antes de ser finalizado
- `verContrato(uint256 id)` — consulta os detalhes e status do contrato

### Estados possíveis

| Status | Descrição |
|--------|-----------|
| `Pendente` | Contrato criado, nenhuma assinatura |
| `AssinadoParte1` | Apenas a Parte 1 assinou |
| `AssinadoPorAmbos` | Contrato finalizado ✅ |
| `Cancelado` | Contrato cancelado ❌ |

## ⛽ Gas consumido (Hardhat Local)

| Operação | Gas | ETH aprox. |
|----------|-----|------------|
| `criarContrato()` | ~142.000 | ~0.000200 ETH |
| `assinarContrato()` | ~32.000–55.000 | ~0.000050 ETH |
| `cancelarContrato()` | ~30.000 | ~0.000045 ETH |

> Valores variam conforme o estado anterior do contrato e o gas price da rede.

## 🌐 Serviços Docker

| Container | Porta | Descrição |
|-----------|-------|-----------|
| `hardhat` | 8545 | Nó Ethereum local (JSON-RPC) |
| `frontend` | 3000 | Interface web (Nginx) |

## 📜 Licença

MIT