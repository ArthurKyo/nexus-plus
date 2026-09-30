import { state } from "../services/state";
import { StorageService } from "../storage/storageService";
import { pageHeader } from "../components/ui";
import { icon, date } from "../utils/html";
import { brand } from "./landing";
import type { ColorMode } from "../types";
export function getMode(): ColorMode {
  return StorageService.get<ColorMode>("color-mode", "system");
}
export function applyTheme(mode: ColorMode = getMode()): void {
  const dark =
    mode === "dark" ||
    (mode === "system" && matchMedia("(prefers-color-scheme:dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.documentElement.setAttribute(
    "data-bs-theme",
    dark ? "dark" : "light",
  );
}
export function changeMode(mode: ColorMode): void {
  StorageService.set("color-mode", mode);
  applyTheme(mode);
}
export function settings(): string {
  const mode = getMode();
  return `${pageHeader("Seu espaço, suas preferências.", "Ajuste a experiência para trabalhar do seu jeito.")}<section class="card-box" style="max-width:850px"><div class="settings-group"><h3>Aparência</h3><p>Escolha como a nexus+ aparece para você.</p><div class="mode-options">${[
    ["light", "sun", "Claro"],
    ["dark", "moon", "Escuro"],
    ["system", "display", "Usar tema do dispositivo"],
  ]
    .map(
      ([v, ic, label]) =>
        `<button class="btn" data-color-mode="${v}" aria-pressed="${mode === v}">${icon(ic)}${label}</button>`,
    )
    .join(
      "",
    )}</div></div><div class="settings-group"><h3>Seu ritmo de navegação</h3><p>Prefere uma experiência mais tranquila? Pause os efeitos. A preferência de reduzir movimentos do seu dispositivo é sempre respeitada.</p><button class="motion-toggle" data-motion-toggle aria-pressed="false">${icon("pause-circle")}<span>Pausar efeitos</span></button><button class="btn ms-2" data-open-guide>Conhecer meu guia</button></div><div class="settings-group"><h3>Sempre por perto</h3><p>Instale a nexus+ para acessar pelo celular ou computador. Após o primeiro acesso à versão de produção, as principais telas ficam disponíveis offline.</p><button class="btn" data-action="install">${icon("download")} Instalar aplicativo</button><div id="install-help" class="small mt-3" aria-live="polite"></div></div><div class="settings-group"><h3>Privacidade e seus dados</h3><p>Seus dados ficam neste navegador. Você decide quando exportar ou apagar.</p><a class="btn" href="#/privacidade">${icon("shield-check")} Gerenciar meus dados</a></div><div class="settings-group"><h3>Explore sem alterar seu negócio</h3><p>A demonstração usa um espaço separado, com uma barbearia fictícia.</p><button class="btn" data-action="demo">${icon("play-circle")} Explorar demonstração</button></div><div class="settings-group"><h3>Sobre a nexus+</h3><p>Tecnologia e Sociedade · Atividades Práticas Interdisciplinares de Extensão I.<br>Versão 1.0 · Transformando pequenos negócios através da presença digital.</p><a href="/equipe.html">Conheça a equipe do projeto</a></div></section>`;
}
export function privacy(): string {
  const s = state();
  return `${pageHeader("Privacidade e seus dados.", "Informação clara para você decidir com tranquilidade.")}<div class="grid-2"><section class="card-box"><h3>O que fica guardado?</h3><p>Informações comerciais que você preenche, imagens, catálogo, respostas do diagnóstico, progresso de aprendizado e registros locais de cliques. Também guardamos a preferência de aparência e o consentimento.</p><h3 class="mt-4">Onde ficam os dados?</h3><p>Neste navegador, usando o armazenamento do dispositivo. A nexus+ não possui conta online, banco de dados remoto nem sincronização entre aparelhos nesta versão.</p><h3 class="mt-4">O que é compartilhado?</h3><p>Ao exportar a página ou o cartão, os dados comerciais e imagens incluídos passam a fazer parte do arquivo. Você decide a quem enviar ou onde hospedar. Links para WhatsApp, redes sociais e mapas abrem serviços externos, sujeitos às próprias políticas.</p><h3 class="mt-4">Seus cuidados também importam</h3><p>Não preencha CPF, RG, senhas ou dados privados de clientes. Use contatos comerciais. Quem tem acesso a este perfil do navegador pode ver os dados salvos. Limpar os dados do navegador pode removê-los.</p><h3 class="mt-4">Termo simples · versão 1.0</h3><p>Ao concordar, você autoriza o armazenamento local dos dados que fornecer para diagnóstico, criação de materiais e acompanhamento da intervenção. A participação é voluntária. Você pode retirar essa autorização e apagar os dados nesta tela.</p><p class="small">A equipe responsável deve informar seus contatos e combinar separadamente o uso de relatos, fotos ou resultados em pesquisas e relatórios. Este aplicativo não substitui essa autorização.</p></section><div class="stack" style="align-self:start"><section class="card-box"><h3>Seu consentimento</h3><span class="badge-soft ${s.consent?.accepted ? "badge-green" : ""}">${s.consent?.accepted ? "Autorizado em " + date(s.consent.date) : "Ainda não autorizado"}</span><p class="small mt-3">${s.demo ? "Este é o espaço de demonstração, com dados fictícios." : "O consentimento se aplica apenas a esta instalação."}</p>${!s.consent?.accepted ? '<button class="btn btn-primary" data-action="privacy-consent">Concordar com o armazenamento</button>' : ""}</section><section class="card-box"><h3>Seus dados, sob seu controle</h3><p class="small">Exporte um arquivo JSON como registro. Ele pode conter contatos e imagens: guarde em local seguro. A importação desse arquivo não está disponível nesta versão.</p><div class="privacy-actions"><button class="btn" data-action="export-data">${icon("download")} Exportar meus dados</button></div></section><section class="card-box"><h3>Encerrar e apagar</h3><p class="small">Apaga os dados reais e de demonstração da nexus+ neste navegador e retira o consentimento. Arquivos que você baixou ou publicou não são apagados.</p><button class="btn btn-danger" data-action="erase-data">${icon("trash3")} Apagar meus dados</button></section></div></div>`;
}
export function standalonePrivacy(): string {
  return `<header class="onboarding-header"><a href="#/" aria-label="nexus+ início">${brand}</a><a href="#/" class="btn">Voltar ao início</a></header><main id="main" class="workspace-main">${privacy()}</main>`;
}
