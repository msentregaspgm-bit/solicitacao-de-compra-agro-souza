/* =====================================================
   ELEMENTOS
===================================================== */
let nomePeca, codigoReferencia, implemento, quantidade, urgencia, observacoes, listaPecas, resultado, inputFoto;
let pecas = [];

document.addEventListener("DOMContentLoaded", () => {
  nomePeca = document.getElementById("nomePeca");
  codigoReferencia = document.getElementById("codigoReferencia");
  implemento = document.getElementById("implemento");
  quantidade = document.getElementById("quantidade");
  urgencia = document.getElementById("urgencia");
  observacoes = document.getElementById("observacoes");
  listaPecas = document.getElementById("listaPecas");
  resultado = document.getElementById("resultado");
  inputFoto = document.getElementById("foto");

  const botao = document.getElementById("btnSalvar");
  if (botao) {
    botao.addEventListener("click", e => {
      e.preventDefault();
      console.log("✅ Botão clicado — executando salvarSolicitacao()");
      salvarSolicitacao();
    });
  } else {
    console.error("❌ Botão de salvar não encontrado no DOM!");
  }
});

/* =====================================================
   ADICIONAR PEÇA
===================================================== */
function adicionarPeca() {
  const nome = nomePeca.value.trim();
  const codigo = codigoReferencia.value.trim();
  const impl = implemento.value.trim();
  const qtd = quantidade.value;

  if (!nome || !qtd) {
    alert("Informe nome e quantidade da peça");
    return;
  }

  pecas.push({ nome, codigo, implemento: impl, quantidade: qtd });
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
    li.textContent = `${p.nome} | Código: ${p.codigo || "-"} | Impl.: ${p.implemento || "-"} | Qtd: ${p.quantidade}`;
    listaPecas.appendChild(li);
  });
}

/* =====================================================
   SALVAR SOLICITAÇÃO
===================================================== */
async function salvarSolicitacao() {
  if (pecas.length === 0) {
    alert("Adicione ao menos uma peça");
    return;
  }

  const files = inputFoto.files;
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

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const json = await res.json();
    if (!json.sucesso) {
      alert("Erro ao salvar solicitação");
      console.log(json);
      return;
    }
    mostrarOpcoes(json);
  } catch (err) {
    alert("Erro ao enviar solicitação: " + err.message);
    console.error(err);
  }
}

function mostrarOpcoes(json) {
  let textoWhats = `Solicitação de Compra: ${json.numero}\n\n`;
  pecas.forEach(p => {
    textoWhats += `• ${p.nome} – Qtd: ${p.quantidade}\n`;
  });
  textoWhats += `\nPDF:\n${json.pdf}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(textoWhats)}`;

  resultado.innerHTML = `
    <div class="opcoes">
      <h3>Solicitação salva com sucesso</h3>
      <p><b>Número:</b> ${json.numero}</p>
      <a href="${json.pdf}" target="_blank" class="btn">📄 Ver PDF</a>
      <a href="${wa}" target="_blank" class="btn">📲 Enviar WhatsApp</a>
    </div>
  `;
}

function toBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}
