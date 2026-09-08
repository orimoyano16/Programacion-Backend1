import { Router } from "express";
import { PedidosService } from "./pedidos.service";
import { AppError } from "../errores/app-errores"; // Asegúrate de que esta ruta sea correcta

export function crearPedidosRouter(service: PedidosService): Router {
  const router = Router();

  // Endpoint POST /api/pedidos solicitado en la consigna
  router.post("/", async (req, res, next) => {
    try {
      // Extraer datos del cuerpo de la petición (JSON)
      const { usuarioId, productosComprados } = req.body;

      // Validar datos de entrada (Si falta información se devuelve 400 Bad Request)
      if (!usuarioId || !Array.isArray(productosComprados) || productosComprados.length === 0) {
        throw new AppError(400, "INVALID_DATA", "Datos de entrada incompletos");
      }

      // Procesar el pedido
      const pedido = await service.procesarCheckout(usuarioId, productosComprados);
      
      // Retornar el pedido finalizado con el código 201 Created
      res.status(201).json({ data: pedido });
    } catch (error) {
      // Manejar el error de falta de stock o cualquier otro (Pasarlo al manejador central)
      if (error instanceof Error && error.message.includes("Stock")) {
         next(new AppError(400, "INSUFFICIENT_STOCK", error.message));
         return;
      }
      next(error); 
    }
  });

  return router;
}