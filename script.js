document.addEventListener("DOMContentLoaded", function () {
    const linkPagamento = "https://pay.kiwify.com.br/gde5HO1"; // Substitua pelo seu HotLink do Kiwify
    const paginaAposPagamento = "https://free-fire-booster.netlify.app/sensibilidade.html"; // Página de login após pagamento
    const paginaLogin = "https://free-fire-booster.netlify.app"; // Página de login e pagamento
    const paginasProtegidas = [
        "sensibilidade.html", 
        "otimizacao.html", 
        "videos.html", 
        "gerar-nick.html", 
        "gerar-bio.html"
    ]; 

    // Função para verificar se o pagamento foi feito
    function verificarPagamento() {
        return localStorage.getItem("pagamentoConfirmado") === "true";
    }

    // Função para redirecionar o usuário para a página de pagamento, se necessário
    function redirecionarParaPagamento() {
        if (!verificarPagamento()) {
            window.location.href = paginaLogin; // Redireciona para a página de login e pagamento
        }
    }

    // Verifica se a página que o usuário está tentando acessar é uma das protegidas
    if (paginasProtegidas.some(page => window.location.pathname.includes(page))) {
        // Se o pagamento não foi confirmado, redireciona para a página de login e pagamento
        redirecionarParaPagamento();
    }

    // Função para liberar o login e a senha após recarga
    function liberarLoginESenha() {
        const tabelaLogin = document.getElementById("tabela-login");
        if (tabelaLogin) {
            tabelaLogin.style.display = "block";
        }

        const mensagemRecarga = document.getElementById("mensagem-recarga");
        if (mensagemRecarga) {
            mensagemRecarga.style.display = "none";
        }
    }

    // Se o pagamento foi confirmado, libera o acesso às páginas
    if (localStorage.getItem("login") && localStorage.getItem("senha")) {
        liberarLoginESenha();
    }
    
    // Redireciona para a página de pagamento caso o usuário não tenha feito o pagamento
    if (!verificarPagamento() && !window.location.pathname.includes("login.html")) {
        window.location.href = paginaLogin; // Redireciona para a página de login e pagamento
    }

    /* ------------------- NOVAS FUNCIONALIDADES ------------------- */
    
    // Função para gerar login e senha aleatórios
    function gerarLoginESenha() {
        const login = "user_" + Math.random().toString(36).substr(2, 8); // Gerando login aleatório
        const senha = Math.random().toString(36).substr(2, 12); // Gerando senha aleatória
        return { login, senha };
    }

    // Função para armazenar login e senha no localStorage
    function armazenarLoginESenha() {
        const { login, senha } = gerarLoginESenha();
        localStorage.setItem("login", login);
        localStorage.setItem("senha", senha);
        alert(`Login: ${login} | Senha: ${senha}`); // Exibe login e senha gerados
    }

    // Login fixo para ADMIN
    const loginAdmin = "ADMIN";
    const senhaAdmin = "55355100";

    // Função para esconder a tabela de login inicialmente e mostrar a mensagem
    function mostrarMensagemRecarga() {
        const tabelaLogin = document.getElementById("tabela-login"); // Localiza a tabela de login e senha
        const mensagemRecarga = document.getElementById("mensagem-recarga"); // Localiza a mensagem de recarga

        // Esconde a tabela de login
        if (tabelaLogin) {
            tabelaLogin.style.display = "none";
        }

        // Exibe a mensagem pedindo para recarregar o navegador
        if (mensagemRecarga) {
            mensagemRecarga.style.display = "block";
        }
    }

    // Função para liberar o login e a senha após recarga
    function liberarLoginESenha() {
        const tabelaLogin = document.getElementById("tabela-login"); // Localiza a tabela de login e senha

        // Exibe a tabela de login
        if (tabelaLogin) {
            tabelaLogin.style.display = "block";
        }

        // Esconde a mensagem de recarga
        const mensagemRecarga = document.getElementById("mensagem-recarga");
        if (mensagemRecarga) {
            mensagemRecarga.style.display = "none";
        }
    }

    // Função para realizar o login diretamente sem verificação de pagamento
    function realizarLoginDireto() {
        const loginInput = document.getElementById("login");
        const senhaInput = document.getElementById("senha");

        // Permite login direto (não verifica pagamento)
        if (loginInput && senhaInput) {
            localStorage.setItem("login", loginInput.value);
            localStorage.setItem("senha", loginInput.value);
            alert(`Login realizado com sucesso: ${loginInput.value}`);
            window.location.href = paginaAposPagamento; // Redireciona para página após login
        }
    }

    // Função para verificar o status de pagamento no servidor
    function verificarPagamentoServidor() {
        fetch("kiwify-webhook.php", {
            method: "GET", // Usando GET para verificar o status de pagamento
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Pagamento confirmado') {
                localStorage.setItem("pagamentoConfirmado", "true");
                window.location.href = paginaAposPagamento; // Redireciona para a página após pagamento
            }
        })
        .catch(error => {
            console.error('Erro ao verificar pagamento:', error);
        });
    }

    // Verifica pagamento no início (pode ser removido se não for mais necessário)
    verificarPagamentoServidor();

    // Se a página foi recarregada, libera login e senha
    if (localStorage.getItem("login") && localStorage.getItem("senha")) {
        liberarLoginESenha();
    }

    // Função para realizar o login diretamente sem verificação de pagamento
    function realizarLoginDireto() {
        const loginInput = document.getElementById("login");
        const senhaInput = document.getElementById("senha");

        // Permite login direto (não verifica pagamento)
        if (loginInput && senhaInput) {
            localStorage.setItem("login", loginInput.value);
            localStorage.setItem("senha", loginInput.value);
            alert(`Login realizado com sucesso: ${loginInput.value}`);
            window.location.href = paginaAposPagamento; // Redireciona para página após login
        }
    }

    // Função para esconder a tabela de login inicialmente e mostrar a mensagem
    function mostrarMensagemRecarga() {
        const tabelaLogin = document.getElementById("tabela-login"); // Localiza a tabela de login e senha
        const mensagemRecarga = document.getElementById("mensagem-recarga"); // Localiza a mensagem de recarga

        // Esconde a tabela de login
        if (tabelaLogin) {
            tabelaLogin.style.display = "none";
        }

        // Exibe a mensagem pedindo para recarregar o navegador
        if (mensagemRecarga) {
            mensagemRecarga.style.display = "block";
        }
    }
});
