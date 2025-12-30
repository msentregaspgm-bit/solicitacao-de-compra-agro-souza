const pecas = [];

function adicionarPeca() {
  const nome = document.getElementById("nome").value;
  const codigo = document.getElementById("codigo").value;
  const implemento = document.getElementById("implemento").value;
  const quantidade = document.getElementById("quantidade").value;

  if (!nome || !quantidade) {
    alert("Preencha nome e quantidade da peça");
    return;
  }

  const peca = { nome, codigo, implemento, quantidade };
  pecas.push(peca);

  const div = document.createElement("div");
  div.className = "peca-salva";
  div.innerHTML = `
    <strong>${nome}</strong><br>
    Código: ${codigo || "-"}<br>
    Implemento: ${implemento || "-"}<br>
    Quantidade: ${quantidade}
  `;
  document.getElementById("pecasSalvas").appendChild(div);

  document.getElementById("nome").value = "";
  document.getElementById("codigo").value = "";
  document.getElementById("implemento").value = "";
  document.getElementById("quantidade").value = "";
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
  console.log("Botão salvar clicado");

  if (pecas.length === 0) {
    alert("Adicione pelo menos uma peça");
    return;
  }

  const fotosInput = document.getElementById("fotos");
  const fotosBase64 = await arquivosParaBase64(fotosInput.files);

  const payload = {
    tipo: "solicitacao",
    urgencia: document.getElementById("urgencia").value,
    observacoes: document.getElementById("observacoes").value,
    pecas: pecas,
    fotosBase64: fotosBase64
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await response.json();

  if (json.sucesso) {
    window.open(json.whatsapp, "_blank");
    alert("Solicitação salva: " + json.numero);
  } else {
    alert("Erro ao salvar solicitação");
  }
}
