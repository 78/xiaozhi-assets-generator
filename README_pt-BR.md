# Aplicativo de página única com recursos personalizados de IA Xiaozhi

## Finalidade da Aplicação

A caixa de diálogo de voz com IA Xiaozhi permite que os usuários personalizem temas (incluindo modelos de palavras de
ativação, emojis, fontes de texto e planos de fundo de bate-papo), além de gerar e exportar arquivos assets.bin online.

## Design Funcional

Os usuários precisam personalizar um arquivo assets.bin, o que envolve 3 etapas.
Passo 1: Selecione o modelo do chip, o tipo de tela e a resolução.

- Etapa 2: Design do tema (Use várias abas para configurar diferentes itens separadamente)
- Etapa 3: Lista de conteúdo a ser embalado e o botão "Gerar"

## Funcionalidade detalhada da página

### Selecione o modelo do chip, o tipo de tela e a resolução

Aqui estão algumas opções comuns de configuração de seleção rápida da placa, como:

- LCSC ESP32-S3 Edição Prática, configurada com ESP32S3, LCD 320x240, RGB 565
- ESP-BOX-3, configurado com ESP32S3, LCD 320x240, RGB565
- Wuming Technology Star Intelligence 1.54 TFT, configurado com ESP32S3, LCD 240x240, RGB 565
- Surfer C3 1.14 TFT, configurado com ESP32C3, LCD 240x135, RGB565

Você também pode personalizar o chip (ESP32S3, ESP32C3, ESP32P4 e ESP32C6 são opções disponíveis), personalizar a
resolução e, atualmente, suporta apenas cores RGB565 de 16 bits.

### Design do Tema

#### Aba 1: Configuração da palavra de ativação

Atualmente, dois métodos de configuração de palavra de ativação são suportados: **palavra de ativação predefinida** e *
*palavra de ativação personalizada**.

##### 1. Palavras de ativação predefinidas (WakeNet)

Para os chips C3/C6, apenas o modelo de palavra de ativação WakeNet9 é suportado. Para os chips S3/P4, apenas o modelo
de palavra de ativação WakeNet9 é suportado.

Segue abaixo uma lista de predefinições comumente usadas:

| Palavra de ativação | WakeNet9s (C3/C6) |     WakeNet9 (S3/P4)      |
|:--------------------|:-----------------:|:-------------------------:|
| Olá, 乐鑫             |   wn9s_hilexin    |        wn9_hilexin        |
 Olá, ESP            |    wn9s_hiesp     |         wn9_hiesp         |
| Olá Xiaozhi         | wn9s_nihaoxiaozhi |   wn9_nihaoxiaozhi_tts    |
 Olá, Jason          | wn9s_hijason_tts2 |     wn9_hijason_tts2      |
| Xiao Ai Tongxue     |         -         |     wn9_xiaoaitongxue     |
| Olá Xiao Ou         |         -         |   wn9_hai1xiao3ou1_tts3   |
| Olá Xiaorui         |         -         | wn9_ni3hao3xiao3rui4_tts3 |

Consulte o arquivo `spiffs_assets/pack_model.py` para obter a palavra-chave e empacote o diretório do modelo
correspondente em `share/wakenet_model` no arquivo srmodels.bin.

##### 2. Palavra de ativação personalizada (MultiNet)

Atualmente, apenas o chip **ESP32-S3** suporta palavras de ativação personalizadas. Os usuários podem inserir palavras
de comando personalizadas em chinês ou inglês:

- **Suporte para chinês:** Usando o modelo `mn6_cn` ou `mn7_cn`, a entrada em pinyin é suportada (por exemplo,
  `ni hao xiao zhi`).
- **Suporte para inglês:** Suporta palavras em inglês puro usando o modelo `mn6_en` ou `mn7_en`.
- **Parâmetros de configuração**: Limiar personalizável (Limiar, 0-100) e tempo limite (Duração).

