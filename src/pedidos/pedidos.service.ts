import { PrismaClient } from '@prisma/client';

export interface ItemComprado {
  productoId: number;
  cantidad: number;
}

export class PedidosService {
  constructor(private readonly prisma: PrismaClient) {}

  async procesarCheckout(usuarioId: number, productosComprados: ItemComprado[]) {
    // Iniciamos la transacción (Propiedades ACID)
    return await this.prisma.$transaction(async (tx) => {
      
      // A. Creamos el pedido inicial
      const pedido = await tx.pedido.create({
        data: { usuarioId, total: 0 }
      });

      let totalCalculado = 0;

      // B. Recorremos los productos solicitados
      for (const item of productosComprados) {
        const producto = await tx.producto.findUnique({ where: { id: item.productoId } });
        
        if (!producto) {
          throw new Error(`El producto con ID ${item.productoId} no existe`);
        }
        
        // Validación crítica: si no hay stock suficiente, lanzamos un error para provocar el ROLLBACK
        if (producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto: ${producto.nombre}. Quedan ${producto.stock} unidades.`);
        }

        // Restamos el inventario
        await tx.producto.update({
          where: { id: producto.id },
          data: { stock: { decrement: item.cantidad } }
        });

        // Creamos el registro en DetallePedido
        await tx.detallePedido.create({
          data: {
            pedidoId: pedido.id,
            productoId: producto.id,
            cantidad: item.cantidad,
            precio: producto.precio
          }
        });

        // Sumamos al total final
        totalCalculado += producto.precio * item.cantidad;
      }

      // C. Actualizamos el pedido con el precio total calculado (COMMIT automático al finalizar)
      return await tx.pedido.update({
        where: { id: pedido.id },
        data: { total: totalCalculado },
        include: { detalles: true } // Devolvemos el pedido con sus detalles
      });
    });
  }
}