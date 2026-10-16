# Netanya Weather — como construir a página e imprimir o chaveiro QR em duas cores

> **Procedimento de impressão bicolor confirmado fisicamente na Flashforge AD5X.**
> Etapa indispensável: após selecionar o G-code na impressora, **ativar Enable IFS** antes de iniciar.

**Guia ilustrado, responsivo, em hebraico e inglês:** [How it was made](howto.html)  
**Página meteorológica:** https://haymvi.github.io/netanya-weather/  
**Repositório:** https://github.com/haymvi/netanya-weather

## 1. Objetivo

Criar um dashboard meteorológico fixo para Netanya (Israel), hospedado gratuitamente no GitHub Pages, acessível pelo QR Code em relevo de um chaveiro impresso em PLA branco e preto. O QR codifica uma URL permanente; atualizar a página não exige imprimir outro chaveiro.

## 2. Construir a página HTML

A arquitetura é **GitHub Pages → HTML/CSS/JavaScript no navegador → APIs Open-Meteo → JSON → cartões e gráficos**. Não é necessário servidor próprio, instalação de pacotes ou chave API para a modalidade gratuita não comercial.

Arquivos publicados juntos na raiz:

- `index.html` — página inicial e clima geral.
- `sports.js` — surf, windsurf, kitesurf e apresentação das fontes.
- `sports.css` — estilos das seções esportivas.
- `howto.html` — este manual em hebraico e inglês.

Referências geográficas: **32.3215°N, 34.8532°E** para o tempo terrestre e **32.33°N, 34.80°E** para um ponto de modelo marítimo offshore. Fuso horário **Asia/Jerusalem**. Atualização periódica: 15 minutos.

As APIs utilizadas são:

