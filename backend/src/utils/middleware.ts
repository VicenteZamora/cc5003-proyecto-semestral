import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "./config";

export const withUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      next();
    } else {
      const decodedToken = jwt.verify(token, config.JWT_SECRET);
      const csrfToken = req.headers["x-csrf-token"];
      if (
        typeof decodedToken === "object" &&
        decodedToken.id &&
        decodedToken.csrf == csrfToken
      ) {
        req.userId = decodedToken.id;
        next();
      } else {
        res.status(401).json({ error: "invalid token" });
      }
    }
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
};

export const errorHandler = (
  error: { name: string; message: string; code?: number },
  req: Request,
  response: Response,
  next: NextFunction,
) => {
  console.error("Error:", error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "ID mal formateado" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.code === 11000) {
    return response.status(400).json({
      error: "El username o email ya está registrado",
    });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Token inválido" });
  }

  if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "Token expirado" });
  }

  response.status(500).json({ error: "Error interno del servidor" });
};

export const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV !== "test") {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
  }
  next();
};

export const unknownEndpoint = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.status(404).send({ error: "unknown endpoint" });
};
