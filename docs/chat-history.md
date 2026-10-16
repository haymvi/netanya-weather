# PROJETO NETANYA WEATHER
## Documentação técnica e instruções para o Codex

**Projeto:** Dashboard meteorológico de Netanya com acesso por QR Code e chaveiro impresso em 3D, utilizando a Flashforge Adventurer 5X (AD5X).

**Data do histórico:** 16 de outubro de 2026  
**Repositório GitHub:** `netanya-weather`  
**Idioma padrão:** Hebraico  
**Idioma alternativo:** Inglês

---

# 1. INSTRUÇÕES AO CODEX

Criar uma documentação técnica completa deste projeto em dois formatos:

1. `HOWTO.md` — documentação em Markdown, para leitura no GitHub.
2. `howto.html` — página HTML responsiva, organizada e acessível pelo GitHub Pages.

A documentação deve explicar como o projeto funciona, sua arquitetura, implantação, manutenção e fabricação do chaveiro com QR Code.

**Importante:** preservar o arquivo `index.html` existente. Ele é o dashboard meteorológico e não deve ser substituído pela documentação.

Antes de alterar qualquer código, inspecionar os arquivos disponíveis e identificar quais funcionalidades estão realmente implementadas. Este documento registra o histórico do desenvolvimento, mas não substitui uma auditoria do código-fonte.

Não declarar como concluídas etapas que ainda dependem de execução ou verificação.

---

# 2. OBJETIVO DO PROJETO

Desenvolver um sistema meteorológico acessível através de um chaveiro físico equipado com QR Code.

O funcionamento pretendido é:

1. Uma pessoa recebe um chaveiro impresso em 3D.
2. O chaveiro contém um QR Code com o endereço permanente de uma página meteorológica.
3. Ao escanear o QR Code com o celular, a pessoa acessa o dashboard de Netanya, Israel.
4. A página consulta uma API meteorológica e apresenta dados atualizados.
5. O idioma inicial é hebraico, com opção para inglês.
6. O sistema não exige instalação de aplicativos, autenticação ou pagamento.

O GitHub Pages será responsável por hospedar a interface web.

A Open-Meteo será responsável pelo fornecimento dos dados meteorológicos e marítimos.

A Flashforge AD5X será utilizada para fabricar o chaveiro em duas cores.

---

# 3. HISTÓRICO DO DESENVOLVIMENTO

## Etapa 1 — Especificação meteorológica

Foi estabelecido que a página seria exclusivamente meteorológica, com interface limpa, leve e adequada a celulares.

Foram definidos os seguintes grupos de informações:

**Condições atuais:**
- Temperatura ambiente.
- Sensação térmica.
- Velocidade do vento.
- Direção do vento.
- Umidade relativa.
- Pressão atmosférica.
- Índice ultravioleta.
- Precipitação.

**Previsão:**
- Evolução das condições nas próximas 12 horas.
- Opção de visualizar as próximas 24 horas.
- Previsão para cinco dias.
- Temperaturas mínimas e máximas.
- Probabilidade de chuva.
- Condições gerais do tempo.

**Condições marítimas:**
- Temperatura da superfície do mar.
- Altura das ondas.

Os dados marítimos são particularmente relevantes por Netanya estar localizada na costa do Mediterrâneo.

## Etapa 2 — Escolha da API

Foi escolhida a Open-Meteo.

Motivos:
- Disponibiliza uma API HTTP/JSON.
- Não exige chave de API para acesso gratuito não comercial, sujeito aos termos e limites do serviço.
- Fornece previsões meteorológicas.
- Oferece uma API marítima separada.
- Permite consultar coordenadas geográficas diretamente.
- É compatível com JavaScript executado no navegador.

Coordenadas adotadas:

- Latitude: `32.3215`
- Longitude: `34.8532`
- Fuso horário: `Asia/Jerusalem`

O dashboard deve sempre usar Netanya como localização fixa, independentemente da localização de quem escanear o QR Code.

## Etapa 3 — Primeira versão da página

Foi produzida uma versão inicial em português.

Características registradas:
- Arquivo HTML único.
- CSS e JavaScript integrados.
- Layout responsivo.
- Apresentação de dados em cartões.
- Gráficos das próximas 12/24 horas.
- Previsão de cinco dias.
- Informações marítimas.
- Atualização periódica dos dados meteorológicos.

O arquivo principal foi denominado `index.html`.

