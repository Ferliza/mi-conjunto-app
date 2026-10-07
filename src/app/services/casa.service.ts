import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Casa } from '../models/casa.model';

@Injectable({
  providedIn: 'root'
})
export class CasaService {
  private readonly STORAGE_KEY = 'casas_lote_1';
  private casasSubject = new BehaviorSubject<Casa[]>([]);
  casas$ = this.casasSubject.asObservable();

  constructor() {
    this.cargarCasas();
  }

  /**
   * Carga la lista de casas desde el almacenamiento local.
   */
  async cargarCasas(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      if (value) {
        const casasGuardadas: Casa[] = JSON.parse(value);
        this.casasSubject.next(casasGuardadas);
      } else {
        // Datos de prueba iniciales la primera vez que abre la app
        const datosIniciales: Casa[] = [
          {
            id: '1',
            direccion: 'Pasaje Los Sauces 101',
            propietario: 'Juan Pérez',
            rut: '12.345.678-9',
            email: 'juan.perez@email.com',
            telefono: '+56912345678'
          }
        ];
        await this.guardarEnStorage(datosIniciales);
        this.casasSubject.next(datosIniciales);
      }
    } catch (error) {
      console.error('Error al cargar las casas desde Preferences:', error);
    }
  }

  /**
   * Obtiene la lista actual de casas en formato de arreglo.
   */
  obtenerCasasActuales(): Casa[] {
    return this.casasSubject.value;
  }

  /**
   * Busca una casa específica por su ID.
   */
  obtenerCasaPorId(id: string): Casa | undefined {
    return this.casasSubject.value.find(c => c.id === id);
  }

  /**
   * Agrega una nueva casa a la lista y la guarda localmente.
   */
  async agregarCasa(casa: Omit<Casa, 'id'>): Promise<void> {
    try {
      const nuevaCasa: Casa = {
        ...casa,
        id: Date.now().toString()
      };
      const casasActualizadas = [nuevaCasa, ...this.casasSubject.value];
      await this.guardarEnStorage(casasActualizadas);
      this.casasSubject.next(casasActualizadas);
    } catch (error) {
      console.error('Error al agregar casa:', error);
    }
  }

  /**
   * Actualiza la información de una casa existente.
   */
  async actualizarCasa(casaActualizada: Casa): Promise<void> {
    try {
      const casas = this.casasSubject.value.map(c =>
        c.id === casaActualizada.id ? { ...casaActualizada } : c
      );
      await this.guardarEnStorage(casas);
      this.casasSubject.next(casas);
    } catch (error) {
      console.error('Error al actualizar casa:', error);
    }
  }

  /**
   * Elimina una casa de la lista por su ID.
   */
  async eliminarCasa(id: string): Promise<void> {
    try {
      const casasActualizadas = this.casasSubject.value.filter(c => c.id !== id);
      await this.guardarEnStorage(casasActualizadas);
      this.casasSubject.next(casasActualizadas);
    } catch (error) {
      console.error('Error al eliminar casa:', error);
    }
  }

  /**
   * Guardado privado en @capacitor/preferences
   */
  private async guardarEnStorage(casas: Casa[]): Promise<void> {
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(casas)
    });
  }
}
