document.getElementById("formCotacao").addEventListener("submit", async function (e) {
  e.preventDefault();

  const arquivo = document.getElementById("orcamento").files[0];
  let orcamentoBase64 = "";

  if (arquivo) {
    orcamentoBase64 = await toBase64(arquivo);
  }

  const dados = {
    tipo: "cotacao",
    numeroSolicitacao: numeroSolicitacao.value,
    fornecedor: fornecedor.value,
    valor: valor.value,
    prazo: prazo.value,
    pagamento: pagamento.value,
    orcamentoBase64
  };

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  const json = await res.json();

  if (json.sucesso) {
    const mensagemWhatsApp = `
Cotação ${json.numeroCotacao}
Solicitação: ${dados.numeroSolicitacao}
Valor: R$ ${dados.valor}

Link PDF:
${json.pdf}
    `;

    const waLink = "https://wa.me/?text=" + encodeURIComponent(mensagemWhatsApp);

    document.getElementById("resultadoCotacao").innerHTML = `
      ✅ Cotação criada: <b>${json.numeroCotacao}</b><br>
      📄 <a href="${json.pdf}" target="_blank">Ver PDF</a><br><br>
      📲 <a href="${waLink}" target="_blank">Enviar WhatsApp</a>
    `;
  } else {
    document.getElementById("resultadoCotacao").innerText = "❌ Erro ao salvar.";
  }
});

function toBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