O recurso de palavra de ativação personalizada gera uma configuração MultiNet com base na palavra de comando definida
pelo usuário e a inclui no arquivo assets.bin.

#### Aba 2: Configuração de fontes

Os usuários podem escolher fontes predefinidas (localizadas no diretório `share/fonts`), eliminando a necessidade de
criar fontes do zero. As fontes mais usadas incluem:

- font_puhui_14_1: Fonte Puhui da Alibaba, abrangendo 7000 caracteres de uso comum, tamanho da fonte 14px, bpp1
- font_puhui_16_4: Fonte Puhui da Alibaba, abrangendo 7000 caracteres de uso comum, tamanho da fonte 16px, bpp4
- font_puhui_20_4: Fonte Puhui da Alibaba, abrangendo 7000 caracteres de uso comum, tamanho da fonte 20px, bpp4
- font_puhui_30_4: Fonte Puhui da Alibaba, abrangendo 7000 caracteres de uso comum, tamanho da fonte 30px, bpp4

Os usuários também podem fazer upload de fontes personalizadas:
Você precisa selecionar um arquivo de fonte local. Atualmente, os formatos TTF e WOFF são suportados.

- Selecione o tamanho da fonte (o intervalo é limitado a 8-80, sendo os mais comuns 14, 16, 20 e 30), selecione bpp (o
  intervalo é 1, 2, 4).
- Selecione o conjunto de caracteres (GB2312 7445 caracteres, DeepSeek R1 7405 caracteres). O DeepSeek R1 é selecionado
  por padrão.

As fontes personalizadas podem ser convertidas de `lv_font_conv/lib/convert.js` para o formato cbin. O arquivo
convertido deve ser nomeado font_[nome da fonte]_[tamanho da fonte]_[BPP].bin

### Aba 3: Coleção de Emojis

Um conjunto comum de emojis contém 21 imagens, uma das quais é o emoji neutro padrão, e as restantes são emojis que
expressam diferentes emoções.
Os emojis correspondentes às diferentes expressões são os seguintes:

| 😶 | neutro |
| 🙂 | feliz |
| 😆 | rindo |
| 😂 | engraçado |
| 😔 | triste |
| 😠 | com raiva |
| 😭 | chorando |
| 😍 | amando |
| 😳 | envergonhado |
| 😯 | surpreso |
| 😱 | chocado |
| 🤔 | pensando |
| 😉 | piscando |
| 😎 | Legal |
| 😌 | relaxado |
| 🤤 | delicioso |
| 😘 | beijinho |
| 😏 | confiante |
| 😴 | sonolento |
| 😜 | bobinho |
| 🙄 | confuso |

Os usuários podem selecionar pacotes de emojis predefinidos. Os pacotes de emojis predefinidos incluem:

- Twemoji 32x32 PNG (localizado em `share/twemoji32`)
- Twemoji 64x64 PNG (localizado em `share/twemoji64`)

Os usuários também podem personalizar seus próprios emoticons:

- É necessário definir um tamanho de imagem uniforme (largura x altura), que não pode exceder a resolução da tela.
- Escolha entre o formato GIF animado ou a imagem estática com fundo transparente (PNG).
- Você deve fornecer uma imagem padrão como emoji neutro (o tamanho será ajustado automaticamente para largura x
  altura).
- Os demais emojis são opcionais. Caso o usuário não modifique as imagens dos outros emojis, o emoji neutro será usado
  por padrão.

### Aba 4: Plano de fundo do bate-papo

O plano de fundo oferece duas opções de configuração: modo claro e modo escuro. O modo claro é o padrão.

- O modo claro padrão é #ffffff e o modo escuro padrão é #121212

Os usuários podem alterar a cor padrão ou adicionar uma imagem estática como plano de fundo.
Uma imagem estática pode ser composta por duas imagens diferentes ou pode ser configurada como uma única imagem.
A imagem de fundo adapta-se automaticamente à resolução da tela e geralmente é um bitmap no formato RGB565 com um
cabeçalho de 64 bytes contendo o valor lv_image_dsc_t.

