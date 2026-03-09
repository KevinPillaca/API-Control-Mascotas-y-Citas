export class CreateDiagnosticoDTO {
  constructor(
    public descripcion: string,
    public cita_id: number,
    public tratamiento?: string,
    public medicamentos?: string,
    public observaciones?: string
  ) {}
}

export class UpdateDiagnosticoDTO {
  constructor(
    public descripcion?: string,
    public tratamiento?: string,
    public medicamentos?: string,
    public observaciones?: string
  ) {}
}