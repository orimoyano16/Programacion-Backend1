import request from 'supertest';
import express from 'express';
import { crearTareasRouter } from './tareas.routes';
import { errorHandler } from '../middlewares/error-handler';

// 1. Configuramos una app Express de prueba (sin levantar el servidor real)
const app = express();
app.use(express.json());

// 2. Creamos un "Mock" (Simulación) del Servicio
const mockTareasService = {
  crear: jest.fn(), // Función simulada para observar qué le llega
  obtenerTodas: jest.fn(),
  obtenerPorId: jest.fn(),
  eliminar: jest.fn()
};

// 3. Inyectamos nuestro Mock en el Router
app.use('/api/v1/tareas', crearTareasRouter(mockTareasService as any));
app.use(errorHandler);

describe('Pruebas de Endpoints (Punto 14) con Mocks', () => {

  beforeEach(() => {
    // Limpiamos los mocks antes de cada prueba para que no se contaminen
    jest.clearAllMocks();
  });

  // CASO: Crear con datos válidos -> 201 y recurso creado.
  it('Debe crear una tarea válida y retornar HTTP 201', async () => {
    // Le decimos a nuestro "mock" qué tiene que devolver cuando el controlador lo llame
    const tareaMockeada = { id: 1, titulo: 'Estudiar API', prioridad: 'alta', completada: false };
    mockTareasService.crear.mockReturnValue(tareaMockeada);

    const respuesta = await request(app)
      .post('/api/v1/tareas')
      .send({ titulo: 'Estudiar API', prioridad: 'alta' });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.data.id).toBe(1);
    expect(respuesta.body.data.titulo).toBe('Estudiar API');
    
    // Verificamos que el controlador realmente haya intentado llamar al servicio
    expect(mockTareasService.crear).toHaveBeenCalledTimes(1);
  });

  // CASO: Crear sin título -> 422.
  it('Debe retornar HTTP 422 si la validación del título falla', async () => {
    const respuesta = await request(app)
      .post('/api/v1/tareas')
      .send({ prioridad: 'alta' }); // Falta el título

    expect(respuesta.status).toBe(422);
    expect(respuesta.body.error.code).toBe('INVALID_TITLE');
    
    // Verificamos que el servicio NUNCA se llamó (porque frenó en la validación)
    expect(mockTareasService.crear).not.toHaveBeenCalled();
  });
  
  // CASO: Invocar ruta desconocida -> 404.
  it('Debe retornar 404 si la ruta no existe', async () => {
    const respuesta = await request(app)
      .get('/api/v1/ruta-falsa-inexistente');
      
    expect(respuesta.status).toBe(404);
  });

});