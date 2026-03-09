export class CreateCitaDTO {
  constructor(
    public fecha: Date,           // Formato ISO: "2026-03-15T10:00:00Z"
    public mascota_id: number,    // El ID de la mascota que viene a consulta
    public motivo?: string,       // Opcional, según tu schema
    public estado?: 'pendiente' | 'atendida' | 'cancelada'
  ) {}
}

export class UpdateCitaDTO {
  constructor(
    public fecha?: Date,
    public motivo?: string,
    public estado?: 'pendiente' | 'atendida' | 'cancelada'
  ) {}
}