Também foram geradas prévias visuais para telas de computador e celular.

## Etapa 4 — Internacionalização

Posteriormente foi solicitada a substituição do português por hebraico e inglês.

Uma segunda versão de `index.html` foi produzida com:

- Hebraico como idioma padrão.
- Inglês como idioma alternativo.
- Seletor de idiomas no cabeçalho.
- Layout RTL (right-to-left) para hebraico.
- Layout LTR (left-to-right) para inglês.
- Tradução dos textos da interface.
- Tradução de descrições meteorológicas.
- Tradução de rótulos dos gráficos.
- Memorização da preferência de idioma no navegador.

A troca de idioma foi concebida para ocorrer sem redirecionar para outra página.

A versão em português foi preservada como cópia de referência, sob o nome `index-pt-original.html`.

O pacote final dessa etapa recebeu o nome:

`netanya-dashboard-he-en.zip`

## Etapa 5 — Testes realizados

Durante o desenvolvimento anterior foram informados testes com dados meteorológicos simulados.

Foram geradas prévias para:
- Desktop em hebraico.
- Desktop em inglês.
- Celular em hebraico.
- Celular em inglês.

Também foi informada uma verificação da troca de idioma e da apresentação dos gráficos.

**Limitação importante:** esses testes não representam confirmação de todas as requisições reais às APIs da Open-Meteo em produção. O Codex deverá realizar uma nova verificação da implementação, inclusive das respostas reais e do tratamento de erros.

## Etapa 6 — Criação do repositório GitHub

O usuário criou o repositório público:

`netanya-weather`

A última captura de tela disponível mostrava o repositório na página inicial de configuração, com a seção *Quick setup*.

Naquele momento, o repositório ainda aparecia vazio.

Portanto, não há confirmação neste histórico de que:
- O arquivo `index.html` tenha sido enviado ao GitHub.
- O GitHub Pages tenha sido ativado.
- O dashboard tenha sido publicado em uma URL definitiva.

Essas tarefas devem ser verificadas e concluídas.

---

# 4. ARQUITETURA DO SOFTWARE

Arquitetura prevista:

**Navegador do usuário**
→ carrega o `index.html` hospedado no GitHub Pages  
→ executa JavaScript  
→ consulta a Open-Meteo  
→ recebe JSON  
→ processa os dados  
→ atualiza cartões e gráficos meteorológicos.

Não é necessário um servidor próprio para executar as consultas.

O GitHub Pages hospeda os arquivos estáticos, enquanto o navegador consulta os serviços meteorológicos.

## 4.1 Arquivos

Estrutura desejada:

```text
netanya-weather/
├── index.html
├── howto.html
├── HOWTO.md
├── README.md
└── assets/
```

O arquivo `index.html` deve permanecer como página inicial.

Os demais arquivos poderão ser acrescentados sem modificar a função principal do dashboard.

Não criar diretórios vazios ou arquivos adicionais sem necessidade.

## 4.2 Tecnologias

- HTML5 — estrutura do documento.
- CSS3 — estilos e responsividade.
- JavaScript — consultas, formatação e interação.
- JSON — intercâmbio de dados.
- Open-Meteo — informações meteorológicas.
- Open-Meteo Marine API — informações marítimas.
- GitHub Pages — hospedagem pública.
- QR Code — acesso através da câmera do celular.

A implementação anterior foi descrita como um único arquivo sem bibliotecas externas. O Codex deverá confirmar essa característica examinando o HTML real.

---

# 5. API METEOROLÓGICA

## 5.1 Endpoint principal

```text
https://api.open-meteo.com/v1/forecast
```

Parâmetros fundamentais:

```text
latitude=32.3215
longitude=34.8532
timezone=Asia/Jerusalem
```

Dados desejados:

| Informação | Variável Open-Meteo |
|---|---|
| Temperatura | `temperature_2m` |
| Sensação térmica | `apparent_temperature` |
| Umidade relativa | `relative_humidity_2m` |
| Pressão atmosférica | `pressure_msl` |
| Velocidade do vento | `wind_speed_10m` |
| Direção do vento | `wind_direction_10m` |
| Código meteorológico | `weather_code` |
| Índice UV | `uv_index` |
| Probabilidade de chuva | `precipitation_probability` |
| Precipitação | `precipitation` |
| Temperatura máxima diária | `temperature_2m_max` |
| Temperatura mínima diária | `temperature_2m_min` |
| Precipitação diária prevista | `precipitation_sum` |

