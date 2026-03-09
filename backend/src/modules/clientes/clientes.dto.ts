export class CreateClienteDTO {
  constructor(
    public nombre: string,
    public telefono: string,
    public direccion: string,
    public email?: string 
  ) {}
}

export class UpdateClienteDTO {
  constructor(
    public nombre?: string,
    public telefono?: string,
    public direccion?: string,
    public email?: string
  ) {}
}