# FitMind

Site para encontrar psicólogos com CRP verificado e agendar sessões online ou presenciais.

## Como abrir

Dê dois cliques em `index.html`. Não precisa instalar nada: é HTML, CSS e JavaScript puros, sem etapa de build.

Para publicar, basta subir a pasta inteira em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages).

## Estrutura

```
index.html            casca da página (cabeçalho, rodapé, abas do celular)
css/styles.css        todo o visual: tokens de cor/tipografia, componentes e páginas
js/config.js          configurações (modo demonstração, regras de cancelamento)
js/data.js            catálogo: temas, abordagens, psicólogos, dúvidas frequentes
js/ui.js              utilitários: ícones, datas, dinheiro, toast, arquivo .ics
js/store.js           "API" local: contas, favoritos, agenda e consultas (localStorage)
js/components.js      peças reutilizadas (card de psicólogo, chips, estados vazios)
js/app.js             roteador (#/rota), cabeçalho, rodapé e barra de abas
js/pages/*.js         uma página por arquivo
```

Rotas: `#/` início, `#/buscar`, `#/psicologo/:id`, `#/agendar/:id`, `#/confirmado/:id`, `#/entrar`, `#/consultas`, `#/conta`, `#/para-psicologos`, `#/termos`, `#/privacidade`.

## Antes de ir ao ar

O site funciona de ponta a ponta, mas hoje tudo fica salvo só no navegador de quem usa. Para receber clientes de verdade:

1. **Backend**: trocar o corpo das funções de `js/store.js` por chamadas a um servidor (Supabase ou Firebase são os caminhos mais rápidos). As páginas não precisam mudar.
2. **Login de verdade**: senhas e sessões no servidor, recuperação de senha por e-mail.
3. **Perfis reais**: substituir os psicólogos fictícios de `js/data.js` e desligar `demo` em `js/config.js`.
4. **Pagamento**: integrar Pix e cartão (Mercado Pago, Stripe ou Asaas).
5. **Videochamada**: integrar um serviço de vídeo (Daily, Whereby, Jitsi) no botão "Entrar na sessão".
6. **Jurídico**: termos de uso e política de privacidade revisados (LGPD, dados de saúde são sensíveis) e regras do CFP para atendimento online.

## Versão mobile

O layout já é pensado para celular (barra de abas, folha de filtros, botão fixo de agendar) e pode ser instalado como app pela tela inicial (`manifest.webmanifest`). Para publicar nas lojas, o caminho mais curto é empacotar este mesmo site com Capacitor; requer Node.js instalado.
