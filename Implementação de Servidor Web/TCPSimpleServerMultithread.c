#include <io.h>
#include <stdio.h>
#include <winsock2.h>
#include <process.h>
#include <string.h>
#pragma comment(lib,"ws2_32.lib")
#define PORT 8080
#define mensagemSIZE 100000000
#define MAXSOCKETS 10


SOCKET new_socket[MAXSOCKETS];
int qtdsockets = 0;


void getdata(int pos, const char caminho[256])
{
    char mensagem[mensagemSIZE];
    char resposta[mensagemSIZE];
    FILE *f = fopen(caminho, "rb");

    if (f == NULL)
    {
        sprintf(resposta, "HTTP/1.1 404 NOT FOUND\r\nContent-Length: 0\r\n\r\n");
        send(new_socket[pos], resposta, strlen(resposta), 0);
        closesocket(new_socket[pos]);
        return;
    }

    fseek(f, 0, SEEK_END);
    long tamanho = ftell(f);
    fseek(f, 0, SEEK_SET);
    fread(mensagem, 1, tamanho, f);
    fclose(f);

    sprintf(resposta, "HTTP/1.1 200 OK\r\nContent-Length: %ld\r\n\r\n", tamanho);

    send(new_socket[pos], resposta, strlen(resposta), 0);
    send(new_socket[pos], mensagem, tamanho, 0);

    closesocket(new_socket[pos]);
}

void getClienteConexao(int pos)
{
    char buffer[mensagemSIZE];
    char method[10], path[100];
    int recv_size;

    recv_size = recv(new_socket[pos], buffer, mensagemSIZE, 0);
    if (recv_size == SOCKET_ERROR)
    {
        printf("Erro! Não foi possivel receber os dados: %d\n", WSAGetLastError());
        return;
    }
    buffer[recv_size] = '\0';

    sscanf(buffer, "%s %s", method, path);

    if (path[0] == '/') memmove(path, path + 1, strlen(path));

    if (strlen(path) == 0) strcpy(path, "index.html");

    char caminho[256];
    sprintf(caminho, "C:/Documents/www/%s", path);

    getdata(pos, caminho);
}

int main(int argc, char *argv[])
{
    WSADATA wsa;
    SOCKET s;
    struct sockaddr_in server, client;
    int c, pos;

    printf("*** SERVER ***\n\nAguardando conexoes...\n\n");

    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0)
    {
        printf("\nFalha na inicializacao da biblioteca Winsock: %d", WSAGetLastError());
        exit(EXIT_FAILURE);
    }

    if ((s = socket(AF_INET, SOCK_STREAM, 0)) == INVALID_SOCKET)
    {
        printf("\nNao e possivel inicializar o socket: %d", WSAGetLastError());
        exit(EXIT_FAILURE);
    }

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons(PORT);

    if (bind(s, (struct sockaddr *)&server, sizeof(server)) == SOCKET_ERROR)
    {
        printf("\nNao e possivel construir o socket: %d", WSAGetLastError());
        exit(EXIT_FAILURE);
    }

    listen(s, 3);
    c = sizeof(struct sockaddr_in);

    while (1)
    {
        pos = qtdsockets;
        new_socket[qtdsockets++] = accept(s, (struct sockaddr *)&client, &c);
        if (new_socket[pos] == INVALID_SOCKET)
        {
            printf("\nConexao nao aceita. Codigo de erro: %d", WSAGetLastError());
            continue;
        }
        puts("\nConexao aceita.");
        printf("\nDados do cliente - IP: %s - Porta: %d\n", inet_ntoa(client.sin_addr), htons(client.sin_port));

        _beginthread(getClienteConexao, 0, pos);
    }

    closesocket(s);
    WSACleanup();
}
