import { ErrorRequestHandler } from 'express';
import { AppError } from '../errores/app-errores';

export const errorHandler: ErrorRequestHandler = (  
  error, _request, response, _next  
) => {  
  if (error instanceof AppError) {  
    response.status(error.status).json({  
      error: { code: error.code, message: error.message, details: error.details }  
    });  
    return;  
  }  
  
  console.error(error);  
  response.status(500).json({  
    error: { code: "INTERNAL_ERROR", message: "Ocurrió un error interno" }  
  });  
};