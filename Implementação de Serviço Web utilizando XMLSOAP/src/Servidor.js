const soap = require("soap");
const http = require("http");

// Simula um banco de dados em memória para produtos de supermercado
const productDatabase = [
  { nome: "Arroz", preco: 20.0, categoria: "Grãos" },
  { nome: "Feijão", preco: 10.0, categoria: "Grãos" },
  { nome: "Macarrão", preco: 5.0, categoria: "Massas" },
  { nome: "Leite", preco: 7.0, categoria: "Laticínios" },
  { nome: "Queijo", preco: 15.0, categoria: "Laticínios" },
  { nome: "Banana", preco: 3.0, categoria: "Frutas" },
  { nome: "Maçã", preco: 4.0, categoria: "Frutas" },
  { nome: "Alface", preco: 2.0, categoria: "Verduras" },
];

const service = {
  SupermarketService: {
      SupermarketPort: {
          getProductsByName: function(args, callback) {
              const nome = args.nome;
              const filtroProdutos = productDatabase.filter(produto => new RegExp(nome, 'i').test(produto.nome));
              callback(null, filtroProdutos);
          },
          getProductsByPrice: function(args, callback) {
              const preco = args.preco;
              const filtroProdutos = productDatabase.filter(produto => produto.preco == preco);
              callback(null, filtroProdutos);
          },
          getProductsByCategory: function(args, callback) {
              const categoria = args.categoria;
              const filtroProdutos = productDatabase.filter(produto => produto.categoria === categoria);
              callback(null, filtroProdutos);
          },
      },
  },
};

const xml = require("fs").readFileSync("SupermarketService.wsdl", "utf8");

const server = http.createServer(function (request, response) {
  response.end("404: Not Found: " + request.url);
});

server.listen(8000, function () {     
    console.log('Servidor SOAP rodando em http://localhost:8000');   
});      
soap.listen(server, "/SupermarketService", service, xml);
