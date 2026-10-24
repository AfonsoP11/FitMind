/* Configuração global do FitMind.
   Antes de publicar: troque `demo` para false quando os perfis forem reais. */
window.FM = window.FM || {};

FM.config = {
  demo: true,
  storageKey: 'fitmind:v1',
  supportEmail: 'contato@fitmind.com.br',
  cancelFreeHours: 24,      // cancelamento sem custo até X horas antes
  joinWindowMinutes: 15,    // botão "Entrar na sessão" libera X min antes
  bookingDaysAhead: 30      // até quantos dias à frente dá para agendar
};
