# FOCUS® — Jiu-Jitsu

Site institucional + loja da academia **Focus Jiu-Jitsu**: one-page estática (HTML/CSS/JS puro, sem build) com carrinho e checkout via WhatsApp, agendamento de visita gratuita, grade horária e programas de treino.

## Stack

- HTML5 + CSS3 + JavaScript vanilla
- Fontes: Anton, Space Grotesk e IBM Plex Mono (Google Fonts)
- Fotos reais via Pexels + fotos de produto em `assets/img/`

## Rodar localmente

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Deploy no Vercel

O site é 100% estático — não há build step. O `vercel.json` já configura
`cleanUrls`, cache imutável para `/assets/*` e headers de segurança.

### Pelo dashboard

1. Em [vercel.com/new](https://vercel.com/new), importe este repositório do GitHub.
2. **Framework Preset:** `Other` (detecta como estático).
3. **Build Command:** *(vazio)* · **Output Directory:** *(vazio / raiz)*.
4. Clique em **Deploy**. Pronto — o `index.html` da raiz é servido automaticamente.

### Pela CLI

```bash
npx vercel link     # primeira vez
npx vercel --prod
```

## Estrutura

```
index.html            # página única
assets/css/style.css  # design system flat/editorial
assets/js/main.js     # loja, carrinho, filtros e agendamento
assets/img/           # fotos de produto e da academia
vercel.json           # headers, cache e clean URLs
```

## Personalização rápida

- **WhatsApp da loja/agendamento:** constante `WHATS` em `assets/js/main.js` e links `wa.me` no `index.html`.
- **Produtos/preços:** array `PRODUCTS` em `assets/js/main.js`.
- **Textos/endereço/horários:** direto no `index.html`.
