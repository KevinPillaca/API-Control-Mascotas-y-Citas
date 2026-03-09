import { PrismaClient } from "@prisma/client";
import { CreateCitaDTO,UpdateCitaDTO } from "./citas.dto";

const prisma = new PrismaClient();

export class CitasService {

// CONECTAR BD (CREAR CITAS)
  public createCita = async (data: CreateCitaDTO) => {
    return await prisma.citas.create({
      data: {
        fecha: new Date(data.fecha), // Conversión de seguridad
        motivo: data.motivo,
        estado: data.estado || 'pendiente',
        mascota_id: data.mascota_id
      }
    });
  };

// CONECTAR BD (LISTAR CITAS)
public getAllCitas = async () => {
    return await prisma.citas.findMany({
      include: {
        mascotas: {
          select: {
            nombre: true,
            especie: true,
            clientes: { // Relación anidada: Cita -> Mascota -> Cliente
              select: {
                nombre: true,
                telefono: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha: 'asc' // Ordenamos para ver primero las citas más próximas
      }
    });
  };

// CONECTAR BD (EDITAR CITAS)
public updateCita = async (id: number, data: UpdateCitaDTO) => {
  return await prisma.citas.update({
    where: { id },
    data: {
      ...data,
      // Si viene una fecha, la convertimos a objeto Date
      ...(data.fecha && { fecha: new Date(data.fecha) })
    },
  });
};

// CONECTAR BD (DELETE CITAS)
public deleteCita = async (id: number) => {
  return await prisma.citas.delete({
    where: { id },
  });
};
}