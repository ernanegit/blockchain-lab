const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("====================================");
  console.log("  Deploy do ContratoDigital");
  console.log("====================================");
  console.log("Deployer:", deployer.address);

  const saldo = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Saldo:   ", hre.ethers.formatEther(saldo), "ETH\n");

  // Compila e faz deploy
  const ContratoDigital = await hre.ethers.getContractFactory("ContratoDigital");
  const contrato = await ContratoDigital.deploy();
  await contrato.waitForDeployment();

  const endereco = await contrato.getAddress();
  console.log("✅ Contrato publicado em:", endereco);
  console.log("\nGuarde este endereço para usar no script de assinatura!");
  console.log("====================================");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});