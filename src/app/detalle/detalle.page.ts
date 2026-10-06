import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonBadge, IonButtons, IonBackButton, IonItem, IonLabel, IonList
} from '@ionic/angular';
import { ConjuntoService } from '../services/conjunto.service';
import { GastoComun } from '../models/conjunto.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonBadge, IonButtons, IonBackButton, IonItem, IonLabel, IonList
  ]
})
export class DetallePage implements OnInit {

  gasto?: GastoComun;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conjuntoService: ConjuntoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gasto = this.conjuntoService.getGastoById(id);
    }
  }

  marcarPagado() {
    if (this.gasto) {
      this.conjuntoService.updateEstadoGasto(this.gasto.id, 'Pagado');
      this.gasto = { ...this.gasto, estado: 'Pagado' };
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
