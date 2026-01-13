import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import type { Response } from 'express';
import { Prisma } from '@prisma/client';

/**
 * HUMAN REVIEW:
 * Prisma lanza errores técnicos (P2002, P2003...) que de forma predeterminada
 * terminan como 500. Este filtro traduce los códigos comunes a respuestas HTTP
 * más claras, para evitar "happy path" únicamente y mejorar DX del frontend.
 */
@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Known request errors (e.g. unique constraint)
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const code: string = exception.code;

      // Unique constraint failed
      if (code === 'P2002') {
        response
          .status(HttpStatus.CONFLICT)
          .json({ message: 'Resource already exists', code });
        return;
      }

      // Foreign key constraint failed
      if (code === 'P2003') {
        response
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid reference (FK)', code });
        return;
      }

      // Record not found
      if (code === 'P2025') {
        response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Resource not found', code });
        return;
      }

      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Database error', code });
      return;
    }

    // Validation errors
    if (exception instanceof Prisma.PrismaClientValidationError) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Invalid request payload' });
      return;
    }

    // Fallback
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unexpected error' });
    return;
  }
}
