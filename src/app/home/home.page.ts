import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonBadge, IonButton, IonInput, IonText, IonIcon, AlertController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, eyeOutline } from 'ionicons/icons';
import { ConjuntoService } from '../services/conjunto.service';
import { GastoComun, Anuncio } from '../models/conjunto.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonBadge, IonButton, IonInput, IonText, IonIcon
  ]
})
export class HomePage implements OnInit {

  gastos: GastoComun[] = [];
  anuncios: Anuncio[] = [];
  gastoForm!: FormGroup;

  constructor(
    private conjuntoService: ConjuntoService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ trashOutline, eyeOutline });
  }

  ngOnInit() {
    this.gastoForm = this.fb.group({
      departamento: ['', [Validators.required, Validators.minLength(3)]],
      mes: ['', [Validators.required]],
      monto: [null, [Validators.required, Validators.min(1000)]]
    });

    this.conjuntoService.getGastos().subscribe(data => {
      this.gastos = data;
    });

    this.conjuntoService.getAnuncios().subscribe(data => {
      this.anuncios = data;
    });
  }

  verDetalle(id: string) {
    this.router.navigate(['/detalle', id]);
  }

  marcarComoPagado(id: string) {
    this.conjuntoService.updateEstadoGasto(id, 'Pagado');
  }

  async confirmarEliminar(id: string, departamento: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de que desea eliminar el registro de ${departamento}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.conjuntoService.eliminarGasto(id);
          }
        }
      ]
    });

    await alert.present();
  }

  guardarGasto() {
    if (this.gastoForm.valid) {
      const nuevoGasto: Omit<GastoComun, 'id'> = {
        departamento: this.gastoForm.value.departamento,
        mes: this.gastoForm.value.mes,
        monto: Number(this.gastoForm.value.monto),
        estado: 'Pendiente'
      };

      this.conjuntoService.agregarGasto(nuevoGasto);
      this.gastoForm.reset();
    } else {
      this.gastoForm.markAllAsTouched();
    }
  }
}
