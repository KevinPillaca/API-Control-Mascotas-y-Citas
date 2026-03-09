import { Request, Response } from "express";
import { CitasService } from "./citas.service";

export class CitasController {
  private citasService: CitasService;

  constructor() {
    this.citasService = new CitasService();
  }

// POST(CREAR CITAS)
  public create = async ({ body }: Request, res: Response) => {
    try {
      const response = await this.citasService.createCita(body);
      return res.status(201).json(response);
    } catch (error: any) {
      console.error("[Create Cita Error]:", error.message);
      return res.status(500).json({ 
        message: "Error al crear la cita. Verifique que el ID de la mascota sea correcto." 
      });
    }
  };

// GET(LISTAR CITAS)
public list = async (_req: Request, res: Response) => {
    try {
      const response = await this.citasService.getAllCitas();
      return res.status(200).json(response);
    } catch (error: any) {
      console.error("[List Citas Error]:", error.message);
      return res.status(500).json({ message: "Error al obtener la lista de citas" });
    }
  };

// PUT (LISTAR CITAS)
public update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await this.citasService.updateCita(Number(id), req.body);
    return res.status(200).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: "Error al actualizar la cita" });
  }
};

// PUT (ELIMINAR CITAS)
public delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await this.citasService.deleteCita(Number(id));
    
    return res.status(200).json({ 
      message: "Cita eliminada correctamente" 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      message: "No se pudo eliminar la cita. Es posible que ya no exista." 
    });
  }
};
}