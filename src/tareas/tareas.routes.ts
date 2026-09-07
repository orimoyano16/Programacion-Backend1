import { Router } from "express";  
import { TareasService } from "./tareas.service";
import { validarCrearTarea } from "./tarea";

export function crearTareasRouter(service: TareasService): Router {  
  const router = Router();  
  
  router.get("/", (_request, response) => {  
    response.status(200).json({ data: service.obtenerTodas() });  
  });  
  
  router.get("/:id", (request, response) => {  
    const tarea = service.obtenerPorId(Number(request.params.id));  
    response.status(200).json({ data: tarea });  
  });  
  
  router.post("/", (request, response) => {  
    const dto = validarCrearTarea(request.body);  
    const tarea = service.crear(dto);  
    response.location(`/api/v1/tareas/${tarea.id}`).status(201).json({ data: tarea });  
  });  
  
  router.delete("/:id", (request, response) => {  
    service.eliminar(Number(request.params.id));  
    response.status(204).send();  
  });  
  
  return router;  
}