- Meteorologia: [Open-Meteo Forecast](https://open-meteo.com/en/docs).
- Mar, ondas, swell e temperatura superficial prevista: [Open-Meteo Marine](https://open-meteo.com/en/docs/marine-weather-api).
- Referência instrumental externa: [ISRAMAR Hadera — temperatura](https://isramar.ocean.org.il/isramar2009/station/HaderaCTD.aspx) e [ondas/correntes](https://isramar.ocean.org.il/isramar2009/station/HaderaRDI.aspx).

A página deve distinguir **previsões de modelos** de **medições de sensores**. Dados indisponíveis não devem ser inventados. O hebraico é o idioma padrão (`lang=he`, `dir=rtl`) com seletor para inglês (`lang=en`, `dir=ltr`) e preferência no navegador.

## 3. Publicar no GitHub Pages

1. Criar conta no [GitHub](https://github.com) e repositório público `netanya-weather`.
2. No repositório vazio clicar em **uploading an existing file**; se já tiver conteúdo, em **Add file → Upload files**.
3. Enviar `index.html`, `sports.js`, `sports.css` e confirmar com **Commit changes**.
4. Em **Settings → Pages**, selecionar **Deploy from a branch → main → /(root) → Save**. Se o projeto já usa um workflow Actions, preservar sua configuração.
5. Esperar a implantação; abrir `https://USUARIO.github.io/netanya-weather/` no celular e testar.

No projeto atual a URL efetiva é **https://haymvi.github.io/netanya-weather/**. Essa é a URL que está dentro do QR Code.

## 4. Gerar QR Code e geometria 3D

1. Criar um QR Code **SVG** usando a URL pública exata.
2. Usar módulos pretos e base branca sem logotipo sobre o código. Reservar, idealmente, **quatro módulos de margem branca** ao redor.
3. Testar o SVG com a câmera antes de modelar.
4. Transformar o QR SVG em **geometria volumétrica** (ex.: via CAD), com os módulos pretos elevados sobre uma base branca. Adicionar uma alça/anel integrados à base.
5. Exportar componentes com XY alinhado ou gerar um STL com volumes distinguíveis por altura.

**Geometria nominal do teste bicolor:**

| Parte | Z nominal | Filamento |
|---|---:|---|
| Base e alça | 0–0,40 mm | 1: branco |
| Módulos elevados de QR | 0,40–0,80 mm | 2: preto |
| Altura do modelo | 0,80 mm | dois materiais |

A geometria de teste já utilizada tinha aproximadamente **41,43 mm de largura** e **47,88 mm de altura incluindo a alça**. A alça de 0,4 mm é delicada: validar resistência e considerar uma versão mais espessa para uso permanente. As medidas nominais não garantem um número exato de camadas; isso depende da configuração do slicer.

## 5. Montar o projeto no OrcaSlicer

1. Selecionar a impressora **Flashforge AD5X — bico 0.4 mm**.
2. Para reproduzir a peça, abrir o projeto `QR_4_CAMADAS.3mf` que já contém a atribuição dos dois materiais. Para novo modelo, importar os dois volumes alinhados ou pintar a faixa superior usando **Color Painting / Height Range**, conforme a geometria.
3. Configurar **Filamento 1: PLA branco** e **Filamento 2: PLA preto**.
4. Confirmar que o corpo/anel usam o filamento 1 e o QR usa o filamento 2.
5. Ajustar alturas de camada. Para duas camadas de 0,20 mm em branco e duas de 0,20 mm em preto, configurar **a primeira camada e as regulares em 0,20 mm**. Um preset de 0,16 mm pode gerar cinco camadas ou outra altura final.
6. Executar **Slice plate → Preview**, escolher visualização por **Filament** e verificar as regiões e a transição.

**Não basta colorir a visualização:** a atribuição precisa corresponder a dois materiais físicos e resultar em seleção real de ferramentas.

## 6. Salvar 3MF e exportar G-code

- **Save Project As → .3mf:** arquivo editável com objetos, materiais e parâmetros do slicer.
- **Export plate sliced file → .gcode:** instruções fatiadas para a impressora.

Conferir no G-code a presença de **`T0`** (primeiro filamento) e **`T1`** (segundo filamento) na transição prevista, bem como as alturas reais Z. O arquivo que foi utilizado no teste continha uma troca de ferramenta registrada e a executou corretamente quando o IFS foi ativado.

## 7. **Passo fundamental na Flashforge AD5X: Enable IFS**

1. Confirmar no IFS os filamentos físicos: **canal 1 = PLA branco**, **canal 2 = PLA preto**.
2. Enviar o **G-code** fatiado para a AD5X ou abrir o arquivo via USB.
3. **Após escolher o arquivo na tela da impressora, marcar `Enable IFS`.**
4. **Conferir que IFS está ligado antes de tocar em Print/Start.**
5. Iniciar a impressão e acompanhar a troca automática do branco para o preto.

A documentação da Flashforge informa que em **G-code** a correspondência dos canais IFS segue os números dos filamentos incluídos no arquivo. Para 3MF fatiado, há um fluxo de configuração de canais separado. O trabalho bicolor atual foi **efetivamente impresso com sucesso com IFS ligado**.

Fonte oficial: [Flashforge — Print via Orca-Flashforge](https://wiki.flashforge.com/en/ad5x/manual/print_via_orca_flashforge) e [Print G-code from printer memory](https://www.flashforge.com/pt/a/docs/ad5x/print-built-in-models-on-ad5x).

## 8. Controle de qualidade

1. Deixar esfriar e retirar cuidadosamente da mesa.
2. Verificar a base branca e os módulos pretos em relevo.
3. Escanear **o QR impresso de verdade** em um smartphone e confirmar que abre a URL correta.
4. Verificar a resistência do anel antes de usar no chaveiro.
5. Guardar juntos STL, projeto 3MF e G-code com a identificação do perfil AD5X e dos dois filamentos.

A troca física de cor foi confirmada. A legibilidade de cada exemplar impresso e a resistência da alça precisam ser verificadas em cada lote.

## 9. Manutenção do site

Editar os arquivos web, salvar commit no mesmo repositório e esperar a implantação de Pages. Manter a URL do QR **inalterada**. O mesmo chaveiro continua funcionando após atualizações de previsão, layout ou tradução.

---

**Créditos:** projeto e testes físicos conduzidos pelo usuário com colaboração de ChatGPT e Codex. APIs Open-Meteo e fontes instrumentais ISRAMAR; hospedagem GitHub Pages; modelagem/fatiamento OrcaSlicer e impressão Flashforge AD5X com IFS.
