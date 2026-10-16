# Netanya: dados para surf, windsurf e kitesurf

Atualização de 16 de outubro de 2026. Esta revisão coloca informações marítimas
e vento no início do dashboard e mantém o clima geral em seção expansível.
Não altera a URL codificada no chaveiro.

## Fontes efetivamente conferidas

Foi inspecionado o código-fonte oficial da documentação Open-Meteo, commit
`a7707786f304c1f32b5095eb18131287b820c1e7`:

- [Documentação marítima](https://open-meteo.com/en/docs/marine-weather-api).
- [Fonte auditada da documentação marítima](https://github.com/open-meteo/open-meteo-website/blob/a7707786f304c1f32b5095eb18131287b820c1e7/src/routes/en/docs/marine-weather-api/+page.svelte).
- [Lista oficial de variáveis e disponibilidade por modelo](https://github.com/open-meteo/open-meteo-website/blob/a7707786f304c1f32b5095eb18131287b820c1e7/src/routes/en/docs/marine-weather-api/options.ts).
- [Documentação meteorológica](https://open-meteo.com/en/docs).
- [Fonte auditada da documentação meteorológica](https://github.com/open-meteo/open-meteo-website/blob/a7707786f304c1f32b5095eb18131287b820c1e7/src/routes/en/docs/+page.svelte).

As explicações da página vinculam [M] à documentação marítima e [W] à
meteorológica. Valores não vêm de recomendações esportivas: vêm das respostas
JSON cujas URLs completas estão nos links “Open requested API data”.

A documentação marítima cita DWD e lista diversos provedores de modelos. A página
usa Best Match, seleção automática do provedor, e não inventa um modelo ou horário
de rodada específicos: esses identificadores não estão nas respostas usadas.

## O que cada campo significa

| Informação | Campo / origem | Apresentação |
|---|---|---|
| Altura significativa combinada | marine.hourly.wave_height | m; não altura da onda quebrando |
| Direção combinada | wave_direction | de onde vem, graus + rosa dos ventos |
| Período combinado | wave_period | s; distinto do pico |
| Período de pico combinado | wave_peak_period | s; disponível conforme modelo |
| Altura/direção/período de swell | swell_wave_height/direction/period | componente separado |
| Período de pico do swell | swell_wave_peak_period | s; ausente não vira período médio |
| Mar de vento | wind_wave_height/direction/period/peak_period | componente separado |
| Temperatura superficial da água | sea_surface_temperature | °C |
| Vento a 10 m | weather.hourly.wind_speed_10m | nós e km/h |
| Rajadas a 10 m | wind_gusts_10m | máximo da hora precedente, nós |
| Direção do vento | wind_direction_10m | de onde vem, graus + rosa dos ventos |
| Temperatura do ar | temperature_2m | °C |
| UV | uv_index | índice horário, sem unidade |
| Chance de chuva / precipitação | precipitation_probability / precipitation | % e mm |
| Visibilidade | visibility | API em m, tela em km |
| Luz do dia | daily.sunrise / sunset | horários locais, não duração de sol |

Conversões: nós = km/h ÷ 1,852; quilômetros = metros ÷ 1.000. Não há cálculo
inventado de velocidade de propagação das ondas. Vento não é velocidade da onda.
Valores null, ausentes ou não numéricos são mostrados como “—”, nunca como zero.
Zero legítimo é preservado.

## Prioridade esportiva e limites

Surf é a visualização inicial: altura, período e direção, depois swell, mar de
vento e vento. Os modos windsurf/kitesurf explicam a leitura com foco em vento,
rajadas e estado do mar. São agrupamentos editoriais dos dados, não classificações
validadas de qualidade ou segurança. Não há estrelas, notas de “surf bom”,
recomendação de equipamento, tamanho de kite ou limite universal de vento.

A altura significativa não é uma medição de cada onda nem da quebra específica.
A página não estima bancos de areia, batimetria local, abrigo, correntes de
retorno, qualidade da água ou permissões de uso. Também não classifica vento como
onshore/offshore com uma orientação de praia presumida.

A margem de aproximação costeira é importante: o ponto solicitado para Netanya
é 32.3215 N,34.8532 E, e `cell_selection=sea` escolhe uma célula marítima próxima.
A página mostra a coordenada efetivamente retornada separada da solicitada.
Não transforma essa célula em um spot específico com condições observadas.

Como referências externas complementares, a página oferece o
[Serviço Meteorológico de Israel](https://ims.gov.il/en) e as páginas RNLI de
[surf](https://rnli.org/safety/choose-your-activity/surfing),
[windsurf](https://rnli.org/safety/choose-your-activity/windsurfing) e
[kitesurf](https://rnli.org/safety/choose-your-activity/kitesurfing).
Essas páginas são indicadas como orientação externa; não foram usadas para
inventar regras locais ou uma autorização de entrada em praias de Netanya.
O conteúdo direto desses domínios não ficou acessível ao proxy durante a pesquisa;
a validação das definições meteorológicas foi feita na fonte oficial Open-Meteo.

## Horários e atualização

Tudo é localizado em Asia/Jerusalem, independentemente do fuso de quem acessa.
Dados horários são associados pela mesma hora local, sem pegar o primeiro item
da série como se fosse agora. A seleção usa o relógio atual no fuso de Netanya.
O intervalo de consulta é de 15 minutos; isso não implica modelo novo a cada 15
minutos. A interface distingue hora de validade e hora de obtenção. Não apresenta
horário de validade como se fosse horário de emissão do modelo.

As respostas ISO locais não incluem offset por amostra. Na hora repetida durante
a transição de horário de verão, a associação pela hora local não distingue as
duas ocorrências; não se deve usar esta interface como ferramenta de navegação
com exigência de precisão temporal nessa transição.

Em falha de um serviço, os campos esportivos desse serviço são apagados e
identificados como indisponíveis. A resposta independente pode continuar visível.
A tela não usa fixtures ou números armazenados como fallback em produção.

## Validação desta revisão

O teste automatizado `tests/surf-smoke.cjs` usa fixtures explicitamente sintéticas
para conferir conversões, null/zero, períodos médio/pico, vento, horário de Netanya
em navegador com fuso americano, 24/48 h, modos esportivos, idiomas, falhas
independentes, limpeza de valores antigos e ausência de overflow móvel.

Depois dos bloqueios iniciais do proxy, uma nova requisição marítima respondeu
com HTTP 200. Em seguida, o Chromium carregou as duas requisições completas reais
com HTTP 200 e exibiu dados de mar e clima sem exceções JavaScript. O relatório
com data/hora e URLs está em `verification/surf-live.json`. Não é um cache usado
pelo aplicativo e não promete disponibilidade futura das APIs.

Naquele ensaio, foram retornadas coordenadas diferentes para mar e clima, que a
tela mostrou separadamente. Foram conferidos também HE/EN e largura móvel de
390 px. Os números pontuais registrados são evidência do ensaio, não uma previsão
permanente que deva ser copiada para a interface.

Nenhuma dessas verificações comprova segurança para entrar no mar ou que a onda
quebra com a altura indicada em um determinado banco de areia.
