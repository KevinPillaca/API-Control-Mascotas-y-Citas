export class CreateMascotaDTO {
  constructor(
    public nombre: string,
    public especie: string,
    public cliente_id: number,
    public edad: number,  
    public peso: number,  
    public raza?: string   
  ) {}
}

export class UpdateMascotaDTO {
  constructor(
    public nombre?: string,
    public especie?: string,
    public raza?: string,
    public edad?: number,
    public peso?: number,
    public cliente_id?: number // Por si acaso se equivocaron de dueño al registrar
  ) {}
}