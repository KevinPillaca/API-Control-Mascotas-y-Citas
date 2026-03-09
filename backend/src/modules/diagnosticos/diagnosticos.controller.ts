import { Request, Response } from "express";
import { DiagnosticosService } from "./diagnosticos.service";

export class DiagnosticosController {
  private diagService: DiagnosticosService;

  constructor() {
    this.diagService = new DiagnosticosService();
  }
// POST(CREAR DIAGNOSTICOS)
  public create = async ({ body }: Request, res: Response) => {
    try {
      const response = await this.diagService.createDiagnostico(body);
      return res.status(201).json(response);
    } catch (error: any) {
      // Si intentas crear un segundo diagnóstico para la misma cita, saltará el error por el UNIQUE
      return res.status(500).json({ 
        message: "Error al crear diagnóstico. Verifique si la cita ya tiene uno asignado." 
      });
    }
  };

// GET(LISTAR DIAGNOSTICOS)
 public list = async (_req: Request, res: Response) => {
  try {
    const response = await this.diagService.getAllDiagnosticos(); 
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al obtener diagnósticos" });
  }
 };

// GET(LISTAR DIAGNOSTICOS)
 public update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Sacamos el ID de la URL (ej: /diagnosticos/1)
    
    // Llamamos al servicio pasando el ID y el body (que cumple con el DTO)
    const response = await this.diagService.updateDiagnostico(Number(id), req.body);
    
    return res.status(200).json({
      message: "Cambios guardados correctamente",
      data: response
    });
  } catch (error: any) {
    console.error("[Update Error]:", error.message);
    return res.status(500).json({ message: "Error al actualizar los datos del diagnóstico" });
  }
 };
// GET(ELIMINAR DIAGNOSTICOS)
public delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await this.diagService.deleteDiagnostico(Number(id));
    
    return res.status(200).json({ 
      message: "Diagnóstico eliminado correctamente" 
    });
  } catch (error: any) {
    console.error("[Delete Diagnostico Error]:", error.message);
    return res.status(500).json({ 
      message: "No se pudo eliminar el diagnóstico. Es posible que ya no exista." 
    });
  }
};
}
