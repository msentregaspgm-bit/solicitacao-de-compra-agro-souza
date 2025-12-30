const pecas = [];

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

function renderLista() {
  listaPecas.innerHTML = "";
  pecas.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nome} | Qtd: ${p.quantidade}`;
    listaPecas.appendChild(li);
  });
}

/* ===== SALVAR ===== */
async function salvarSolicitacao() {

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

  /* 👇 NÃO ABRE NADA AUTOMÁTICO */
  mostrarOpcoes(json);
}

/* ===== OPÇÕES APÓS SALVAR ===== */
function mostrarOpcoes(json) {

  let texto = `Solicitação ${json.numero}\n\n`;
  pecas.forEach(p => {
    texto += `• ${p.nome} – Qtd: ${p.quantidade}\n`;
  });
  texto += `\nPDF:\n${json.pdf}`;

  const wa = `https://wa.me/?text=${encodeURIComponent(texto)}`;

  resultado.innerHTML = `
    <div class="opcoes">
      <h3>Solicitação salva com sucesso</h3>
      <p><b>Número:</b> ${json.numero}</p>

      <a href="${json.pdf}" target="_blank" class="btn">
        📄 Ver PDF
      </a>

      <a href="${wa}" target="_blank" class="btn">
        📲 Enviar WhatsApp
      </a>
    </div>
  `;
}

/* ===== BASE64 ===== */
function toBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}