As variáveis devem ser solicitadas nos conjuntos compatíveis `current`, `hourly` ou `daily`, conforme a documentação da API.

Nem todas as variáveis existem em todos os conjuntos. Por exemplo, o índice UV pode precisar ser obtido dos dados horários.

Essa tabela define as variáveis de referência, não afirma quais parâmetros exatos constam do HTML existente.

## 5.2 API marítima

Endpoint:

```text
https://marine-api.open-meteo.com/v1/marine
```

Variáveis de interesse:

```text
wave_height
sea_surface_temperature
```

Verificar a disponibilidade dessas variáveis e suas resoluções temporais.

Caso um dado marítimo não esteja disponível, a interface deve apresentar uma indicação clara de indisponibilidade, em vez de inventar valores ou interromper o funcionamento das outras seções.

## 5.3 Atualização automática

Intervalo estabelecido:

**15 minutos = 900.000 milissegundos.**

A página deve:
1. Consultar os dados ao abrir.
2. Atualizar as informações periodicamente.
3. Apresentar o horário da última atualização.
4. Tratar falhas de rede.
5. Evitar requisições simultâneas duplicadas.
6. Não apresentar dados simulados como se fossem atuais.

A atualização do dashboard a cada 15 minutos não significa que os modelos meteorológicos forneçam novas medições a cada 15 minutos.

---

# 6. INTERFACE E IDIOMAS

## 6.1 Hebraico

Idioma inicial:

```html
<html lang="he" dir="rtl">
```

Exemplos dos rótulos:

| Português | Hebraico |
|---|---|
| Temperatura | טמפרטורה |
| Sensação térmica | טמפרטורה מורגשת |
| Vento | רוח |
| Umidade | לחות |
| Pressão atmosférica | לחץ אטמוספרי |
| Previsão | תחזית |
| Chuva | גשם |
| Mar | ים |
| Ondas | גלים |

O layout deve adaptar-se adequadamente ao sentido da escrita.

Números, unidades, horas e gráficos precisam permanecer legíveis, inclusive quando estiverem inseridos em textos da direita para a esquerda.

## 6.2 Inglês

Ao selecionar inglês, a interface deve mudar para:

```html
<html lang="en" dir="ltr">
```

Exemplos:

- Temperature
- Feels like
- Wind
- Humidity
- Pressure
- Forecast
- Rain
- Sea
- Waves

Todas as seções devem ser traduzidas, não apenas o cabeçalho.

## 6.3 Preferência de idioma

O funcionamento solicitado foi:

- Primeira visita: hebraico.
- Usuário escolhe inglês: página passa para inglês.
- Visitas posteriores no mesmo navegador: preferência preservada.

A solução proposta anteriormente utiliza armazenamento local do navegador (`localStorage`).

O Codex deve conferir e testar essa implementação.

---

# 7. PUBLICAÇÃO NO GITHUB PAGES

O repositório já foi criado, mas a publicação precisa ser confirmada.

## Passo 1 — Adicionar index.html

Abrir o repositório `netanya-weather`.

Se estiver vazio, localizar a seção **Quick setup** e clicar em:

`uploading an existing file`

Selecionar o arquivo `index.html`.

Confirmar com **Commit changes**.

Alternativamente, o Codex poderá enviar os arquivos por Git, caso tenha acesso ao repositório e autorização para modificar seu conteúdo.

## Passo 2 — Ativar GitHub Pages

Dentro do repositório:

1. Abrir `Settings`.
2. Selecionar `Pages`.
3. Em `Build and deployment`, escolher `Deploy from a branch`.
4. Selecionar `main`.
5. Escolher `/(root)`.
6. Clicar em `Save`.

## Passo 3 — Determinar a URL

O endereço esperado segue o padrão:

```text
https://USUARIO.github.io/netanya-weather/
```

Substituir `USUARIO` pelo nome real da conta GitHub.

Não presumir que a URL esteja ativa antes de testá-la.

## Passo 4 — Testes após publicação

Confirmar:

- A página abre no navegador.
- Abre corretamente no celular.
- O idioma padrão é hebraico.
- O botão inglês funciona.
- Os dados meteorológicos reais carregam.
- Os dados marítimos carregam, quando disponíveis.
- A página continua utilizável quando a API falha.
- Não existem erros de JavaScript bloqueando a interface.
- Os horários correspondem ao fuso de Israel.

---

