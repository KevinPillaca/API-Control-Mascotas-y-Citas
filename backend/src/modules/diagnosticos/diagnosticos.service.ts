import prisma from "../../config/db";
import { CreateDiagnosticoDTO, UpdateDiagnosticoDTO } from "./diagnosticos.dto";

export class DiagnosticosService {

// CONECTAR BD (CREAR DIAGNOSTICOS)
  public createDiagnostico = async (data: CreateDiagnosticoDTO) => {
    return await prisma.diagnosticos.create({
      data: data,
      include: {
        citas: {
          include: {
            mascotas: true // Para saber a quién se le dio este diagnóstico
          }
        }
      }
    });
  };

// CONECTAR BD (LISTAR DIAGNOSTICOS)
 public getAllDiagnosticos = async () => {
    return await prisma.diagnosticos.findMany({
      include: {
        citas: {
          include: {
            mascotas: {
              select: {
                nombre: true,
                especie: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  };

 public getDiagnosticoByCita = async (citaId: number) => {
    return await prisma.diagnosticos.findUnique({
      where: { cita_id: citaId },
      include: {
        citas: true
      }
    });
  };

// CONECTAR BD (EDITAR DIAGNOSTICOS) 
 public updateDiagnostico = async (id: number, data: UpdateDiagnosticoDTO) => {
  return await prisma.diagnosticos.update({
    where: { id },
    data: {
      ...data // Esparcimos los datos del DTO
    },
  });
 };

// CONECTAR BD (ELIMINAR DIAGNOSTICOS)
 public deleteDiagnostico = async (id: number) => {
  return await prisma.diagnosticos.delete({
    where: { id },
  });
};
}