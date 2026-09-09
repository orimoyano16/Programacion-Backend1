import { Given, When, Then, BeforeAll } from '@cucumber/cucumber';
import request from 'supertest';
import express from 'express';
import { crearTareasRouter } from '../../src/tareas/tareas.routes';
import { errorHandler } from '../../src/middlewares/error-handler';
// Necesitas importar el framework de aserciones de Node o Jest. Usaremos expect de una librería standalone o el nativo.
import assert from 'assert';

let app: express.Express;
let payload: any;
let response: request.Response;

// Configuramos la app mockeada antes de correr los escenarios
BeforeAll(() => {
  app = express();
  app.use(express.json());
  
  const mockTareasService = {
    crear: (dto: any) => ({ id: 1, ...dto, completada: false }),
    obtenerTodas: () => [],
    obtenerPorId: () => ({}),
    eliminar: () => {}
  };

  app.use('/api/v1/tareas', crearTareasRouter(mockTareasService as any));
  app.use(errorHandler);
});

Given('que tengo el siguiente payload para una tarea:', function (docString: string) {
  payload = JSON.parse(docString);
});

When('envío una petición POST a {string}', async function (ruta: string) {
  response = await request(app)
    .post(ruta)
    .send(payload);
});

Then('el código de respuesta debe ser {int}', function (statusCode: number) {
  assert.strictEqual(response.status, statusCode);
});

Then('el cuerpo de la respuesta debe contener la propiedad {string}', function (propiedad: string) {
  assert.ok(response.body.data[propiedad] !== undefined);
});

Then('el título de la tarea creada debe ser {string}', function (tituloEsperado: string) {
  assert.strictEqual(response.body.data.titulo, tituloEsperado);
});