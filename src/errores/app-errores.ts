export class AppError extends Error {  
  constructor(  
    public readonly status: number,  
    public readonly code: string,  
    message: string,  
    public readonly details: unknown[] = []  
  ) {  
    super(message),
    Object.setPrototypeOf(this, AppError.prototype);
  }  
}