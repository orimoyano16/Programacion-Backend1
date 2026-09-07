import { CrearTareaDto, Tarea } from './tarea';
import { TareasRepository } from './tareas.repository';
import { AppError } from '../errores/app-errores';

export class TareasService {  
  constructor(private readonly repository: TareasRepository) {}  
  
  crear(dto: CrearTareaDto): Tarea {  
    const tarea: Tarea = {  
      id: this.repository.siguienteId(),  
      titulo: dto.titulo,  
      prioridad: dto.prioridad,  
      completada: false,  
      fechaCreacion: new Date().toISOString()  
    };  
  
    return this.repository.guardar(tarea);  
  }

  obtenerTodas(): Tarea[] {
    return this.repository.obtenerTodas();
  }

  obtenerPorId(id: number): Tarea {
    const tarea = this.repository.buscarPorId(id);
    if (!tarea) {  
      throw new AppError(404, "TASK_NOT_FOUND", "La tarea solicitada no existe");  
    }
    return tarea;
  }

  eliminar(id: number): void {
     // Implementación omitida en el documento base
  }
}