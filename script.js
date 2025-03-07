document.addEventListener("DOMContentLoaded", function () {
    const linkPagamento = "https://pay.kiwify.com.br/gde5HO1"; // 🔥 Substitua pelo seu HotLink do Kiwify
    const paginaAposPagamento = "https://free-fire-booster.netlify.app/login.html"; // Página de login após pagamento
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

    // Verifica se o usuário já pagou (usando localStorage)
    if (localStorage.getItem("pagamentoConfirmado") === "true") {
        // Redireciona para a página de conteúdo conforme o status
        if (window.location.pathname === "/login.html") {
            // Já está na página de login, apenas exibe a mensagem
            alert("Pagamento confirmado! Por favor, recarregue a página de login.");
            return;
        } else {
            // Se o pagamento foi confirmado, redireciona para a página de login
            window.location.href = paginaAposPagamento;
        }
    } else {
        // Verifica qual página o usuário está acessando e ajusta a exibição
        if (window.location.pathname === "/otimizacao.html" || window.location.pathname === "/videos.html") {
            // Se for uma dessas páginas, apenas exibe o conteúdo normal
            document.body.innerHTML = `
                <div class="container">
                    <h1>Conteúdo Exclusivo do Free Fire Booster</h1>
                    <p>Aqui você encontrará tudo o que precisa para melhorar sua performance no jogo!</p>
                    <!-- O conteúdo da página de otimização ou vídeos vai aqui -->
                    <p>O conteúdo estará disponível após o pagamento!</p>
                </div>
            `;
        } else {
            // Se não for a página de otimização ou vídeos, exibe a página de pagamento
            document.body.innerHTML = `
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 0;
                        margin: 0;
                        background-image: url('https://i0.wp.com/www.salvandonerd.blog.br/wp-content/uploads/2022/06/Freefa.jpg?fit=1920%2C1080&ssl=1');
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .container {
                        background: rgba(255, 255, 255, 0.9); /* Fundo branco com opacidade */
                        padding: 30px;
                        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                        max-width: 500px;
                        width: 100%;
                        border-radius: 10px;
                        text-align: center;
                    }

                    h1 {
                        color: #2c3e50;
                        font-size: 2em;
                    }

                    p {
                        font-size: 1.2em;
                        color: #555;
                        margin-bottom: 20px;
                    }

                    .btn {
                        display: inline-block;
                        padding: 15px 30px;
                        font-size: 1.2em;
                        background-color: rgb(5, 157, 0);
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        transition: background 0.3s;
                    }

                    .btn:hover {
                        background-color: rgb(19, 164, 0);
                    }

                    /* Responsividade */
                    @media (max-width: 768px) {
                        h1 {
                            font-size: 1.8em;
                        }
                        p {
                            font-size: 1em;
                        }
                        .btn {
                            padding: 12px 20px;
                            font-size: 1em;
                        }
                    }
                </style>

                <div class="container">
                    <h1>🔥 Acesso Exclusivo ao Free Fire Booster 🔥</h1>
                    <p>Por apenas <strong>R$5,00</strong>, você terá acesso imediato às configurações secretas de sensibilidade e desempenho!</p>
                    <p>Clique no botão abaixo para efetuar o pagamento e desbloquear o conteúdo.</p>
                    <a href="${linkPagamento}" target="_blank" class="btn">Comprar Agora - R$5</a>
                    <br><br>
                    <!-- Botão para gerar login e senha aleatórios -->
                    <button onclick="armazenarLoginESenha()" class="btn">Gerar Login e Senha Aleatórios</button>
                </div>
            `;
        }
    }

    // Simulação de pagamento confirmado (você deve configurar isso no Kiwify com Webhooks ou Manualmente)
    window.addEventListener("message", function (event) {
        if (event.data === "pagamento_sucesso") {
            localStorage.setItem("pagamentoConfirmado", "true");
            window.location.href = paginaAposPagamento; // Redireciona para a página de login
        }
    });

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
