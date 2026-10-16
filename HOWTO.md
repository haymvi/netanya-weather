# Netanya Weather — da página de clima ao chaveiro QR

**Estado: desenvolvimento e teste físico em andamento.** A impressão relatada
pelo usuário saiu inteiramente branca. Os comandos de troca presentes nos
arquivos não comprovaram ativação do IFS. Nenhum G-code desta documentação deve
ser tratado como versão multicolorida final validada.

## Fontes e autoria

- [Histórico do ChatGPT fornecido pelo usuário](docs/chat-history.md): decisões
  e implementação anteriores; algumas pendências foram superadas depois.
- [Registro técnico completo do Codex](docs/CODEX-HISTORICO.md): ferramentas,
  resultados, erros, revisões e pendências desta sessão.
- [Guia público em hebraico e inglês](howto.html).
- [Instruções técnicas de reprodução do fatiamento](fabrication/README.md).

O usuário confirmou que o ChatGPT criou o modelo original em outra conversa.
O Codex recebeu esse modelo, fez inspeção, fatiamento e revisões posteriores.
As etapas antigas não foram reexecutadas só por estarem descritas no histórico.

## 1. Criar a página meteorológica

A arquitetura é navegador → arquivos estáticos GitHub Pages → APIs Open-Meteo →
JSON → cartões e gráficos. Não há backend, conta de usuário ou chave API no
código atual. O dashboard permanece em `index.html`; a documentação não o substitui. A revisão
esportiva também carrega `sports.js` e `sports.css`; publique esses arquivos junto
com o HTML. Não há framework ou instalação de pacotes para executar o site.

O outro chat relata uma primeira versão em português e depois a versão HE/EN.
O checkout inspecionado contém a versão HE/EN; a cópia portuguesa e o ZIP antigo
citados naquele histórico não foram fornecidos nesta etapa.

Para reproduzir as funcionalidades originais, implemente no HTML:

1. Localização fixa 32.3215,34.8532, timezone Asia/Jerusalem.
2. Cartões atuais, SVG de temperatura/chuva com seleção 12/24h e cinco dias.
3. Consulta forecast com os conjuntos current/hourly/daily e consulta marine
   separada. Os parâmetros exatos auditados estão no registro do Codex, seção 3.
4. Estados de carregamento/erro, timeout de 14 s, atualização a cada 900.000 ms
   e trava para evitar requisições simultâneas duplicadas.
5. Hebraico padrão RTL, inglês LTR, preferência localStorage e query `?lang=`.
6. Tradução dos textos, descrições do tempo, gráficos e rótulos acessíveis.
7. Créditos Open-Meteo e explicação de que se trata de previsão de modelo.

A API deve ser testada de verdade. Testar com fixtures ou bloquear a rede para
ensaiar erros não comprova atualização real. As condições marítimas não devem
ser usadas como autorização de segurança para banho ou navegação.

### Revisão com foco em surf, windsurf e kitesurf

A tela inicial prioriza altura, direção e período de ondas, componentes de swell
e mar de vento, vento/rajadas em nós e temperatura da água. Há previsão horária
24/48 h, UV, chuva, visibilidade e horários de nascer/pôr do sol. O clima geral
permanece disponível em seção expansível. Interface HE/EN, referências por campo,
links às requisições reais e coordenadas de grade retornadas estão implementados.

[Metodologia, campos e fontes auditadas](docs/SURF-SOURCES.md). Não há notas de
surf, altura de quebra inventada, classificação onshore/offshore sem orientação
local ou garantia de segurança. Vento e mar podem falhar independentemente;
os campos esportivos do serviço com falha são limpos.

Uma validação local em Chromium recebeu HTTP 200 das duas APIs e exibiu dados
reais, sem exceções JavaScript. O [relatório](verification/surf-live.json) guarda
as URLs e o horário daquele ensaio; não é usado como cache pela aplicação.
Isso não comprova implantação nem disponibilidade futura do GitHub Pages.

## 2. Publicar no GitHub Pages

No GitHub, use `haymvi/netanya-weather`. Para uma implantação nova: adicione os
arquivos na raiz, commit em main, Settings → Pages → Deploy from a branch → main
→ /(root) → Save. Se já houver workflow de Pages via Actions, mantenha o fluxo
existente. Aguarde a implantação terminar e abra a URL informada pelo GitHub.

A URL codificada no modelo recebido é:
https://haymvi.github.io/netanya-weather/

O fato de o QR conter essa URL não prova que ela está publicada ou funcionando
hoje. Confirme página, idiomas, APIs e downloads no endereço público. Não renomeie
o repositório ou o caminho sem considerar os chaveiros já impressos.

## 3. QR e modelo

Para um modelo novo, gere a matriz real do QR a partir da URL pública validada,
use preto sobre branco, preserve quatro módulos de quiet zone e confira leitura
antes de modelar. Não desenhe módulos aproximados e não use textura como
substituto de geometria 3D. O nível Q/H foi uma recomendação anterior, não um
parâmetro confirmado do arquivo recebido.

Para reproduzir o trabalho existente, use o 3MF original incluído. A projeção
real dele foi decodificada para a URL correta; seu histórico CAD anterior não
está disponível integralmente neste checkout.

| Versão | Corpo / altura com olhal | Branco + preto | Furo | Margem lateral |
|---|---|---|---|---|
| Proposta antiga do chat | Dimensões ainda sugeridas | 1,0 + 1,2 mm | ~5 mm sugeridos | ≥4 módulos pretendidos |
| 3MF original recebido | 48 / 60,9 mm | 1,2 + 1,0 mm | 6 mm | 6,57 mm |
| Teste 2+2 | 48 / 60,9 mm | 0,4 + 0,4 mm | 6 mm | 6,57 mm |
| Teste 2+2 reduzido | 41,43 / 47,88 mm | 0,4 + 0,4 mm | 3 mm | 3,285 mm |

