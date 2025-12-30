const pecas = [];

function adicionarPeca() {
  const nome = nomePeca.value;
  const codigo = codigoReferencia.value;
  const impl = implemento.value;
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

function renderLista() {
  listaPecas.innerHTML = "";

  pecas.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerText = `${p.nome} | Qtd: ${p.quantidade}`;
    listaPecas.appendChild(li);
  });
}

document.getElementById("formSolicitacao").addEventListener("submit", async function (e) {
  e.preventDefault();

  if (pecas.length === 0) {
    alert("Adicione ao menos uma peça");
    return;
  }

  let fotoBase64 = "";
  const foto = document.getElementById("foto").files[0];
  if (foto) fotoBase64 = await toBase64(foto);

  const dados = {
    tipo: "solicitacao",
    pecas,
    urgencia: urgencia.value,
    observacoes: observacoes.value,
    fotoBase64
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  const json = await res.json();

  if (json.sucesso) {
    const wa = `https://wa.me/?text=${encodeURIComponent(
      `Solicitação ${json.numero}\nTotal de peças: ${pecas.length}\n${json.pdf}`
    )}`;

    resultado.innerHTML = `
      ✅ Solicitação criada: <b>${json.numero}</b><br>
      📄 <a href="${json.pdf}" target="_blank">Ver PDF</a><br><br>
      📲 <a href="${wa}" target="_blank">Enviar WhatsApp</a>
    `;
  }
});

function toBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
