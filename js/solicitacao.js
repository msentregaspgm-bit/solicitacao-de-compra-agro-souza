/* =====================================================
   ELEMENTOS E DADOS
===================================================== */
const pecas = [];

const nomePeca = document.getElementById("nomePeca");
const codigoReferencia = document.getElementById("codigoReferencia");
const implemento = document.getElementById("implemento");
const quantidade = document.getElementById("quantidade");
const urgencia = document.getElementById("urgencia");
const observacoes = document.getElementById("observacoes");
const listaPecas = document.getElementById("listaPecas");
const resultado = document.getElementById("resultado");
const inputFoto = document.getElementById("foto");

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

/* =====================================================
   LISTAR PEÇAS
===================================================== */
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
    console.log("📤 Enviando solicitação...");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const json = await res.json();
    console.log("📥 Resposta recebida:", json);

    if (!json.sucesso) {
      alert("Erro ao salvar solicitação!");
      return;
    }

    mostrarOpcoes(json);
  } catch (err) {
    alert("Erro ao enviar solicitação: " + err.message);
    console.error(err);
  }
}

/* =====================================================
   MOSTRAR RESULTADO
===================================================== */
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

/* =====================================================
   CONVERTER FOTO PARA BASE64
===================================================== */
function toBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}
