# language: es
Característica: Gestión de Tareas
  Como usuario de la API
  Quiero poder crear nuevas tareas
  Para organizar mi trabajo académico

  Escenario: Crear una tarea con datos válidos
    Dado que tengo el siguiente payload para una tarea:
      """
      {
        "titulo": "Estudiar API",
        "prioridad": "alta"
      }
      """
    Cuando envío una petición POST a "/api/v1/tareas"
    Entonces el código de respuesta debe ser 201
    Y el cuerpo de la respuesta debe contener la propiedad "id"
    Y el título de la tarea creada debe ser "Estudiar API"

  Escenario: Error al crear una tarea sin título
    Dado que tengo el siguiente payload para una tarea:
      """
      {
        "prioridad": "alta"
      }
      """
    Cuando envío una petición POST a "/api/v1/tareas"
    Entonces el código de respuesta debe ser 422