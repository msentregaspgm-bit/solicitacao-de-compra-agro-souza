function adicionarPeca() {
  const div = document.createElement("div");
  div.className = "linha-peca";
  div.innerHTML = `
    <input class="nome-peca" placeholder="Nome da peça">
    <input class="qtd-peca" type="number" placeholder="Qtd">
  `;
  document.getElementById("pecas").appendChild(div);
}

function obterPecasDoFormulario() {
  const linhas = document.querySelectorAll(".linha-peca");
  const pecas = [];

  linhas.forEach(linha => {
    const nome = linha.querySelector(".nome-peca").value;
    const qtd = linha.querySelector(".qtd-peca").value;

    if (nome && qtd) {
      pecas.push({
        nome: nome,
        quantidade: Number(qtd)
      });
    }
  });

  return pecas;
}

function arquivosParaBase64(files) {
  return Promise.all(
    Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );
}

async function enviarSolicitacao() {
  const fotosInput = document.getElementById("fotos");
  const fotosBase64 = await arquivosParaBase64(fotosInput.files);

  const dados = {
    tipo: "solicitacao",
    urgencia: document.getElementById("urgencia").value,
    observacoes: document.getElementById("observacoes").value,
    pecas: obterPecasDoFormulario(),
    fotosBase64: fotosBase64
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  const json = await response.json();

  if (json.sucesso) {
    window.open(json.whatsapp, "_blank");
    alert("Solicitação criada: " + json.numero);
  } else {
    alert("Erro: " + json.erro);
  }
}
