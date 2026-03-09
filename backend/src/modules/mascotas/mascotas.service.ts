import prisma from "../../config/db";
import { CreateMascotaDTO } from "./mascotas.dto";
import { UpdateMascotaDTO } from "./mascotas.dto";

export class MascotasService {

// CONECTAR BD (CREAR MASCOTAS)
  public createMascota = async (data: CreateMascotaDTO) => {
    return await prisma.mascotas.create({
      data: {
        nombre: data.nombre,
        especie: data.especie,
        raza: data.raza,
        edad: data.edad,
        peso: data.peso,
        cliente_id: data.cliente_id,
      },
    });
  };

// CONECTAR BD (LISTAR MASCOTAS)
  public getAllMascotas = async () => {
  return await prisma.mascotas.findMany({
    include: {
      clientes: {
        select: {
          id: true,
          nombre: true,
          telefono: true
        }
      },
    },
  });
 };

// CONECTAR BD (EDITAR MASCOTAS)
 public updateMascota = async (id: number, data: UpdateMascotaDTO) => {
  return await prisma.mascotas.update({
    where: { id },
    data: data, // Prisma ignorará los campos que vengan 'undefined'
  });
 };

// CONECTAR BD (DELETE MASCOTAS)
 public deleteMascota = async (id: number) => {
    return await prisma.mascotas.delete({
      where: { id },
    });
  };

}