### Gerar assets.bin

Durante o processo de criação do tema, os usuários podem clicar no botão "Gerar" no canto superior direito a qualquer
momento para exibir a lista de recursos a serem incluídos em um pacote, em uma janela pop-up.
Após o usuário clicar em "OK", o processo se inicia e aguarda a geração da fonte. Se o usuário tiver personalizado o
arquivo de fonte, o processo de criação da fonte levará mais tempo. O resultado da criação pode ser armazenado em cache
e regenerado mais rapidamente.

Agora é possível gerar o arquivo assets.bin localmente no navegador, sem a necessidade de uma API de backend.

## Implementação Técnica

### Gerando assets.bin no navegador

O projeto agora utiliza uma solução de geração nativa totalmente baseada em navegador:

1. **WakenetModelPacker.js** - Imita a funcionalidade de `pack_model.py`, empacotando o modelo de palavra-chave de
   ativação em srmodels.bin no lado do navegador.
2. **SpiffsGenerator.js** - Imita a funcionalidade de `spiffs_assets_gen.py` para gerar o arquivo assets.bin final.
3. **AssetsBuilder.js** - Coordena vários módulos, imitando o processo de gerenciamento de recursos do `build.py`.

### Processo de Geração

1. Carregar configuração do usuário
2. Processar arquivos de fonte (converter fontes predefinidas ou fontes personalizadas)
3. Gerenciamento de modelos de palavra-chave de ativação:
   - **Modo predefinido**: Carregue o modelo correspondente de `public/static/wakenet_model/` e empacote-o.
   - **Modo Personalizado**: Carrega o modelo MultiNet de `public/static/multinet_model/` e gera a configuração com base
     em palavras de comando definidas pelo usuário.
4. Processar imagens de emoticons (predefinidas ou personalizadas)
5. Processe a imagem de fundo e converta-a para o formato RGB565.
6. Gere o arquivo de índice index.json.
7. Empacote todos os arquivos em assets.bin usando o formato SPIFFS.

### Estrutura do Arquivo de Recursos

O arquivo assets.bin gerado contém um arquivo de índice chamado index.json, cujo conteúdo é aproximadamente o seguinte:

Exemplo 1:
```json
{
    "version": 1,
    "chip_model": "esp32s3",
    "display_config": {
        "width": 320,
        "height": 240,
        "monochrome": false,
        "color": "RGB565"
    },
    "srmodels": "srmodels.bin",
    "text_font": "font_puhui_common_30_4.bin",
    "skin": {
        "light": {
            "text_color": "#000000",
            "background_color": "#FFFFFF",
            "background_image": "background_light.raw"
        },
        "dark": {
            "text_color": "#FFFFFF",
            "background_color": "#121212",
            "background_image": "background_dark.raw"
        }
    },
    "emoji_collection": [
        {
            "name": "sonolento",
            "file": "sleepy.png"
        },
        ...
    ],
    "multinet": {
        "model": "mn6_cn",
        "command": "ni hao xiao zhi",
        "threshold": 20,
        "duration": 3000
    }
}
```

Exemplo 2:
```json
{
    "version": 1,
    "chip_model": "esp32c3",
    "display_config": {
        "width": 240,
        "height": 240,
        "monochrome": false,
        "color": "RGB565"
    },
    "srmodels": "srmodels.bin",
    "text_font": "font_puhui_common_16_4.bin",
    "skin": {
        "light": {
            "text_color": "#000000",
            "background_color": "#FFFFFF",
        },
        "dark": {
            "text_color": "#FFFFFF",
            "background_color": "#121212"
        }
    },
    "emoji_collection": [
        {
            "name": "sonolento",
            "file": "sleepy.png"
        },
        ...
    ]
}
```
```
