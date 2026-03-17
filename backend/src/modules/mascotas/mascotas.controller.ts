import { Request, Response } from "express";
import { MascotasService } from "./mascotas.service";

export class MascotasController {
  private mascotasService: MascotasService;

  constructor() {
    this.mascotasService = new MascotasService();
  }

  // POST(CREAR MASCOTA)
  public create = async ({ body }: Request, res: Response) => {
    try {
      //crear la mascota con los datos del body
      const response = await this.mascotasService.createMascota(body);
      return res.status(201).json(response); 
    } catch (error: any) {
      console.error("[Create Mascota Error]:", error.message);
      
      // Si el cliente_id no existe, lanza este error"
      return res.status(500).json({ 
        message: "Error al registrar la mascota. Verifique que el cliente existe." 
      });
    }
  };
  
  // GET(LISTAR MASCOTAS)
  public list = async (_req: Request, res: Response) => {
    try {
      const response = await this.mascotasService.getAllMascotas();
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ message: "Error al obtener la lista de mascotas" });
    }
  };

 // PUHT(EDITAR MASCOTAS)
 public update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await this.mascotasService.updateMascota(Number(id), req.body);
    
    return res.status(200).json({
      message: "Mascota actualizada correctamente",
      data: response
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar la mascota" });
  }
 };
 
 // DELETE(ELIMINAR MASCOTA)
 public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      await this.mascotasService.deleteMascota(Number(id));
      
      return res.status(200).json({ 
        message: "Mascota eliminada exitosamente" 
      });
    } catch (error: any) {
      console.error("[Delete Mascota Error]:", error.message);
      
      // Error común: Intentar borrar un ID que no existe
      return res.status(500).json({ 
        message: "No se pudo eliminar la mascota. Verifique si el ID es correcto." 
      });
    }
  };


}