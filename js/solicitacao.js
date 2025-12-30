document.getElementById("formSolicitacao").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fotoArquivo = document.getElementById("foto").files[0];
  let fotoBase64 = "";

  if (fotoArquivo) {
    fotoBase64 = await toBase64(fotoArquivo);
  }

  const dados = {
    tipo: "solicitacao",
    nomePeca: nomePeca.value,
    codigoReferencia: codigoReferencia.value,
    implemento: implemento.value,
    quantidade: quantidade.value,
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
    const mensagemWhatsApp = `
Solicitação ${json.numero}
Peça: ${dados.nomePeca}
Quantidade: ${dados.quantidade}

Link PDF:
${json.pdf}
    `;

    const waLink = "https://wa.me/?text=" + encodeURIComponent(mensagemWhatsApp);

    document.getElementById("resultado").innerHTML = `
      ✅ Solicitação criada: <b>${json.numero}</b><br>
      📄 <a href="${json.pdf}" target="_blank">Ver PDF</a><br><br>
      📲 <a href="${waLink}" target="_blank">Enviar WhatsApp</a>
    `;
  } else {
    document.getElementById("resultado").innerText = "❌ Erro ao salvar.";
  }
});

function toBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
