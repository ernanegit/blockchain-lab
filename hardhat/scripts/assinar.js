const hre = require("hardhat");

// ⚠️ Substitua pelo endereço retornado no deploy.js
const CONTRATO_ENDERECO = "COLE_O_ENDERECO_AQUI";

const STATUS = ["Pendente", "Assinado pela Parte 1", "Assinado por Ambos ✅", "Cancelado ❌"];

async function main() {
  const [parte1, parte2] = await hre.ethers.getSigners();

  console.log("====================================");
  console.log("  Assinatura de Contrato Digital");
  console.log("====================================");
  console.log("Parte 1:", parte1.address);
  console.log("Parte 2:", parte2.address);

  // Conecta ao contrato já publicado
  const ContratoDigital = await hre.ethers.getContractFactory("ContratoDigital");
  const contrato = ContratoDigital.attach(CONTRATO_ENDERECO);

  // --- 1. Criar contrato ---
  console.log("\n📄 Criando contrato entre as partes...");
  const tx1 = await contrato.connect(parte1).criarContrato(
    parte2.address,
    "Prestacao de servicos de desenvolvimento de software - Mai/2026"
  );
  const receipt1 = await tx1.wait();

  // Pega o ID do evento emitido
  const evento = receipt1.logs
    .map(log => { try { return contrato.interface.parseLog(log); } catch { return null; } })
    .find(e => e?.name === "ContratoCriado");

  const contratoId = evento.args.id;
  console.log(`✅ Contrato #${contratoId} criado! (TX: ${tx1.hash})`);

  // --- 2. Ver status atual ---
  let dados = await contrato.verContrato(contratoId);
  console.log(`\nStatus atual: ${STATUS[dados.status]}`);
  console.log(`Descrição:    ${dados.descricao}`);

  // --- 3. Parte 1 assina ---
  console.log("\n✍️  Parte 1 assinando...");
  const tx2 = await contrato.connect(parte1).assinarContrato(contratoId);
  await tx2.wait();
  dados = await contrato.verContrato(contratoId);
  console.log(`Status: ${STATUS[dados.status]}`);

  // --- 4. Parte 2 assina ---
  console.log("\n✍️  Parte 2 assinando...");
  const tx3 = await contrato.connect(parte2).assinarContrato(contratoId);
  await tx3.wait();
  dados = await contrato.verContrato(contratoId);
  console.log(`Status: ${STATUS[dados.status]}`);

  // --- 5. Resultado final ---
  console.log("\n====================================");
  console.log("📋 CONTRATO FINALIZADO");
  console.log("====================================");
  console.log(`ID:         #${dados.id}`);
  console.log(`Descrição:  ${dados.descricao}`);
  console.log(`Parte 1:    ${dados.parte1}`);
  console.log(`Parte 2:    ${dados.parte2}`);
  console.log(`Criado em:  ${new Date(Number(dados.criadoEm) * 1000).toLocaleString("pt-BR")}`);
  console.log(`Assinado:   ${new Date(Number(dados.assinadoEm) * 1000).toLocaleString("pt-BR")}`);
  console.log(`Status:     ${STATUS[dados.status]}`);
  console.log("====================================");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});