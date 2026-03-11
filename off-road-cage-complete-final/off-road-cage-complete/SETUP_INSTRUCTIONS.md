# Off Road Cage - Setup Instructions

## 📦 Conteúdo do Projeto

Este é o projeto completo do jogo **Off Road Cage** com todas as dependências e arquivos necessários.

### Estrutura de Arquivos

```
off-road-cage-complete/
├── client/
│   ├── public/          # Arquivos estáticos
│   ├── src/
│   │   ├── game/        # Lógica do jogo Phaser
│   │   │   ├── scenes/  # Cenas do jogo (Boot, Title, Select, Game, Finish)
│   │   │   ├── Game.ts  # Configuração principal
│   │   │   └── constants.ts # Constantes e configurações
│   │   ├── pages/       # Páginas React
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── App.tsx      # Componente raiz
│   │   └── main.tsx     # Entry point
│   └── index.html       # HTML principal
├── server/              # Servidor Express
├── shared/              # Código compartilhado
├── package.json         # Dependências do projeto
├── pnpm-lock.yaml       # Lock file do pnpm
├── tsconfig.json        # Configuração TypeScript
├── vite.config.ts       # Configuração Vite
└── SETUP_INSTRUCTIONS.md # Este arquivo
```

## 🚀 Como Usar

### 1. Extrair o Arquivo ZIP

```bash
unzip off-road-cage-complete.zip
cd off-road-cage-complete
```

### 2. Instalar Dependências

```bash
# Com pnpm (recomendado)
pnpm install

# Ou com npm
npm install

# Ou com yarn
yarn install
```

### 3. Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Ou
npm run dev
```

O jogo estará disponível em `http://localhost:3000`

### 4. Build para Produção

```bash
# Compilar para produção
pnpm build

# Ou
npm run build
```

Isso criará a pasta `dist/` com os arquivos otimizados.

### 5. Executar em Produção

```bash
# Iniciar servidor de produção
npm start

# Ou com PM2
pm2 start "npm start" --name "off-road-cage"
```

## 🎮 Características do Jogo

- ✅ 5 pistas diferentes
- ✅ 4 adversários controlados por IA
- ✅ Sistema de superaquecimento do motor
- ✅ Rampas, bumpers e speed arrows
- ✅ Controles mobile (touch buttons)
- ✅ Música de fundo (Cotton Eye Joe Remix)
- ✅ HUD completo com informações do jogo
- ✅ Buggy customizado em alta resolução

## 📝 Arquivos Importantes

- **client/src/game/Game.ts** - Configuração principal do Phaser
- **client/src/game/constants.ts** - Constantes, tracks e configurações
- **client/src/game/scenes/GameScene.ts** - Lógica principal do jogo
- **client/src/pages/Home.tsx** - Componente React que renderiza o jogo
- **server/index.ts** - Servidor Express para servir arquivos estáticos
- **package.json** - Dependências do projeto

## 🔧 Tecnologias Utilizadas

- **Phaser 3.x** - Game engine
- **React 19** - UI framework
- **TypeScript** - Linguagem tipada
- **Vite** - Build tool
- **Express.js** - Servidor web
- **Tailwind CSS** - Styling
- **pnpm** - Package manager

## 📤 Deploy na EC2

1. Clone este repositório na EC2:
   ```bash
   git clone https://github.com/SEU_USUARIO/off-road-cage.git
   cd off-road-cage
   ```

2. Instale dependências:
   ```bash
   pnpm install
   ```

3. Faça build:
   ```bash
   pnpm build
   ```

4. Inicie com PM2:
   ```bash
   pm2 start "npm start" --name "off-road-cage"
   pm2 save
   ```

5. Configure Nginx como reverse proxy (veja guia de instalação)

## 🐛 Troubleshooting

### Porta 3000 em uso
```bash
sudo lsof -i :3000
sudo kill -9 PID
```

### Erro de build
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### PM2 não inicia
```bash
pm2 logs off-road-cage
pm2 restart off-road-cage
```

## 📚 Documentação

- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Express Docs](https://expressjs.com)

## 👨‍💻 Autor

Projeto desenvolvido com Manus AI para demonstrar habilidades em game development e DevOps.

---

**Pronto para jogar! 🎮🚗**
