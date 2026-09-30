# Site TMS Advogados Associados — como publicar

O site fica na pasta `site/`. É HTML/CSS/JS puro: não precisa de build, banco de dados nem servidor próprio.

## 1. Antes de publicar (5 minutos)

Edite **`site/assets/js/config.js`**. É o único arquivo com dados do escritório:

| Campo | O que colocar |
|---|---|
| `whatsapp`, `whatsappExibicao`, `email`, `horario` | Contato. Recomendo e-mail no domínio próprio. |
| `cnpj`, `registroSociedadeOAB` | Registro da sociedade. Vazio = não aparece. |
| `socios[].oab` | OAB do Dr. Edmar (hoje vazio, então não aparece). |
| `experiencia` | "Mais de 20 anos". Deixe `''` se não puder comprovar (Provimento 205/2021). |
| `parceiroEUA` | Nome do escritório parceiro licenciado nos EUA, se houver. |
| `formEndpoint` | Opcional: URL do Formspree para receber o formulário também por e-mail. |

Depois troque **`SEU-DOMINIO.com.br`** pelo domínio real em `site/index.html`, `site/robots.txt` e `site/sitemap.xml`.

### Fotos (opcionais, aparecem sozinhas quando o arquivo existe)
- `site/assets/img/equipe/danilo.jpg` e `edmar.jpg` (retrato 4:5). Sem foto, aparece o monograma.
- `site/assets/img/cidades/lisboa.jpg`, `madri.jpg`, `dublin.jpg`, `nova-york.jpg` (4:3).
- `site/assets/img/aeroporto.jpg` (1920x1080).

Use só imagens com licença (ex.: Adobe Stock).

## 2. Publicar

**Opção A — GitHub Pages (grátis):** faça o merge deste branch em `main`. Em *Settings → Pages*, escolha *Source: GitHub Actions*. O workflow `.github/workflows/pages.yml` publica a pasta `site/` a cada alteração. Para domínio próprio, informe o domínio em *Settings → Pages → Custom domain* e crie o registro CNAME no seu provedor de DNS.

**Opção B — Netlify (grátis, mais simples):** em app.netlify.com, *Add new site → Import from GitHub*, escolha este repositório. O `netlify.toml` já aponta para `site/`. Ou arraste a pasta `site/` para app.netlify.com/drop.

**Opção C — Hospedagem comum (Hostinger, Locaweb etc.):** envie o conteúdo da pasta `site/` para `public_html` via FTP.

## 3. Depois de publicar
- Cadastre o domínio no Google Search Console e envie `sitemap.xml`.
- Crie/atualize o Perfil da Empresa no Google com o mesmo endereço e telefone do site.
- Teste o formulário pelo celular.

## Testar no computador
```
npx http-server site -p 8080
```
e abra http://localhost:8080.
