# Mastermind Fullstack 

Projeto **Mastermind**, um sistema Fullstack completo - Front | Back | BD     
Backend e Frontend, desacoplados, se comunicando exclusivamente via API REST.

Jogo de adivinhação, onde o usuário deve descobrir um código secreto gerado pelo servidor em um número limitado de tentativas.


## Versão Hospedada - Vercel & Railway

Você pode acessar a aplicação pelos links abaixo:

FRONT-END: <a href="https://mastermaind-henrymodestos-projects.vercel.app/" target="_blank">Acessar Mastermaind Game</a>

SWAGGER: <a href="https://mastermaindgame-production.up.railway.app/swagger" target="_blank">Acessar docs API</a>

---

## Arquitetura e Decisões Técnicas


**Backend (Python)**: Foi Desenvolvido com Flask, utilizando arquitetura padrão. Os `Controllers` lidam com as rotas e entradas de dados, os `Services` concentram as regras de negócio (lógica do jogo), os `Repositories` fazem a comunicação com o banco usando SQLAlchemy e os `Models` definem a estrutura dos dados. 

**Frontend (Angular)**: Foi construído com Angular (v21). A comunicação com o backend é feita via Services com HttpClient, com interceptação de requisições usando JWT e proteção de rotas com AuthGuards. A interface foi desenvolvida com **Angular Material**.


<strong style="font-size: 20px;">Tecnologias</strong>

**Backend:**

