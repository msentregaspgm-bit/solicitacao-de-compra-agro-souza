function adicionarPeca() {
  const div = document.createElement("div");
  div.className = "peca";
  div.innerHTML = `
    <input class="nome" placeholder="Nome da peça">
    <input class="codigo" placeholder="Código">
    <input class="implemento" placeholder="Implemento">
    <input class="quantidade" type="number" placeholder="Quantidade">
  `;
  document.getElementById("listaPecas").appendChild(div);
}

function coletarPecas() {
  const pecas = [];
  document.querySelectorAll(".peca").forEach(p => {
    const nome = p.querySelector(".nome").value;
    const codigo = p.querySelector(".codigo").value;
    const implemento = p.querySelector(".implemento").value;
    const quantidade = p.querySelector(".quantidade").value;

    if (nome && quantidade) {
      pecas.push({ nome, codigo, implemento, quantidade });
    }
  });
  return pecas;
}

function arquivosParaBase64(files) {
  return Promise.all(
    Array.from(files).map(file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      })
    )
  );
}

async function salvarSolicitacao() {
  const fotosInput = document.getElementById("fotos");
  const fotosBase64 = await arquivosParaBase64(fotosInput.files);

  const payload = {
    tipo: "solicitacao",
    urgencia: document.getElementById("urgencia").value,
    observacoes: document.getElementById("observacoes").value,
    pecas: coletarPecas(),
    fotosBase64: fotosBase64
  };

  const resp = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await resp.json();

  if (json.sucesso) {
    window.open(json.whatsapp, "_blank");
    alert("Solicitação salva: " + json.numero);
  } else {
    alert("Erro ao salvar");
  }
}
