export class AppError extends Error {  
  public readonly status: number;
  public readonly code: string;
  public readonly details: unknown[];

  constructor(status: number, code: string, message: string, details: unknown[] = []) {  
    // 1. SIEMPRE se debe llamar a super() primero al heredar
    super(message);  
    
    // 2. Luego se asignan las propiedades a 'this'
    this.status = status;
    this.code = code;
    this.details = details;

    // 3. Arreglo para que instanceof funcione correctamente en TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }  
}