![Python](https://img.shields.io/badge/Python-0D1117?style=for-the-badge&logo=python&logoColor=yellow&labelColor=0D1117) 
![Flask](https://img.shields.io/badge/Flask-0D1117?style=for-the-badge&logo=flask&logoColor=white&labelColor=0D1117)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-0D1117?style=for-the-badge&logo=sqlalchemy&logoColor=red&labelColor=0D1117)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0D1117?style=for-the-badge&logo=postgresql&logoColor=blue&labelColor=0D1117)
![JWT](https://img.shields.io/badge/JWT-0D1117?style=for-the-badge&logo=jsonwebtokens&logoColor=purple&labelColor=0D1117)
![Marshmallow](https://img.shields.io/badge/Marshmallow-0D1117?style=for-the-badge&logo=python&logoColor=orange&labelColor=0D1117)
![Swagger](https://img.shields.io/badge/Swagger-0D1117?style=for-the-badge&logo=swagger&logoColor=green&labelColor=0D1117)
![Docker](https://img.shields.io/badge/Docker-0D1117?style=for-the-badge&logo=docker&logoColor=blue&labelColor=0D1117)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-0D1117?style=for-the-badge&logo=docker&logoColor=blue&labelColor=0D1117)
![Pytest](https://img.shields.io/badge/Pytest-0D1117?style=for-the-badge&logo=pytest&logoColor=white&labelColor=0D1117)

**Frontend:**

![Angular](https://img.shields.io/badge/Angular-0D1117?style=for-the-badge&logo=angular&logoColor=red&labelColor=0D1117)
![Angular Material](https://img.shields.io/badge/Angular_Material-0D1117?style=for-the-badge&logo=angular&logoColor=red&labelColor=0D1117)
![ngx-toastr](https://img.shields.io/badge/ngx--toastr-0D1117?style=for-the-badge&logo=angular&logoColor=orange&labelColor=0D1117)
![Vitest](https://img.shields.io/badge/Vitest-0D1117?style=for-the-badge&logo=vitest&logoColor=yellow&labelColor=0D1117)

---
<details>
  <summary><strong style="font-size: 20px;">Versões </strong></summary>


- Python 3.11+
- Flask 3.0.0
- Flask-SQLAlchemy 3.1.1 (SQLite)
- Flask-JWT-Extended 4.5.3 (Autorização Tokenizada)
- Flask-Smorest / Marshmallow (REST + Swagger)
- Pytest (Cobertura TDD)
- Node.js 18+
- Angular CLI + Framework v18
- Angular Material 18+
- Jasmine + Karma (Testes Front)
</details>

<details>
  <summary><strong style="font-size: 20px;">Opção 1 — Rodar com Docker (Recomendado)</strong></summary>

> **Pré-requisito:** Ter o [Docker Desktop](https://www.docker.com/get-started/) instalado e rodando.

### Passo a passo

**1. Clone o repositório e acesse a pasta raiz:**
```bash
git clone https://github.com/HenryModesto/JogoMastermind.git
cd <JOGOMASTERMIND>
```

**2. Crie o arquivo `.env` na raiz do projeto:**
```bash
cp backend/.env.example backend/.env
```

O `.env` já vem configurado para o Docker. Não é necessário alterar nada.

**3. Suba todos os serviços com um único comando:**
```bash
docker-compose up --build
```

Aguarde o build completo. Na primeira vez pode levar alguns minutos.

**4. Em outro terminal, popule o banco com dados iniciais:**
```bash
docker-compose exec backend python seed.py
```

### Acessos

| Serviço  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:4200        |
| Backend  | http://localhost:5000        |
| Swagger  | http://localhost:5000/swagger|

### Usuários de teste

| Usuário | Senha    |
|---------|----------|
| player1 | senha123 |
| player2 | senha123 |

### Parar os serviços
```bash
docker-compose down
```

</details>


<details>
  <summary><strong style="font-size: 20px;">Opção 2 — Rodar Manualmente (sem Docker) </strong></summary>

> Use esta opção caso não tenha Docker instalado.

**Pré-requisitos:**
- Python 3.11+
- Node.js 20+
- PostgreSQL rodando localmente (ou SQLite, veja abaixo)


### 1️⃣ Backend

Acesse a pasta do backend:
```bash
cd backend
```

**Crie e ative o ambiente virtual:**

Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

Linux/Mac:
```bash
python -m venv venv
source venv/bin/activate
```

**Instale as dependências:**
```bash
pip install -r requirements.txt
```


**Popule o banco:**
```bash
python seed.py
```

**Inicie o backend:**
```bash
flask run
```

> Se der erro de `FLASK_APP`, rode antes:
>
> Windows: `$env:FLASK_APP = "main.py"`
>
> Linux/Mac: `export FLASK_APP=main.py`

A API ficará disponível em `http://localhost:5000`.



### 2️⃣ Frontend

Em outro terminal, acesse a pasta do frontend:
```bash
cd frontend
```

**Instale as dependências:**
```bash
npm install --legacy-peer-deps
```

**Inicie o frontend:**
```bash
npx ng serve
```

Acesse no browser: `http://localhost:4200`
</details>


<details>
  <summary><strong style="font-size: 20px;">Variáveis de Ambiente (`.env.example`) </strong></summary>


```env
DATABASE_URL=postgresql://mastermind_user:mastermind_pass@db:5432/mastermind
SECRET_KEY=sua_chave_secreta
JWT_SECRET_KEY=sua_chave_jwt
JWT_ACCESS_TOKEN_EXPIRES=86400
```

| Variável                  | Descrição                                              |
|---------------------------|--------------------------------------------------------|
| `DATABASE_URL`            | URI de conexão com o banco (PostgreSQL ou SQLite)      |
| `SECRET_KEY`              | Chave secreta do Flask                                 |
| `JWT_SECRET_KEY`          | Chave de criptografia dos tokens JWT                   |
| `JWT_ACCESS_TOKEN_EXPIRES`| Tempo de expiração do token em segundos (padrão: 24h) |
</details>

<details>
  <summary><strong style="font-size: 20px;">Documentação da API
 </strong></summary>

Todos os endpoints estão documentados interativamente via Swagger em:
```
http://localhost:5000/swagger
```

### Auth
| Método | Endpoint         | Descrição                        | Auth |
|--------|-----------------|----------------------------------|------|
| POST   | /auth/login     | Login e geração de JWT           | ❌   |
| POST   | /auth/register  | Cadastro de novo usuário         | ❌   |

### Games
| Método | Endpoint              | Descrição                              | Auth |
|--------|-----------------------|----------------------------------------|------|
| POST   | /games                | Cria nova partida                      | ✅   |
| POST   | /games/{id}/attempt   | Envia uma tentativa                    | ✅   |
| GET    | /games/{id}           | Retorna estado atual da partida        | ✅   |

### Ranking
| Método | Endpoint   | Descrição                                      | Auth |
|--------|-----------|------------------------------------------------|------|
| GET    | /ranking  | Lista melhores jogadores (1 resultado por user)| ✅   |

**Critério de ordenação do ranking:**
1. Menor número de tentativas
2. Menor tempo de duração
3. Data mais recente em caso de empate

</details>


<details>
  <summary><strong style="font-size: 20px;">Testes</strong></summary>

### Backend
```bash
cd backend
venv\Scripts\activate  
pytest -s
```

### Frontend
```bash
cd frontend
npx ng test
```
</details>


<strong style="font-size: 20px;">Fluxo da Aplicação</strong>
--- 

<strong style="font-size: 14px;">Cadastro</strong>

![Cadastro](https://github.com/user-attachments/assets/caab083a-3c67-4b3d-884f-e30c140c8fff)

<strong style="font-size: 14px;">Login</strong>

![Login](https://github.com/user-attachments/assets/3cfe81e0-e0cb-4e30-9321-fc7dd4c46b29)

<strong style="font-size: 14px;">Dashboard</strong>

![Dashboard](https://github.com/user-attachments/assets/7c15a7bc-e0a6-436f-b314-6056b84a0ea1)

<strong style="font-size: 14px;">Game</strong>

![Game](https://github.com/user-attachments/assets/bd21aaa1-b159-452d-8bd4-e80bd0b42aec)

<strong style="font-size: 14px;">Ranking</strong>

![Ranking](https://github.com/user-attachments/assets/83cf8f60-d19c-46f4-b9a4-fe9e228f0b7b)

---

1. Usuário acessa `[https://mastermaind-henrymodestos-projects.vercel.app/]` → redirecionado para **Login**
2. Faz login ou cria uma conta em **Cadastro**
3. Após login, acessa o **Dashboard** com opções de Nova Partida e Ranking
4. Na tela do **Jogo**, digita 4 dígitos (1–6) por tentativa
5. O backend valida e retorna pinos de feedback:
   - Pino preto = dígito na posição correta
   - Pino cinza = dígito certo, posição errada
6. Ao vencer ou esgotar 10 tentativas, exibe resultado
7. O **Ranking** mostra o melhor resultado de cada jogador, mas só se você acertar.
