import prisma from "../../config/db";
import { CreateClienteDTO } from "./clientes.dto";
import { UpdateClienteDTO } from "./clientes.dto";
export class ClientesService {
    
 // CONECTAR BD (CREAR CLIENTE)
  public createCliente = async (data: CreateClienteDTO) => {
    // ORM PRISMA
    const nuevoCliente = await prisma.clientes.create({
      data: {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
      },
    });
    return nuevoCliente;
   };

  // CONECTAR BD (LISTAR CLIENTE)
  public getAllClientes = async () => {
        return await prisma.clientes.findMany(); // SELECT * FROM clientes
    };

    // OBTENER UN CLIENTE POR ID
  public getClienteById = async (id: number) => {
    return await prisma.clientes.findUnique({
      where: { id },
    });
  };

  // CONECTAR BD (EDITAR CLIENTE)
  public updateCliente = async (id: number, data: UpdateClienteDTO) => {
  return await prisma.clientes.update({
    where: { id },
    data: data, 
  });
 };

 // CONECTAR BD (DELETE CLIENTE)
 public deleteCliente = async (id: number) => {
  return await prisma.clientes.delete({
    where: { id },
  });
 };
}

