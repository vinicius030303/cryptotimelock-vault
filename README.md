#  TimeLockVault – Cofre de Bloqueio de Tokens ERC-20

**TimeLockVault** é um contrato inteligente para bloquear tokens ERC-20 por um período definido.  
Ideal para *vestings*, *crowdfunding* e situações onde é necessário garantir que os tokens só possam ser retirados após uma data específica.

---

##  Funcionalidades

-  **Depósito** de tokens ERC-20 com prazo de desbloqueio personalizado  
-  **Bloqueio automático** até o tempo definido expirar  
-  **Saque seguro** apenas após o prazo  
-  Função de **resgate pelo dono** para recuperar tokens enviados por engano (*excedentes*)  
-  **Suporte a múltiplos depósitos** por usuário  

---

##  Tecnologias Utilizadas

| Tecnologia       | Função                                      |
| ---------------- | ------------------------------------------- |
| **Solidity**     | Desenvolvimento do contrato inteligente     |
| **Hardhat**      | Framework de desenvolvimento e testes       |
| **Ethers.js**    | Interação com o contrato                    |
| **OpenZeppelin** | Biblioteca segura para ERC-20 e Ownable     |
| **TypeScript**   | Scripts e testes tipados                    |
| **Vite + React** | Interface web para interação com o contrato |

---

## 📂 Estrutura de Pastas

```
cryptotimelock-vault/
├── aplicativos/ web/           # Interface front-end
├── contratos/                  # Contratos inteligentes
├── roteiros/                   # Scripts de deploy e utilitários
├── teste/                      # Testes automatizados
├── .editorconfig
├── .env.exemplo
├── .gitignore
├── .nvmrc
├── .prettierrc
├── LICENÇA
├── LEIA-ME.md                   # Documentação principal
├── hardhat.config.ts
├── pacote-lock.json
├── pacote.json
└── tsconfig.json

```

---

## ️ Como Executar

###  Clonar o repositório
```bash
git clone https://github.com/vinicius030303/cryptotimelock-vault
cd cryptotimelock-vault
```

###  Instalar dependências
```bash
npm install
```

###  Iniciar blockchain local (Hardhat)
```bash
npx hardhat node
```

###  Fazer o deploy dos contratos
```bash
npx hardhat run scripts/deploy_token.ts --network localhost
npx hardhat run scripts/deploy.ts --network localhost
```

###  Configurar `.env.local` no front-end
```env
VITE_CONTRACT_ADDRESS=0xEndereçoDoVault
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CHAIN_ID=31337
```

###  Rodar o front-end
```bash
cd apps/web
npm install
npm run dev
```

---

##  Testando no Console do Hardhat

Exemplo de depósito e saque:

```javascript
const [user] = await ethers.getSigners();
const vault = await ethers.getContractAt("TimeLockVault", VAULT, user);
const token = await ethers.getContractAt("TestToken", TOKEN, user);

// Aprovar 50 tokens
await token.approve(VAULT, ethers.parseEther("50"));

// Depositar por 60 segundos
await vault.deposit(TOKEN, ethers.parseEther("50"), 60);

// Avançar tempo e sacar
await ethers.provider.send("evm_increaseTime", [61]);
await ethers.provider.send("evm_mine", []);
await vault.withdraw(0);
```

---

## 📜 Licença
MIT License © 2025

---

## 👨‍💻 Autor
**Vinicius S.**  
📧 [vinicius__santos@live.com](mailto:vinicius__santos@live.com)  
📱 (44) 9 9741-7617  
🔗 [LinkedIn](https://linkedin.com/in/seu-perfil)
