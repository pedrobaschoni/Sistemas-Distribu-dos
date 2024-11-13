package main

import (
    "context"
    "fmt"
    "log"

    "google.golang.org/grpc"
    pb "grpc-client-go/validation"
)

func main() {

    conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
    if err != nil {
        log.Fatalf("Não foi possível conectar: %v", err)
    }
    defer conn.Close()

    client := pb.NewValidationServiceClient(conn)

    fmt.Print("Digite um CPF: ")
    var cpf string
    fmt.Scanln(&cpf)

    cpfRequest := &pb.ValidationRequest{Value: cpf}
    cpfResponse, err := client.ValidateCPF(context.Background(), cpfRequest)
    if err != nil {
        log.Fatalf("Erro ao validar CPF: %v", err)
    }
    fmt.Printf("Resposta do servidor para ValidateCPF: %s\n", cpfResponse.Result)

    fmt.Print("Digite um CNPJ: ")
    var cnpj string
    fmt.Scanln(&cnpj)

    cnpjRequest := &pb.ValidationRequest{Value: cnpj}
    cnpjResponse, err := client.ValidateCNPJ(context.Background(), cnpjRequest)
    if err != nil {
        log.Fatalf("Erro ao validar CNPJ: %v", err)
    }
    fmt.Printf("Resposta do servidor para ValidateCNPJ: %s\n", cnpjResponse.Result)
}

