⏳ TimeLockVault – Cofre de Bloqueio de Tokens ERC-20

TimeLockVault é um contrato inteligente para bloquear tokens ERC-20 por um período definido.
Ideal para vestings, crowdfunding e situações onde é necessário garantir que os tokens só possam ser retirados após uma data específica.

🚀 Funcionalidades

📥 Depósito de tokens ERC-20 com prazo de desbloqueio personalizado

🔒 Bloqueio automático até o tempo definido expirar

📤 Saque seguro apenas após o prazo

👑 Função de resgate pelo dono para recuperar tokens enviados por engano (excedentes)

📜 Suporte a múltiplos depósitos por usuário


🧪 Tecnologias Utilizadas

| Tecnologia       | Função                                      |
| ---------------- | ------------------------------------------- |
| **Solidity**     | Desenvolvimento do contrato inteligente     |
| **Hardhat**      | Framework de desenvolvimento e testes       |
| **Ethers.js**    | Interação com o contrato                    |
| **OpenZeppelin** | Biblioteca segura para ERC-20 e Ownable     |
| **TypeScript**   | Scripts e testes tipados                    |
| **Vite + React** | Interface web para interação com o contrato |


📂 Estrutura de Pastas

cryptotimelock-vault/
├── README.md
├── contracts/
│   ├── TimeLockVault.sol       # Contrato principal
│   └── mocks/TestToken.sol     # Token de teste ERC-20
├── scripts/
│   ├── deploy.ts               # Deploy do TimeLockVault
│   ├── deploy_token.ts         # Deploy do token de teste
│   └── verify.ts               # Verificação do contrato
├── test/                       # Testes automatizados
├── apps/web/                   # Interface front-end
└── hardhat.config.ts


⚙️ Como Executar

Clone o repositório
git clone https://github.com/vinicius030303/cryptotimelock-vault
cd cryptotimelock-vault

Instale as dependências
npm install

Inicie a blockchain local (Hardhat)
npx hardhat node


Faça o deploy do contrato
npx hardhat run scripts/deploy_token.ts --network localhost
npx hardhat run scripts/deploy.ts --network localhost

Configure o .env.local no front-end
VITE_CONTRACT_ADDRESS=0xEndereçoDoVault
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CHAIN_ID=31337


Rode o front-end
cd apps/web
npm install
npm run dev


🧪 Testando no Console do Hardhat

Exemplo de depósito e saque:

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


📜 Licença

MIT License © 2025

👨‍💻 Autor

Vinicius S.
📧 vinicius__santos@live.com
📱 (44) 9 9741-7617
🔗 LinkedIn
