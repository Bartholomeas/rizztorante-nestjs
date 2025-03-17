import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exceptionResponse = exception.getResponse();
    const status = exception.getStatus();

    let responseBody: {
      statusCode: number;
      message: string;
      name: string;
      errors?: string | string[];
    } = {
      statusCode: status,
      message: exception?.message,
      name: exception.name,
    };

    if (Array.isArray((exceptionResponse as { message?: string | string[] }).message)) {
      responseBody = {
        statusCode: status,
        message: "Validation failed",
        errors: (exceptionResponse as { message: string | string[] })?.message ?? "",
        name: exception.name,
      };
    }

    response.status(status).send(responseBody);
  }
}
