const pecas = [];

/* ========= ADICIONAR PEÇA ========= */
function adicionarPeca() {
  const nome = nomePeca.value.trim();
  const codigo = codigoReferencia.value.trim();
  const impl = implemento.value.trim();
  const qtd = quantidade.value;

  if (!nome || !qtd) {
    alert("Informe nome e quantidade da peça");
    return;
  }

  pecas.push({
    nome,
    codigo,
    implemento: impl,
    quantidade: qtd
  });

  nomePeca.value = "";
  codigoReferencia.value = "";
  implemento.value = "";
  quantidade.value = "";

  renderLista();
}

/* ========= LISTA DE PEÇAS ========= */
function renderLista() {
  listaPecas.innerHTML = "";

  pecas.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nome} | Qtd: ${p.quantidade}`;
    listaPecas.appendChild(li);
  });
}

/* ========= SUBMIT ========= */
document
  .getElementById("formSolicitacao")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    if (pecas.length === 0) {
      alert("Adicione ao menos uma peça");
      return;
    }

    const files = document.getElementById("foto").files;
    const fotosBase64 = [];

    for (const file of files) {
      fotosBase64.push(await toBase64(file));
    }

    const dados = {
      tipo: "solicitacao",
      pecas,
      urgencia: urgencia.value,
      observacoes: observacoes.value,
      fotosBase64
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const json = await res.json();

    if (!json.sucesso) {
      alert("Erro ao salvar solicitação");
      return;
    }

    /* ========= WHATSAPP ========= */
    let texto = `Solicitação ${json.numero}\n\n`;

    pecas.forEach(p => {
      texto += `• ${p.nome} – Qtd: ${p.quantidade}\n`;
    });

    texto += `\nPDF:\n${json.pdf}`;

    const wa = `https://wa.me/?text=${encodeURIComponent(texto)}`;

    resultado.innerHTML = `
      ✅ Solicitação criada: <b>${json.numero}</b><br>
      📄 <a href="${json.pdf}" target="_blank">Ver PDF</a><br><br>
      📲 <a href="${wa}" target="_blank">Enviar WhatsApp</a>
    `;
  });

/* ========= BASE64 ========= */
function toBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}
