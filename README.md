# Desafio DevSecOps — Gerenciador de Tarefas

## Sobre o Projeto
Este repositório faz parte do desafio prático do módulo de DevSecOps da ADA Tech.
Você receberá este projeto com vulnerabilidades propositais e uma pipeline incompleta.
Seu objetivo é **implementar a pipeline de segurança** e **corrigir as vulnerabilidades**.

## Estado atual
A pipeline está **incompleta**. Os steps de segurança precisam ser implementados por você.

## Sua missão
1. Implementar os steps de segurança no `pipeline.yml`
2. Fazer a pipeline **quebrar** ao detectar os problemas
3. Corrigir as vulnerabilidades encontradas
4. Fazer a pipeline **passar** com tudo verde ✅
5. Documentar o funcionamento da pipeline neste README

## O que implementar
- [ ] Secrets Scanning com **Gitleaks**
- [ ] SAST com **Semgrep**
- [ ] SCA com **Grype**
- [ ] Deploy com **GitHub Pages**

## Como a pipeline funciona
1. GitLeaks (Buscador de secrets)

É uma ferramenta de busca de secrets expostas e hardcoded, extremamente importante por ajudar o desenvolvedor a não commitar segredos no código, onde após estar sendo trackeado não sairá do histórico, sendo necessário rotacionar as senhas o mais rápido possível se tiverem sido commitadas. Ele usa na varredura estática expressões regex e cálculos de entropia para identificar as secrets.

Ao implementar o gitleaks inicialmente utilizei o modo sujerido, mas logo vi que ele não ia encotrar pois as chaves não estavam em padrão que são utilizados na industria ou não tinham entropia suficiente.
Para contornar esse problema utilizei do `.gitleaks.toml` para criar regras para ele encontrar as secrets.

```[[rules]]
id = "generic-hardcoded-password"
description = "Senha hardcoded em variavel"
regex = '''(?i)(password|passwd|pwd|senha|db_password)\s*[=:]\s*["'][^"']{4,}["']'''
keywords = ["password", "passwd", "pwd", "senha","api_key"]
```

Com isso ele passou a achar as secrets expostas no código.

2. Semgrep (SAST)

Ferramenta de analise estática de código que procura por padrões inseguros, falhas de lógica ou métodos vulneráveis utilizados no desenvolvimento, garantindo que o código não tenho falhas de segurança descritos pela OWASP.

Esse foi o que mais me deu problemas, mesmo utilisando configurações divesas ele geralmente só achava o erro do `eval()`, só fui consegir que achasse os outros erros no codigo com o `r/all`, mas ele mesmo acabava quebrando o codigo com alguma rule da comunidade.
Consegui melhorar criando um `.semgrep.yml` para adicionar os tipos de vulnerabilidades que estava deixando passar.

```rules:
  - id: dom-based-xss-innerhtml
    # O "..." captura qualquer concatenação ou variável que for injetada
    pattern: $ELEM.innerHTML = ...
    message: "🚨 [Segurança] DOM-Based XSS: Manipulação direta via innerHTML detectada. Use innerText ou textContent."
    languages: [javascript]
    severity: ERROR

  - id: information-exposure-stack
    # Procura especificamente por qualquer uso de ".stack" em variáveis de erro
    pattern: $ERR.stack
    message: "🚨 [Segurança] Information Exposure: O Stack Trace do erro está sendo exposto, vazando a estrutura interna da aplicação."
    languages: [javascript]
    severity: ERROR
```

Assim consegui fazer com que achasse todas as vulnerabilidades.

Vale dizer que tentei utilizar o CodeQL mas ele deu problema de licença, então foi que voltei para o Semgrep com as custom configs.

3. Grype (SCA)

Ferramentas de SCA são de extrema importância por verificar artefatos e manifestos buscando as dependências, que podem introduzir vulnerabilidades vindos dos terceiros, ainda mais numa situação atual de diversos ataques a supply-chains de dependências famosas. Garante que tenha a versão que as vulnerabilidades já foram tratadas. 

O Grype foi um pouco mais facil, quando utilizei a primeira vez com as configs sugeridas vi que ele não tinha achado nenhuma dependencia, foi ai então que percebi que não tinha nenhum `package-lock.json`, então rodei o `npm install` para que ele fosse criado, dando então a visibilidade para o grype.
Após ele acusar versões mais atuais que deveriam ser atualizadas, fui verificar nas documentações de cada uma e atualizei elas, depois ele parou de acusar vulnerabilidades.

## URL de Produção
[LINK GITHUB PAGES](https://leobrasil1994.github.io/Projeto-ada-tech-2026-07/)