O último teste reduz o olhal inteiro em 50% e mantém o QR em XY. A margem
3,285 mm foi escolhida explicitamente pelo usuário após o alerta de ficar abaixo
da quiet zone recomendada. Isso é um teste, não validação de leitura nem escolha
final de resistência mecânica.

## 4. Fatiamento AD5X

Confirme o bico real: nesta sessão o usuário confirmou 0,4 mm. Branco no canal
físico 1 e preto no 2. Foram usados perfis oficiais Flashforge AD5X/PLA Basic,
resolvidos em JSON, com execução do OrcaSlicer 2.3.1 Linux. O executável não era
Orca-Flashforge; essa diferença é relevante para o fluxo de ativação IFS.

Para o original: 11 camadas a 0,20 mm, seis brancas e cinco pretas. Para os testes:
quatro camadas, duas brancas e duas pretas. Temperaturas selecionadas: 215 °C
inicial, 210 °C posterior, mesa PEI texturizada 60 °C. Sem suportes e com torre de
purga. A primeira camada foi corrigida do padrão 0,25 para 0,20 mm.

O perfil oficial de processo programa paredes externas 200, internas 300,
topo 200 e deslocamentos 500 mm/s. Os limites de fluxo, resfriamento, aceleração
e pequenos trajetos continuam valendo; não se trata de mover tudo a 600 mm/s.

O helper e os comandos completos estão em fabrication/README.md. Ele é
específico do original de 11 camadas; não aplica automaticamente os testes 2+2.
Os scripts de alteração dos testes estão preservados em fabrication/tests/.

## 5. Validar digitalmente e fisicamente

Confira a saída real e o status do fatiador, camadas, extrusão por ferramenta,
alturas, purga, aquecimento e desligamento. Decodifique uma imagem reconstruída
dos caminhos, registrando as limitações da simulação.

**Depois disso ainda é preciso testar o IFS real.** A impressão toda branca
mostrou que T0/T1 no arquivo não bastaram no fluxo utilizado. Ativação e
mapeamento podem ser parâmetros do trabalho separados do G-code. O relato
[OrcaSlicer #10783](https://github.com/OrcaSlicer/OrcaSlicer/issues/10783) descreve
essa limitação e iniciar pela tela com IFS habilitado como alternativa. Isso não
comprova qual foi a causa exata na máquina do usuário.

Não iniciar esperando troca automática se não houver como verificar o IFS e os
canais na tela. O ícone de documento indica ausência de miniatura reconhecida,
mas não informa sozinho o estado do IFS. Os primeiros arquivos não tinham miniatura. A revisão IFS V3 incluiu PNG e
metadados no início, e o usuário confirmou o reconhecimento da miniatura
preta/branca. Isso ainda não confirma a troca física.

Observe as duas camadas brancas e as duas pretas, espere esfriar e escaneie com
um celular. Depois confirme resistência e dimensões de uma versão definitiva.

## 6. Arquivos e versões

- [Kit completo](downloads/netanya-ad5x-kit.zip): histórico, original, perfis,
  scripts, G-codes e relatórios. Inclui testes e estado de validação.
- [Teste atual: 2+2, borda/olhal reduzidos](downloads/netanya-ad5x-test-reduced.zip).
- [Teste 2+2 sem redução XY](downloads/netanya-ad5x-test-2plus2.zip).
- [Original, velocidades oficiais](downloads/netanya-ad5x-official.zip).
- [Original, velocidades conservadoras](downloads/netanya-ad5x-conservative.zip).

Tempos estimados, não medidos: 30min24s original conservador; 13min17s original
oficial; 7min25s teste 2+2; 6min39s teste reduzido. A impressão branca foi
reportada antes do teste atual. O resultado do teste atual está pendente.

- [Revisão IFS V3](downloads/netanya-ad5x-ifs-v3.zip): reorganização de cabeçalho,
  miniatura reconhecida pelo usuário e emissor LAN com mapeamento explícito.
  O reconhecimento da miniatura não valida troca física; essa confirmação segue pendente.

## 7. Manutenção e publicação da documentação

O botão vermelho no final do dashboard abre `howto.html`, mantendo o idioma.
`how-it-was-made.html` é um endereço antigo de compatibilidade. HOWTO.md explica
a integração; docs/CODEX-HISTORICO.md contém os detalhes verificáveis desta etapa.

Para publicar, revise e envie index.html, howto.html, how-it-was-made.html,
HOWTO.md, sports.js, sports.css, docs/, fabrication/ e downloads/ no mesmo commit/fluxo de implantação.
Não envie só os dois HTML, pois as imagens e os downloads são arquivos reais
referenciados por eles. Verifique todas as URLs após a implantação.

Estado desta entrega: arquivos locais preparados; sem push ou novo deployment
confirmado. Não classificar o projeto como concluído enquanto faltarem teste
multicor, leitura física e verificação do site público com dados reais.

## Créditos

ChatGPT e Codex (OpenAI), com direção e testes físicos pelo usuário. GitHub Pages
(hospedagem), Open-Meteo (previsões), Flashforge (perfis), OrcaSlicer (fatiamento),
ZXing-C++ (decodificação) e Shapely (geometria do teste reduzido). Esses créditos
não representam homologação do arquivo pelo fabricante da impressora.
