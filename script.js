document.addEventListener("DOMContentLoaded", function () {
    const linkPagamento = "https://pay.kiwify.com.br/gde5HO1"; // Substitua pelo seu HotLink do Kiwify
    const paginaAposPagamento = "https://free-fire-booster.netlify.app/sensibilidade"; // Página de login após pagamento
    const paginaOtimizacao = "https://free-fire-booster.netlify.app/otimizacao"; // Página de otimização
    const paginaVideos = "https://free-fire-booster.netlify.app/videos"; // Página de vídeos
    const paginaGeranik = "https://free-fire-booster.netlify.app/gerar-nick"; // Página de gerar nick
    const paginaGrearbio = "https://free-fire-booster.netlify.app/gerar-bio"; // Página de gerar bio

    // Função para verificar o status de pagamento no servidor
    function verificarPagamento() {
        fetch("kiwify-webhook.php", {
            method: "GET", // Usando GET para verificar o status de pagamento
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Pagamento confirmado') {
                localStorage.setItem("pagamentoConfirmado", "true");
                window.location.href = paginaAposPagamento;
            }
        })
        .catch(error => {
            console.error('Erro ao verificar pagamento:', error);
        });
    }

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
            localStorage.setItem("senha", senhaInput.value);
            alert(`Login realizado com sucesso: ${loginInput.value}`);
            window.location.href = paginaAposPagamento; // Redireciona para página após login
        }
    }

    // Verifica se o login é ADMIN sem precisar de pagamento
    if (window.location.pathname === "/login.html") {
        // Quando a página for carregada, mostra a mensagem de recarga
        mostrarMensagemRecarga();

        document.getElementById("loginForm").addEventListener("submit", function (e) {
            e.preventDefault();
            
            // Realiza o login diretamente sem verificar pagamento
            realizarLoginDireto();
        });
    }

    // Verifica pagamento no início (pode ser removido se não for mais necessário)
    verificarPagamento();

    // Se a página foi recarregada, libera login e senha
    if (localStorage.getItem("login") && localStorage.getItem("senha")) {
        liberarLoginESenha();
    }
    
    /* ------------------- NOVAS FUNCIONALIDADES ------------------- */
    
    // Página para criação de nome personalizado (nome-personalizado.html)
    if (window.location.pathname.endsWith("nome-personalizado.html")) {
        const formNome = document.getElementById("formNome");
        formNome.addEventListener("submit", function(e) {
            e.preventDefault();
            const nomeInput = document.getElementById("nomePersonalizado");
            const invisivelInput = document.getElementById("invisivel");
            let nome = nomeInput.value.trim();
            if (invisivelInput.checked) {
                // Adiciona um espaço invisível (caractere zero-width space)
                nome += "\u200B";
            }
            localStorage.setItem("nomePersonalizado", nome);
            alert("Nome personalizado salvo com sucesso!");
            // Opcional: redireciona para a página do avatar
            window.location.href = "avatar.html";
        });
    }
