/* Central JS for the updated site: payment flow, login, helpers and sensitivity generation */
const PAYMENT_URL = "https://pay.kiwify.com.br/Vk5yvhO"; // link da página de pagamento
const usuariosKey = "usuariosUnicos_v2";
const postPaymentRedirect = "sensibilidade.html";

document.addEventListener("DOMContentLoaded", () => {
  const btnCompra = document.getElementById("btnCompra");
  const btnConfirmPayment = document.getElementById("btnConfirmPayment");
  const pagamentoSucessoEl = document.getElementById("pagamentoSucesso");
  const avisoSemPagamento = document.getElementById("avisoSemPagamento");
  const btnVerTabela = document.getElementById("btnVerTabela");
  const tabelaContainer = document.getElementById("tabelaContainer");

  // cria usuários de exemplo caso não exista
  if (!localStorage.getItem(usuariosKey)) {
    localStorage.setItem(usuariosKey, JSON.stringify(generateSampleUsers(3)));
  }

  // Ação do botão de compra
  btnCompra && btnCompra.addEventListener("click", () => {
    // abre o checkout
    window.open(PAYMENT_URL, "_blank");

    // marca que o usuário saiu para pagar
    localStorage.setItem("aguardandoPagamento", "true");

    btnCompra.disabled = true;
    btnCompra.textContent = "Pagamento em andamento...";
  });

  // Ação do botão de confirmar pagamento (só aparece se o usuário voltou do checkout)
  btnConfirmPayment && btnConfirmPayment.addEventListener("click", () => {
    localStorage.setItem("pagamentoConfirmado", "true");
    localStorage.removeItem("aguardandoPagamento");

    pagamentoSucessoEl.classList.remove("hidden");
    avisoSemPagamento.classList.add("hidden");
    btnConfirmPayment.classList.add("hidden");
    btnCompra.classList.add("hidden");
    btnVerTabela.classList.remove("hidden");
    tabelaContainer.classList.remove("hidden");
    gerarTabela();
    alert("Pagamento confirmado com sucesso. Obrigado!");
  });

  // Ação de ver tabela
  btnVerTabela && btnVerTabela.addEventListener("click", () => {
    const t = document.getElementById("tabelaContainer");
    t.classList.toggle("hidden");
    gerarTabela();
  });

  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const login = document.getElementById("login").value.trim();
      const senha = document.getElementById("senha").value.trim();
      if (!isPaymentConfirmed()) {
        alert("Efetue e confirme o pagamento para prosseguir.");
        return;
      }
      if (verificarLogin(login, senha)) {
        localStorage.setItem("logado", "true");
        window.location.href = postPaymentRedirect;
      } else {
        alert("Login ou senha inválidos. Verifique na tabela ou use ADMIN.");
      }
    });
  }

  // Estado inicial ao carregar a página
  if (isPaymentConfirmed()) {
    // pagamento confirmado
    pagamentoSucessoEl && pagamentoSucessoEl.classList.remove("hidden");
    avisoSemPagamento && avisoSemPagamento.classList.add("hidden");
    btnCompra && btnCompra.classList.add("hidden");
    btnVerTabela && btnVerTabela.classList.remove("hidden");
    tabelaContainer && tabelaContainer.classList.remove("hidden");
    gerarTabela();
  } else if (localStorage.getItem("aguardandoPagamento") === "true") {
    // voltou do checkout mas ainda não confirmou
    btnConfirmPayment && btnConfirmPayment.classList.remove("hidden");
    avisoSemPagamento && avisoSemPagamento.classList.remove("hidden");
    btnCompra && btnCompra.classList.add("hidden");
  } else {
    // estado normal sem ter iniciado pagamento
    btnCompra && btnCompra.classList.remove("hidden");
    btnConfirmPayment && btnConfirmPayment.classList.add("hidden");
    btnVerTabela && btnVerTabela.classList.add("hidden");
    tabelaContainer && tabelaContainer.classList.add("hidden");
  }
});

function isPaymentConfirmed() {
  return localStorage.getItem("pagamentoConfirmado") === "true" || localStorage.getItem("logado") === "true";
}

