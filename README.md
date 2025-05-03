# **SECOMP-SERVER-API**

### **Visão Geral do Projeto**
#### **Objetivo**
Ser uma plataforma backend para automatizar a gestão de eventos da SECOMP garantindo:
- Cadastro e organização de eventos (palestras, minicursos, atividades e etc.)
- Inscrição e controle de participantes 
- Check-in eficiente via QR code
- Gestão de vagas e lista de espera
#### **Tecnologias**
**Backend**: Node.js + TypeScript
**Banco de Dados**: MySQL (gerenciado via Prisma, pasta prima/)
**Autenticação**: QR code integrado à lógica de check-in (não-funcional).

---

### **Configuração Inicial**

#### **Pré-requisitos**
- Node.js (versão 18.x ou superior)
- npm (gerenciador de pacotes integrado ao Node.js)
- MySQL (versão 8.x ou superior)
- Git (para clonar o repositório)

#### **Passo a Passo**

1. **Clonar o repositório**  
   ```bash
   git clone https://github.com/seu-usuario/SECOMP-SERVER-XII-MAIN.git
   cd SECOMP-SERVER-XII-MAIN
   ```

2. **Instalar dependências**  
   ```bash
   npm install
   ```

3. **Configurar Banco de Dados**  
   - Crie um banco de dados MySQL (ex: `secomp_db`).  
   - Copie o arquivo `env.example` para `.env`:  
     ```bash
     cp env.example .env
     ```
   - Edite o `.env` com suas credenciais do MySQL (usuário, senha, e escolha uma porta para projeto, de preferência a porta 3333 pois o swagger já está configurado para usar ela):    
     ```env
     DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/secomp_db"
     ```
     OBS: não adianta mudar só as variáveis, precisa inserir as credenciais e a porta diretamente na URL, pois o prisma não consegue pegar os dados pelas variáveis.

4. **Executar migrações do Prisma**  
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Compilar o projeto (TypeScript → JavaScript)**  
   ```bash
   npm run build
   ```

6. **Iniciar o servidor**  
   - Modo desenvolvimento (com hot-reload via nodemon):  
     ```bash
     npm run dev
     ```
   - Modo produção:  
     ```bash
     npm start
     ```

---



