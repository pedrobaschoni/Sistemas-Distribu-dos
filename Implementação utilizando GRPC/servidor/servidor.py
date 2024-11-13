import grpc
from concurrent import futures
import validation_pb2
import validation_pb2_grpc
import re

class ValidationServicer(validation_pb2_grpc.ValidationServiceServicer):
    def ValidateCPF(self, request, context):
        is_valid = self.validate_cpf(request.value)
        return validation_pb2.ValidationResponse(result=str(is_valid))

    def ValidateCNPJ(self, request, context):
        is_valid = self.validate_cnpj(request.value)
        return validation_pb2.ValidationResponse(result=str(is_valid))

    def validate_cpf(self, cpf):
        cpf = re.sub(r'\D', '', cpf)

        if len(cpf) != 11 or cpf == cpf[0] * 11:
            return False

        def calc_digit(cpf, factor):
            total = sum(int(cpf[i]) * factor for i in range(factor))
            remainder = total % 11
            return 0 if remainder < 2 else 11 - remainder

        first_digit = calc_digit(cpf, 9)
        second_digit = calc_digit(cpf, 10)

        return first_digit == int(cpf[9]) and second_digit == int(cpf[10])

    def validate_cnpj(self, cnpj):
 
        cnpj = re.sub(r'\D', '', cnpj)

        if len(cnpj) != 14 or cnpj == cnpj[0] * 14:
            return False

        def calc_digit(cnpj, factor):
            total = sum(int(cnpj[i]) * (factor - i) for i in range(factor))
            remainder = total % 11
            return 0 if remainder < 2 else 11 - remainder

        first_digit = calc_digit(cnpj, 12)
        second_digit = calc_digit(cnpj, 13)

        return first_digit == int(cnpj[12]) and second_digit == int(cnpj[13])

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    validation_pb2_grpc.add_ValidationServiceServicer_to_server(ValidationServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Servidor gRPC rodando na porta 50051...")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()

