import { AppError } from '../errores/app-errores';

// DTO significa Data Transfer Object y define los datos que entran o salen
export interface CrearTareaDto {  
  titulo: string;  
  prioridad: "baja" | "media" | "alta";  
}  
  
export interface ActualizarTareaDto {  
  titulo?: string;  
  prioridad?: "baja" | "media" | "alta";  
  completada?: boolean;  
}

export interface Tarea {  
  id: number;  
  titulo: string;  
  prioridad: "baja" | "media" | "alta";  
  completada: boolean;  
  fechaCreacion: string;  
}

// Los datos externos deben comprobarse en tiempo de ejecución
export function validarCrearTarea(datos: unknown): CrearTareaDto {  
  if (typeof datos !== "object" || datos === null) {  
    throw new AppError(400, "INVALID_BODY", "El cuerpo debe ser un objeto JSON");  
  }  
  
  const objeto = datos as Record<string, unknown>;  
  
  if (typeof objeto.titulo !== "string" || objeto.titulo.trim().length < 3) {  
    throw new AppError(422, "INVALID_TITLE", "El título debe tener al menos tres caracteres");  
  }  
  
  const prioridades = ["baja", "media", "alta"];  
  if (typeof objeto.prioridad !== "string" || !prioridades.includes(objeto.prioridad)) {  
    throw new AppError(422, "INVALID_PRIORITY", "La prioridad no es válida");  
  }  
  
  return {  
    titulo: objeto.titulo.trim(),  
    prioridad: objeto.prioridad as CrearTareaDto["prioridad"]  
  };  
}