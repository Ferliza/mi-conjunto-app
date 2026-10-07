import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,
  IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonBadge, IonIcon, IonGrid, IonRow, IonCol, IonSearchbar, IonChip, IonAvatar
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  trashOutline, homeOutline, cashOutline, megaphoneOutline, personOutline,
  mailOutline, callOutline, cardOutline, addCircleOutline, searchOutline,
  businessOutline, checkmarkCircleOutline, timeOutline, gridOutline,
  chatboxEllipsesOutline, paperPlaneOutline, locationOutline, shieldCheckmarkOutline, sendOutline
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { CasaService } from '../services/casa.service';
import { Casa } from '../models/casa.model';

export interface GastoComun {
  id: string;
  departamento: string;
  mes: string;
  monto: number;
  estado: 'Pagado' | 'Pendiente';
}

export interface MensajeContacto {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  fecha: string;
}

export interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton,
    IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonList, IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton,
    IonBadge, IonIcon, IonGrid, IonRow, IonCol, IonSearchbar, IonChip, IonAvatar
  ]
})
export class HomePage implements OnInit {
  nombreCondominio: string = '"Lote 1" Villa los Sauces II';
  segmentoSeleccionado: string = 'inicio'; // Comienza en el Menú Principal

  private readonly GASTOS_KEY = 'gastos_lote_1';
  private readonly MENSAJES_KEY = 'mensajes_contacto_lote_1';

  casas: Casa[] = [];
  gastos: GastoComun[] = [];
  mensajesEnviadosList: MensajeContacto[] = [];
  filtroBusqueda: string = '';

  anuncios: Anuncio[] = [
    {
      id: '1',
      titulo: 'Asamblea General Ordinaria',
      contenido: 'Se cita a todos los copropietarios de la Villa los Sauces II a la asamblea del sábado a las 18:00 hrs.',
      fecha: '08-10-2026'
    },
    {
      id: '2',
      titulo: 'Mantenimiento de Portón Eléctrico',
      contenido: 'Se realizarán trabajos de reparación en el acceso principal el día jueves entre 09:00 y 12:00 hrs.',
      fecha: '06-10-2026'
    }
  ];

  casaForm!: FormGroup;
  gastoForm!: FormGroup;
  contactoForm!: FormGroup;

  mensajeEnviado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private casaService: CasaService
  ) {
    addIcons({
      trashOutline, homeOutline, cashOutline, megaphoneOutline, personOutline,
      mailOutline, callOutline, cardOutline, addCircleOutline, searchOutline,
      businessOutline, checkmarkCircleOutline, timeOutline, gridOutline,
      chatboxEllipsesOutline, paperPlaneOutline, locationOutline, shieldCheckmarkOutline, sendOutline
    });
  }

  async ngOnInit() {
    this.inicializarFormularios();

    this.casaService.casas$.subscribe(data => {
      this.casas = data;
    });

    await this.cargarGastos();
    await this.cargarMensajes();
  }

  private inicializarFormularios() {
    this.casaForm = this.fb.group({
      direccion: ['', [Validators.required, Validators.minLength(3)]],
      propietario: ['', [Validators.required, Validators.minLength(3)]],
      rut: [''],
      email: ['', [Validators.email]],
      telefono: ['']
    });

    this.gastoForm = this.fb.group({
      departamento: ['', [Validators.required]],
      mes: ['', [Validators.required]],
      monto: ['', [Validators.required, Validators.min(1)]]
    });

    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      asunto: ['consulta', [Validators.required]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  cambiarSeccion(seccion: string) {
    this.segmentoSeleccionado = seccion;
  }

  // === LÓGICA DE CASAS ===
  async guardarCasa() {
    if (this.casaForm.valid) {
      await this.casaService.agregarCasa(this.casaForm.value);
      this.casaForm.reset();
    }
  }

  async eliminarCasa(id: string) {
    await this.casaService.eliminarCasa(id);
  }

  get casasFiltradas(): Casa[] {
    if (!this.filtroBusqueda.trim()) {
      return this.casas;
    }
    const termino = this.filtroBusqueda.toLowerCase();
    return this.casas.filter(c =>
      c.direccion.toLowerCase().includes(termino) ||
      c.propietario.toLowerCase().includes(termino) ||
      (c.rut && c.rut.toLowerCase().includes(termino))
    );
  }

  // === LÓGICA DE GASTOS ===
  async cargarGastos() {
    try {
      const { value } = await Preferences.get({ key: this.GASTOS_KEY });
      if (value) {
        this.gastos = JSON.parse(value);
      } else {
        this.gastos = [
          { id: '1', departamento: 'Pasaje Los Sauces 101', mes: 'Octubre', monto: 45000, estado: 'Pagado' },
          { id: '2', departamento: 'Pasaje Los Sauces 102', mes: 'Octubre', monto: 48000, estado: 'Pendiente' }
        ];
        await Preferences.set({ key: this.GASTOS_KEY, value: JSON.stringify(this.gastos) });
      }
    } catch (error) {
      console.error('Error al cargar gastos comunes:', error);
    }
  }

  async guardarGasto() {
    if (this.gastoForm.valid) {
      const nuevoGasto: GastoComun = {
        id: Date.now().toString(),
        departamento: this.gastoForm.value.departamento,
        mes: this.gastoForm.value.mes,
        monto: Number(this.gastoForm.value.monto),
        estado: 'Pendiente'
      };
      this.gastos = [nuevoGasto, ...this.gastos];
      await Preferences.set({ key: this.GASTOS_KEY, value: JSON.stringify(this.gastos) });
      this.gastoForm.reset();
    }
  }

  async toggleEstadoGasto(gasto: GastoComun) {
    gasto.estado = gasto.estado === 'Pagado' ? 'Pendiente' : 'Pagado';
    await Preferences.set({ key: this.GASTOS_KEY, value: JSON.stringify(this.gastos) });
  }

  async eliminarGasto(id: string) {
    this.gastos = this.gastos.filter(g => g.id !== id);
    await Preferences.set({ key: this.GASTOS_KEY, value: JSON.stringify(this.gastos) });
  }

  get totalGastos(): number {
    return this.gastos.reduce((acc, g) => acc + g.monto, 0);
  }

  // === LÓGICA DE CONTACTO ===
  async cargarMensajes() {
    try {
      const { value } = await Preferences.get({ key: this.MENSAJES_KEY });
      if (value) {
        this.mensajesEnviadosList = JSON.parse(value);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  }

  async enviarContacto() {
    if (this.contactoForm.valid) {
      const nuevoMensaje: MensajeContacto = {
        id: Date.now().toString(),
        fecha: new Date().toLocaleDateString(),
        ...this.contactoForm.value
      };

      this.mensajesEnviadosList = [nuevoMensaje, ...this.mensajesEnviadosList];
      await Preferences.set({
        key: this.MENSAJES_KEY,
        value: JSON.stringify(this.mensajesEnviadosList)
      });

      this.mensajeEnviado = true;
      this.contactoForm.reset({ asunto: 'consulta' });

      setTimeout(() => {
        this.mensajeEnviado = false;
      }, 5000);
    }
  }
}
