import { PrismaClient } from '@prisma/client';

export class PedidosRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Ejemplo de operación CRUD básica solicitada en el punto 3
  async obtenerTodos() {
    return await this.prisma.pedido.findMany({
      include: {
        usuario: true,
        detalles: { include: { producto: true } }
      }
    });
  }
}