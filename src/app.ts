import express from 'express';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { PedidosService } from './pedidos/pedidos.service';
import { crearPedidosRouter } from './pedidos/pedidos.routes';
import { errorHandler } from './middlewares/error-handler';

export const app = express();
app.use(express.json()); // 1. Middleware para JSON

// 2. Integrar Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 3. Inyección de dependencias con Prisma
const prisma = new PrismaClient();
const pedidosService = new PedidosService(prisma);

// 4. Registrar Rutas
app.use('/api/pedidos', crearPedidosRouter(pedidosService));

// 5. Manejo centralizado de errores
app.use(errorHandler);