import { Request, Response } from "express";
import { ClientesService } from "./clientes.service";

export class ClientesController {
  private clientesService: ClientesService;

  constructor() {
    this.clientesService = new ClientesService();
  }
// POST(CREAR CLIENTE)
  public create = async ({ body }: Request, res: Response) => {
    try {
      const response = await this.clientesService.createCliente(body);
      return res.status(201).json(response); // 201 "Creado con éxito"
    } catch (error: any) {
      console.error("[Create Cliente Error]:", error.message);
      return res.status(500).json({ message: "Error al crear el cliente" });
    }
  };

  // GET(LISTAR CLIENTE)
  public list = async (_req: Request, res: Response) => {
    try {
      const response = await this.clientesService.getAllClientes();
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ message: "Error al obtener clientes" });
    }
  };

  // GET: OBTENER UNO POR ID
  public getDetail = async ({ params }: Request, res: Response) => {
    try {
      const { id } = params;
      const response = await this.clientesService.getClienteById(Number(id));
      
      if (!response) return res.status(404).json({ message: "Cliente no encontrado" });
      
      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ message: "Error al obtener detalle del cliente" });
    }
  };

  // PUTH (EDITAR CLIENTE)
  public update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Sacamos el ID de la URL (/clientes/1)
    const { body } = req;      // Sacamos los datos del JSON
    
    const response = await this.clientesService.updateCliente(Number(id), body);
    return res.status(200).json(response);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar el cliente" });
  }
 };
 
 // DELETE (ELIMINAR CLIENTE)
  public delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await this.clientesService.deleteCliente(Number(id));
    
    // 204 significa "Petición exitosa, pero no hay contenido que devolver"
    // O puedes usar 200 con un mensaje de confirmación
    return res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).json({ message: "Error al eliminar el cliente o no existe" });
    }
  };
}