# 8. QR CODE

O QR Code será produzido somente depois de confirmada a URL pública do GitHub Pages.

O QR deverá codificar o endereço completo:

```text
https://USUARIO.github.io/netanya-weather/
```

Não utilizar um endereço provisório ou apenas o endereço do repositório.

## Requisitos

- QR Code preto sobre fundo branco.
- Correção de erros adequada, preferencialmente nível Q ou H, desde que a densidade resultante permaneça imprimível.
- Margem livre (*quiet zone*) de pelo menos quatro módulos em todos os lados.
- Sem logotipos, desenhos ou interferências sobre os módulos.
- Bordas geometricamente nítidas.
- Dimensionamento proporcional à quantidade real de módulos.

O código deverá ser testado com diferentes smartphones antes da fabricação definitiva.

A geometria final deve ser calculada a partir da matriz real do QR Code, sem redesenhar manualmente os quadrados.

---

# 9. PROJETO DO CHAVEIRO 3D

Equipamento:

**Flashforge Adventurer 5X — AD5X**

Impressão multicolorida utilizando dois slots.

## 9.1 Distribuição de materiais

| Componente | Slot | Cor | Espessura |
|---|---|---|---|
| Base do chaveiro | Slot 1 | Branco | 1,0 mm |
| Módulos do QR Code | Slot 2 | Preto | 1,2 mm acima da base |
| Anel de fixação | Slot 1 | Branco | 1,0 mm |

O anel deve ser integrado à base, localizado acima do QR Code e utilizado para fixar o chaveiro a uma argola.

Não criar uma peça separada para o anel.

## 9.2 Estrutura vertical

Geometria pretendida:

```text
Z = 2,2 mm  Topo do QR preto
             ██████  Preto: 1,2 mm
Z = 1,0 mm  ─────────────────────
             Base branca: 1,0 mm
Z = 0,0 mm  ─────────────────────
             Mesa de impressão
```

Portanto:

- Espessura total nas regiões pretas: **2,2 mm**.
- Espessura nas regiões brancas: **1,0 mm**.
- Espessura do anel: **1,0 mm**.

Os módulos pretos começam sobre a superfície branca e são impressos acima dela.

O preto não deve preencher regiões que deveriam permanecer brancas.

## 9.3 Dimensões iniciais sugeridas

Estas dimensões ainda não foram aprovadas definitivamente e deverão ser ajustadas à densidade do QR Code.

- Largura do corpo: aproximadamente 45–55 mm.
- Área destinada ao QR: dimensionada para garantir leitura e impressão correta.
- Diâmetro interno do furo: aproximadamente 5 mm.
- Diâmetro externo do anel: aproximadamente 10–12 mm.
- Anel centralizado acima do QR.
- Cantos externos arredondados, se isso não interferir na margem do QR.

A largura dos módulos deve ser compatível com a resolução efetiva da impressão. Como referência inicial, buscar módulos de aproximadamente 0,8–1,0 mm ou maiores, dependendo do bico e da matriz QR.

**Observação mecânica:** um anel de 1,0 mm de espessura poderá ser frágil para uso prolongado como chaveiro. Manter a especificação solicitada, mas avaliar sua resistência antes de fabricar várias unidades. Não aumentar a espessura sem autorização do usuário.

## 9.4 Formato dos arquivos

Preferência:

**3MF com dois conjuntos de geometria e atribuição de filamentos.**

Alternativa:

- STL da base branca.
- STL dos módulos pretos.
- Arquivo de projeto do fatiador com os dois objetos posicionados e alinhados.

Os módulos do QR devem estar corretamente alinhados com a base.

O modelo precisa ser verificável geometricamente e não deve depender de uma textura ou fotografia aplicada sobre uma superfície.

O QR Code deve existir como geometria tridimensional real.

---

# 10. CONFIGURAÇÕES DE IMPRESSÃO

Impressora: Flashforge AD5X.

Fatiador: OrcaSlicer, caso o perfil utilizado seja compatível com a máquina e com o sistema multicolorido.

Configuração pretendida:

```text
Filamento 1: branco
Filamento 2: preto

Base:
Z = 0,0 a 1,0 mm

QR Code preto:
Z = 1,0 a 2,2 mm

Anel:
Z = 0,0 a 1,0 mm
```

Sugestão inicial de altura de camada: 0,20 mm, desde que seja compatível com o perfil de impressão escolhido.

