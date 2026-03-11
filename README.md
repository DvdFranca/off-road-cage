# 🚀 DevOps & Cloud Security Lab

Bem-vindo ao **DevOps & Cloud Security Lab**, um projeto prático criado para demonstrar habilidades reais em **DevOps, Cloud, Automação e Segurança da Informação** utilizando serviços da AWS e boas práticas modernas de engenharia.

Este repositório documenta a construção **end-to-end** de uma aplicação web simples, evoluindo gradualmente para um ambiente **cloud-native**, seguro, monitorado e orientado a dados. O objetivo é demonstrar **aprendizado contínuo, capacidade de automação e mentalidade DevOps aplicada à segurança**.

---

# 🎯 Objetivo do Projeto

Este laboratório foi criado para:

- Demonstrar **habilidades práticas em DevOps e Cloud**
- Aplicar **boas práticas de segurança em infraestrutura**
- Construir um ambiente **escalável, observável e automatizado**
- Documentar a evolução técnica do projeto ao longo do tempo
- Servir como **portfólio técnico para recrutadores e empresas**

Cada etapa do projeto adiciona novos componentes de **infraestrutura, observabilidade e segurança**, simulando um ambiente real de produção.

---

# 🕹️ Aplicação

A aplicação é um **jogo web inspirado em jogos clássicos**, desenvolvido com auxílio de IA e hospedado na AWS.

Ela funciona como **carga de aplicação para o laboratório DevOps**, permitindo testar:

- Deploy em infraestrutura cloud
- Balanceamento de carga
- Monitoramento
- Segurança
- Integração com banco de dados
- Visualização de métricas

---

# ☁️ Arquitetura Cloud

A aplicação está hospedada na **AWS** utilizando os seguintes componentes:

```
Usuário
   │
   ▼
Domínio personalizado
(Route 53)
   │
   ▼
Application Load Balancer
   │
   ▼
EC2 (Web Server)
   │
   ▼
Aplicação Web
```

Arquitetura atual:

- 🌐 **Route 53** — gerenciamento de DNS
- ⚖️ **Application Load Balancer** — distribuição de tráfego
- 🖥️ **EC2** — hospedagem da aplicação
- 🔐 **AWS Inspector** — análise de vulnerabilidades
- 🗄️ **RDS** — banco de dados gerenciado
- 📊 **Metabase** — visualização de dados e métricas de segurança

---

# 🔐 Segurança e Vulnerability Management

Um dos focos principais deste projeto é **segurança em infraestrutura cloud**.

Serão implementadas práticas como:

- 🔍 **AWS Inspector** para identificação de vulnerabilidades
- 🛡️ Monitoramento de CVEs em instâncias EC2
- 📦 Análise de pacotes vulneráveis
- 📊 Centralização de indicadores de segurança
- 📈 Dashboards de vulnerabilidades

Essas métricas serão armazenadas em um banco de dados e analisadas via **Metabase**.

---

# 📊 Observabilidade com Metabase

O projeto inclui um **ambiente de Business Intelligence voltado para segurança**.

O Metabase será utilizado para gerar dashboards como:

- 📉 Vulnerabilidades por severidade
- 📦 Pacotes vulneráveis por instância
- 📅 Evolução de vulnerabilidades ao longo do tempo
- 🚨 Alertas de segurança
- 📊 Indicadores de postura de segurança

Isso simula um **mini Security Operations Dashboard**.

---

# 🛠️ Roadmap do Projeto

O projeto continuará evoluindo com novas funcionalidades.

## Infraestrutura

- [x] Deploy inicial da aplicação
- [x] Configuração de DNS
- [x] Load Balancer
- [ ] Infraestrutura como código (Terraform)

## Segurança

- [ ] Ativação do AWS Inspector
- [ ] Pipeline de análise de vulnerabilidades
- [ ] Automação de coleta de CVEs
- [ ] Dashboards de vulnerabilidades

## Dados

- [ ] Banco de dados RDS
- [ ] Pipeline de ingestão de dados
- [ ] Estrutura de métricas de segurança

## Observabilidade

- [ ] Instalação do Metabase
- [ ] Dashboards de segurança
- [ ] Métricas de infraestrutura

## DevOps

- [ ] CI/CD Pipeline
- [ ] Automação de deploy
- [ ] Monitoramento de aplicação

---

# 🧠 Tecnologias Utilizadas

## Cloud

- AWS EC2
- AWS Route 53
- AWS Application Load Balancer
- AWS RDS
- AWS Inspector

## DevOps

- Git
- GitHub
- Linux
- Bash

## Observabilidade

- Metabase

## Segurança

- Vulnerability Management
- CVE Monitoring
- Security Metrics

---

# 📚 Filosofia do Projeto

Este repositório segue três princípios principais:

### 1️⃣ Aprendizado contínuo

Cada melhoria representa uma nova habilidade adquirida.

### 2️⃣ Infraestrutura prática

Tudo aqui é implementado em ambiente real na AWS.

### 3️⃣ Security by Design

Segurança é tratada como parte fundamental da arquitetura desde o início do projeto.

---

# 👨‍💻 Autor

Projeto desenvolvido como laboratório prático de **DevOps, Cloud e Segurança da Informação**, com foco em evolução técnica contínua e aplicação de boas práticas do mercado.

---

⭐ Se este projeto for útil ou interessante para você, considere deixar uma estrela no repositório!
