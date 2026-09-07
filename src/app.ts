import express from 'express';
import { TareasRepository } from './tareas/tareas.repository';
import { TareasService } from './tareas/tareas.service';
import { crearTareasRouter } from './tareas/tareas.routes';
import { errorHandler } from './middlewares/error-handler';

export const app = express();

// La inyección de dependencias proporciona a una clase los objetos que necesita
const repository = new TareasRepository();  
const service = new TareasService(repository);  

// Configuración de middlewares y cuerpo de la petición
app.use(express.json());  
app.use("/api/v1/tareas", crearTareasRouter(service));

// El middleware de errores se registra después de las rutas
app.use(errorHandler);