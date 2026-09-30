# Site TMS Advogados Associados: como publicar

O site fica na pasta `site/`. É HTML/CSS/JS puro: não precisa de build, banco de dados nem servidor próprio.

## 1. Antes de publicar (5 minutos)

Edite **`site/assets/js/config.js`**. É o único arquivo com dados do escritório:

| Campo | O que colocar |
|---|---|
| `whatsapp`, `whatsappExibicao`, `email`, `horario` | Contato. Recomendo e-mail no domínio próprio. |
| `cnpj`, `registroSociedadeOAB` | Registro da sociedade. Vazio = não aparece. |
| `experiencia` | "Mais de 20 anos". Deixe `''` se não puder comprovar (Provimento 205/2021). |
| `parceiroEUA` | Nome do escritório parceiro licenciado nos EUA, se houver. |
| `whatsappMensagem` | Mensagem que já chega escrita no WhatsApp Business. |

Depois troque **`SEU-DOMINIO.com.br`** pelo domínio real em `site/index.html`, `site/robots.txt` e `site/sitemap.xml`.

### Fotos (aparecem sozinhas quando o arquivo existe)
- Cidades: `site/assets/img/cidades/` (lisboa-1 a 3, madri-1 a 3, dublin-1 a 3, nova-york-1 a 3).
- Tour "Como fazemos": `site/assets/img/tour/` (1-conversa a 5-chegada).
- Lista completa, onde baixar e termos de busca: `docs/FOTOS-PARA-ENVIAR.md`.

## 2. Publicar

**Opção A: GitHub Pages (grátis):** faça o merge deste branch em `main`. Em *Settings → Pages*, escolha *Source: GitHub Actions*. O workflow `.github/workflows/pages.yml` publica a pasta `site/` a cada alteração. Para domínio próprio, informe o domínio em *Settings → Pages → Custom domain* e crie o registro CNAME no seu provedor de DNS.

**Opção B: Netlify (grátis, mais simples):** em app.netlify.com, *Add new site → Import from GitHub*, escolha este repositório. O `netlify.toml` já aponta para `site/`. Ou arraste a pasta `site/` para app.netlify.com/drop.

**Opção C: Hospedagem comum (Hostinger, Locaweb etc.):** envie o conteúdo da pasta `site/` para `public_html` via FTP.

## 3. Depois de publicar
- Cadastre o domínio no Google Search Console e envie `sitemap.xml`.
- Crie/atualize o Perfil da Empresa no Google com o mesmo endereço e telefone do site.
- Teste o botão do WhatsApp pelo celular e confirme que abre o WhatsApp Business do escritório.

## Testar no computador
```
npx http-server site -p 8080
```
e abra http://localhost:8080.
