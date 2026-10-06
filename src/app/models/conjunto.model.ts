export interface GastoComun {
  id: string;
  departamento: string;
  mes: string;
  monto: number;
  estado: 'Pendiente' | 'Pagado';
}

export interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
}
