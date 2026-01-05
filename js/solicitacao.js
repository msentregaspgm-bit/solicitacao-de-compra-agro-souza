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
   (envia direto ao Apps Script sem proxy)
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
    console.log("📤 Salvando solicitação...");
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const json = await res.json();
    console.log("📥 Resposta:", json);

    if (!json.sucesso) {
      alert("Erro ao salvar nuvem");
      return;
    }
    mostrarOpcoes(json);
  } catch (err) {
    alert("Erro ao enviar: " + err.message);
  }
}

/* =====================================================
   MOSTRAR RESULTADO
===================================================== */
function mostrarOpcoes(json) {
  let texto = `Solicitação de Compra: ${json.numero}\n\n`;
  pecas.forEach(p => {
    texto += `• ${p.nome} – Qtd: ${p.quantidade}\n`;
  });
  texto += `\nPDF:\n${json.pdf}`;

  resultado.innerHTML = `
    <p>Solicitação salva com sucesso!</p>
    <a href="${json.pdf}" target="_blank">Ver PDF</a>
    <a href="https://wa.me/?text=${encodeURIComponent(texto)}" target="_blank">Enviar WhatsApp</a>
  `;
}

/* =====================================================
   BASE64
===================================================== */
function toBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
}
