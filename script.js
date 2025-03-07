document.addEventListener("DOMContentLoaded", function () {
    const linkPagamento = "https://pay.kiwify.com.br/gde5HO1"; // 🔥 Substitua pelo seu HotLink do Kiwify
    const paginaAposPagamento = "https://free-fire-booster.netlify.app/sensibilidade.html"; // Página de login após pagamento
    const paginaOtimizacao = "https://free-fire-booster.netlify.app/otimizacao.html"; // Página de otimização
    const paginaVideos = "https://free-fire-booster.netlify.app/videos.html"; // Página de vídeos

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

    // Verifica se o login é ADMIN sem precisar de pagamento
    if (window.location.pathname === "/login.html") {
        const loginInput = document.getElementById("login");
        const senhaInput = document.getElementById("senha");

        document.getElementById("loginForm").addEventListener("submit", function (e) {
            e.preventDefault();

            if (loginInput.value === loginAdmin && senhaInput.value === senhaAdmin) {
                localStorage.setItem("login", loginAdmin);
                localStorage.setItem("senha", senhaAdmin);
                alert("Login realizado com sucesso como ADMIN.");
                window.location.href = paginaAposPagamento; // Redireciona após login
            } else if (localStorage.getItem("pagamentoConfirmado") === "true") {
                // Caso o pagamento tenha sido confirmado, autentica o usuário
                localStorage.setItem("login", loginInput.value);
                localStorage.setItem("senha", senhaInput.value);
                window.location.href = paginaAposPagamento; // Redireciona após login
            } else {
                alert("Pagamento necessário para acessar o conteúdo.");
            }
        });
    }

    // Verifica pagamento no início
    verificarPagamento();
});
