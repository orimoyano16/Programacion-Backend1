import { Tarea } from './tarea';

export class TareasRepository {  
  private readonly tareas: Tarea[] = [];  
  
  guardar(tarea: Tarea): Tarea {  
    this.tareas.push(tarea);  
    return tarea;  
  }  
  
  buscarPorId(id: number): Tarea | undefined {  
    return this.tareas.find((tarea) => tarea.id === id);  
  }  
  
  obtenerTodas(): Tarea[] {  
    return [...this.tareas];  
  }  
  
  siguienteId(): number {  
    return this.tareas.length + 1;  
  }  
}