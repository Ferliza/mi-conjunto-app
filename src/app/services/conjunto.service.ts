import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GastoComun, Anuncio } from '../models/conjunto.model';

@Injectable({
  providedIn: 'root'
})
export class ConjuntoService {

  private gastosSubject = new BehaviorSubject<GastoComun[]>([
    { id: '1', departamento: 'Depto 101', mes: 'Octubre', monto: 45000, estado: 'Pendiente' },
    { id: '2', departamento: 'Casa 04', mes: 'Octubre', monto: 50000, estado: 'Pagado' }
  ]);

  private anunciosSubject = new BehaviorSubject<Anuncio[]>([
    { id: '1', titulo: 'Corte de agua programado', descripcion: 'El jueves habrá corte de agua desde las 10:00 hrs.' }
  ]);

  constructor() { }

  getGastos(): Observable<GastoComun[]> {
    return this.gastosSubject.asObservable();
  }

  getAnuncios(): Observable<Anuncio[]> {
    return this.anunciosSubject.asObservable();
  }

  getGastoById(id: string): GastoComun | undefined {
    return this.gastosSubject.getValue().find(gasto => gasto.id === id);
  }

  agregarGasto(nuevoGasto: Omit<GastoComun, 'id'>) {
    const gastosActuales = this.gastosSubject.getValue();
    const gastoCreado: GastoComun = {
      ...nuevoGasto,
      id: Date.now().toString()
    };
    this.gastosSubject.next([...gastosActuales, gastoCreado]);
  }

  updateEstadoGasto(id: string, nuevoEstado: 'Pendiente' | 'Pagado') {
    const gastosActuales = this.gastosSubject.getValue();
    const gastosActualizados = gastosActuales.map(gasto => {
      if (gasto.id === id) {
        return { ...gasto, estado: nuevoEstado };
      }
      return gasto;
    });
    this.gastosSubject.next(gastosActualizados);
  }

  eliminarGasto(id: string) {
    const gastosActuales = this.gastosSubject.getValue();
    const gastosFiltrados = gastosActuales.filter(gasto => gasto.id !== id);
    this.gastosSubject.next(gastosFiltrados);
  }
}
