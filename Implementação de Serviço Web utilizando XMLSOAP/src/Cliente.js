const soap = require("soap");
const url = "http://localhost:8000/SupermarketService?wsdl";
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const args = {
  nome: "Nome",
  preco: 0.0,
  categoria: "Categoria",
};

soap.createClient(url, function (erro, cliente) {
  if (erro) {
    console.error(erro);
    return;
  }

  function displayMenu() {
    console.log("Escolha uma operação:");
    console.log("1. Buscar produtos por nome");
    console.log("2. Buscar produtos por preço");
    console.log("3. Buscar produtos por categoria");
    console.log("4. Sair");
    rl.question("Digite o número da operação desejada: ", function (escolha) {
      switch (escolha) {
        case "1":
          getProductsByName();
          break;
        case "2":
          getProductsByPrice();
          break;
        case "3":
          getProductsByCategory();
          break;
        case "4":
          rl.close();
          break;
        default:
          console.log("Opção inválida. Tente novamente.");
          displayMenu();
      }
    });
  }

  function getProductsByName() {
    rl.question("Digite o nome do produto: ", function (nome) {
      args.nome = nome;
      cliente.getProductsByName(args, function (erro, resultado) {
        if (erro) console.error(erro);
        else console.log("Produtos por nome:", resultado);

        displayMenu();
      });
    });
  }

  function getProductsByPrice() {
    rl.question("Digite o preço: ", function (preco) {
      args.preco = parseFloat(preco);
      cliente.getProductsByPrice(args, function (erro, resultado) {
        if (erro) console.error(erro);
        else console.log("Produtos por preço:", resultado);

        displayMenu();
      });
    });
  }

  function getProductsByCategory() {
    rl.question("Digite a categoria: ", function (categoria) {
      args.categoria = categoria;
      cliente.getProductsByCategory(args, function (erro, resultado) {
        if (erro) console.error(erro);
        else console.log("Produtos por categoria:\n", resultado);

        displayMenu();
      });
    });
  }

  displayMenu();
});
