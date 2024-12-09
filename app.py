from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Rota para a página inicial
@app.route("/")
def index():
    return render_template("index.html")

# Rota para a página de otimização
@app.route("/otimizacao")
def otimizacao():
    return render_template("otimizacao.html")

# Rota para a página de vídeos
@app.route("/videos")
def videos():
    return render_template("videos.html")

# Rota para processar formulário (se necessário)
@app.route("/enviar_formulario", methods=["POST"])
def enviar_formulario():
    nome = request.form.get("nome")
    email = request.form.get("email")
    mensagem = request.form.get("mensagem")
    
    if not nome or not email or not mensagem:
        return "Por favor, preencha todos os campos!", 400
    
    # Lógica para processar o formulário aqui...
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)