function generateSampleUsers(count = 3) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      login: "user" + Math.floor(1000 + Math.random() * 8000),
      senha: Math.random().toString(36).slice(2, 10)
    });
  }
  return out;
}

function gerarTabela() {
  const tabela = document.getElementById("tabelaLogins");
  if (!tabela) return;
  const usuarios = JSON.parse(localStorage.getItem(usuariosKey) || "[]");
  tabela.innerHTML = "<thead><tr><th>Login</th><th>Senha</th></tr></thead><tbody></tbody>";
  const tbody = tabela.querySelector("tbody");
  usuarios.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.login}</td><td>${u.senha}</td>`;
    tbody.appendChild(tr);
  });
}

function verificarLogin(login, senha) {
  if (login === "ADMIN" && senha === "55355100") return true;
  const usuarios = JSON.parse(localStorage.getItem(usuariosKey) || "[]");
  return usuarios.some(u => u.login === login && u.senha === senha);
}

/* ---------------- Sensitivity generation helpers ---------------- */

function getRandom(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

function gerarSensibilidadesSeparadas(androidCount = 20, iphoneCount = 20){
  // create arrays for android and iphone, each entry an object with fields
  const android = [];
  const iphone = [];
  for(let i=1;i<=androidCount;i++){
    android.push({
      index: i,
      geral: getRandom (100,200),
      reddot: getRandom(100,200),
      mira2x: getRandom(100,200),
      mira4x: getRandom(100,200),
      awm: getRandom(100,200),
      dpi: getRandom(400,1440)
    });
  }
  for(let i=1;i<=iphoneCount;i++){
    iphone.push({
      index: i,
      geral:getRandom (100,200),
      reddot: getRandom(100,200),
      mira2x: getRandom(100,200),
      mira4x: getRandom(100,200),
      awm: getRandom(100,200),
      dpi: getRandom(400,1440)
    });
  }
  // render to tables
  renderSensitivityTable('android', android);
  renderSensitivityTable('iphone', iphone);
  // store last text for copy-all
  window.lastAndroidText = android.map(a=>formatSensitivityText(a,'Android')).join('\n');
  window.lastIphoneText = iphone.map(a=>formatSensitivityText(a,'iPhone')).join('\n');
  return {android, iphone};
}

function formatSensitivityText(obj, device){
  return `#${obj.index} - ${device} | Geral:${obj.geral} RedDot:${obj.reddot} 2x:${obj.mira2x} 4x:${obj.mira4x} AWM:${obj.awm} DPI:${obj.dpi}`;
}

function renderSensitivityTable(prefix, arr){
  const tbody = document.getElementById(prefix+'-tbody');
  if(!tbody) return;
  tbody.innerHTML='';
  arr.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.index}</td>
      <td><strong>${item.geral}</strong></td>
      <td>${item.reddot}</td>
      <td>${item.mira2x}</td>
      <td>${item.mira4x}</td>
      <td>${item.awm}</td>
      <td>${item.dpi}</td>
      <td><button class="copy-btn" onclick="copySingle('${prefix}', ${item.index})">Copiar</button></td>`;
    tbody.appendChild(tr);
    // store textual representation
    window[`${prefix}_cfg_${item.index}`] = formatSensitivityText(item, prefix === 'android' ? 'Android' : 'iPhone');
  });
}

function copySingle(prefix, index){
  const txt = window[`${prefix}_cfg_${index}`] || '';
  if(!txt){ alert('Nada encontrado para copiar.'); return; }
  navigator.clipboard.writeText(txt).then(()=>alert('Copiado: '+txt));
}

function copyAll(prefix){
  const txt = prefix === 'android' ? (window.lastAndroidText || '') : (window.lastIphoneText || '');
  if(!txt){ alert('Gere as configurações primeiro.'); return; }
  navigator.clipboard.writeText(txt).then(()=>alert('Todas as configurações copiadas.'));
}

/* ---------------- Optimization helpers ---------------- */

function copiarTexto(text){
  navigator.clipboard.writeText(text).then(()=>alert('Copiado para a área de transferência.'));
}