Isso permite:
- 5 camadas para a base.
- 6 camadas adicionais para o relevo preto.

A configuração precisa ser conferida no preview do fatiador.

Não presumir que o slot físico e o número do filamento configurado no slicer coincidam automaticamente. Verificar o mapeamento antes da impressão.

## Testes obrigatórios

1. Verificar dimensões XY e Z.
2. Conferir todos os módulos do QR Code.
3. Confirmar o mapeamento branco/preto.
4. Confirmar que a primeira região preta começa em Z = 1,0 mm.
5. Confirmar a ausência de suportes sobre o QR.
6. Testar a legibilidade com a câmera de um celular.
7. Avaliar a resistência do anel.
8. Imprimir uma unidade de teste antes de produzir várias.

---

# 11. SITUAÇÃO ATUAL DO PROJETO

| Componente | Situação no histórico |
|---|---|
| Especificação meteorológica | Definida |
| Primeira versão HTML em português | Produzida |
| Versão hebraico/inglês | Produzida |
| Layout responsivo | Testado com dados simulados |
| API meteorológica | Integração escrita, funcionamento real a verificar |
| API marítima | Integração escrita, funcionamento real a verificar |
| ZIP para GitHub Pages | Produzido |
| Repositório `netanya-weather` | Criado |
| Upload do HTML | Não confirmado |
| Publicação no GitHub Pages | Não confirmada |
| URL definitiva | Pendente |
| QR Code definitivo | Não produzido |
| Modelo tridimensional do chaveiro | Não produzido |
| Arquivo 3MF para AD5X | Não produzido |
| Impressão física | Não realizada |

---

# 12. PRÓXIMAS ETAPAS — ORDEM DE EXECUÇÃO

**Fase A — GitHub**

1. Inspecionar os arquivos disponíveis.
2. Confirmar a presença e o conteúdo do `index.html`.
3. Enviar o dashboard ao repositório.
4. Ativar GitHub Pages.
5. Confirmar a URL pública.
6. Testar as duas línguas e as APIs reais.

**Fase B — Documentação**

7. Criar `HOWTO.md` com documentação completa, fiel ao código.
8. Criar `howto.html` com boa apresentação visual.
9. Disponibilizar a documentação sem sobrecarregar o dashboard meteorológico.

**Fase C — QR Code**

10. Utilizar a URL pública validada.
11. Gerar o QR Code.
12. Determinar o tamanho mínimo dos módulos.
13. Testar a leitura digital.

**Fase D — Modelagem e impressão**

14. Gerar a base branca de 1 mm.
15. Gerar os módulos pretos em relevo de 1,2 mm.
16. Incorporar o anel branco de 1 mm.
17. Exportar o modelo para 3MF.
18. Configurar slot 1 branco e slot 2 preto.
19. Validar o fatiamento.
20. Imprimir uma amostra.
21. Testar leitura e resistência.
22. Corrigir a geometria, se necessário.
23. Liberar a versão final para fabricação.

---

# 13. CRITÉRIOS DE CONCLUSÃO

O projeto somente deverá ser considerado concluído quando:

- O dashboard estiver publicamente acessível.
- Os dados reais da Open-Meteo forem carregados corretamente.
- A interface funcionar em hebraico e inglês.
- O QR Code abrir a página correta.
- O chaveiro puder ser impresso nas duas cores.
- As espessuras especificadas forem respeitadas.
- O anel estiver integrado à peça.
- Um chaveiro físico impresso puder ser escaneado com sucesso.

---

# 14. INSTRUÇÃO FINAL AO CODEX

Utilize esta documentação como histórico e especificação do projeto.

Primeiro, faça uma auditoria do repositório e identifique exatamente o que existe.

Depois:

1. Produza o `HOWTO.md`.
2. Produza o `howto.html`, com apresentação técnica e responsiva.
3. Mantenha o `index.html` como dashboard meteorológico.
4. Identifique eventuais divergências entre este documento e o código real.
5. Apresente claramente o que está implementado, testado e pendente.
6. Não gere um QR Code definitivo enquanto a URL pública não estiver validada.
7. Não crie arquivos 3D fictícios nem modelos que apenas imitem visualmente um QR Code.
8. Preserve os requisitos dimensionais e a atribuição dos dois filamentos da Flashforge AD5X.

**Objetivo final: um sistema completo, documentado, reproduzível e fabricável, desde a consulta meteorológica até o chaveiro físico com QR Code funcional.**