document.getElementById("formSolicitacao").addEventListener("submit", async e => {
  e.preventDefault();

  const foto = document.getElementById("foto").files[0];
  let fotoBase64 = "";

  if (foto) {
    fotoBase64 = await toBase64(foto);
  }

  const dados = {
    tipo: "solicitacao",
    nomePeca: nomePeca.value,
    codigoReferencia: codigo.value,
    implemento: implemento.value,
    quantidade: quantidade.value,
    urgencia: urgencia.value,
    observacoes: obs.value,
    fotoBase64: fotoBase64
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  const json = await res.json();

  if (json.sucesso) {
    const msg = `
Solicitação ${json.numero}
Peça: ${dados.nomePeca}

PDF:
${json.pdf}
    `;
    const wa = "https://wa.me/?text=" + encodeURIComponent(msg);
    resultado.innerHTML = `
      <p>Solicitação criada: <b>${json.numero}</b></p>
      <a href="${json.pdf}" target="_blank">📄 PDF</a><br><br>
      <a href="${wa}" target="_blank">📲 Enviar WhatsApp</a>
    `;
  }
});

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
