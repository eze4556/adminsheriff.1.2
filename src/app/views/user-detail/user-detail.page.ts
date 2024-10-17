import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FirestoreService } from '../../common/services/firestore.service';
import { Observable } from 'rxjs';
import { IonHeader, IonToolbar,   IonSelect,
 IonContent, IonLabel, IonItem, IonInput,   IonSelectOption ,
 IonSegmentButton, IonIcon, IonSegment, IonButtons, IonTitle, IonButton, IonMenu, IonList, IonMenuButton, IonText, IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonBackButton } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

 import { v4 as uuidv4 } from 'uuid';

import { LeatherStrap } from '../../common/models/lonja.model';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [IonBackButton, IonCardContent, IonSelectOption , IonSelect, IonCardHeader, IonCardTitle, IonCard, IonText, CommonModule, FormsModule, ReactiveFormsModule, IonHeader, IonButtons, IonToolbar, IonIcon, IonContent, IonSegment, IonSegmentButton, IonLabel, IonInput, IonItem, IonTitle, IonButton, IonMenu, IonList, IonMenuButton],
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Añadir esta línea como solución alternativa

})
export class UserDetailPage implements OnInit {
 // Propiedades del Cinto
  leatherStrap: LeatherStrap = {
    id: '',
    cintos: '',
    ancho: 0,
    espesor: 0,
    color: '',
    material: '',
    fechaCreacion: new Date(),
    price: 0,
    // imagenUrl: '',
          imagenesUrl: [] ,

        currency: 'USD',
        largo: '',

  };

  // Lista de cintos
  leatherStraps: LeatherStrap[] = [];

  // Archivo de imagen seleccionado
  imagenArchivo: File | null = null;

    imagenArchivos: File[] = [];


  // Opciones de moneda
  currencies = [
    { value: 'USD', label: 'Dólar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'ARS', label: 'Pesos (ARS)' }
  ];

  constructor(
    private firestoreService: FirestoreService,

  ) {}

  ngOnInit() {
    this.cargarLeatherStraps();
  }

  // Cargar cintos desde Firestore
  cargarLeatherStraps() {
    this.firestoreService.getCollectionChanges<LeatherStrap>('leatherStraps').subscribe(
      (data) => {
        this.leatherStraps = data;
      },
      (error) => {
        console.error('Error al cargar los cintos:', error);
      }
    );
  }


 // Manejar la selección de múltiples archivos
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.imagenArchivos = Array.from(files); // Convertir FileList a Array
  }




// onFileSelected(event: any) {
//   const files: FileList = event.target.files;
//   this.imagenArchivos = Array.from(files); // Convertir FileList a Array
//   console.log('Archivos seleccionados:', this.imagenArchivos);
// }


 // Subir cinto
  async subirLeatherStrap() {
    // Validaciones básicas
    if (
      !this.leatherStrap.cintos ||
      !this.leatherStrap.ancho ||
      !this.leatherStrap.espesor ||
      !this.leatherStrap.color ||
      !this.leatherStrap.material ||
      !this.leatherStrap.price ||
      !this.leatherStrap.currency ||
      !this.leatherStrap.largo
    ) {
      return;
    }

    const id = uuidv4();
    this.leatherStrap.id = id;
    this.leatherStrap.fechaCreacion = new Date();

    try {
      // Subir múltiples imágenes
      if (this.imagenArchivos.length > 0) {
        this.leatherStrap.imagenesUrl = []; // Reiniciar el arreglo
        for (const imagen of this.imagenArchivos) {
          const imagenUrl = await this.firestoreService.uploadFile(imagen, `imagenes/cintos/${id}/${imagen.name}`);
          this.leatherStrap.imagenesUrl.push(imagenUrl);
        }
      }

      await this.firestoreService.createDocument(this.leatherStrap, `leatherStraps/${id}`);
      this.resetForm();
    } catch (error) {
      console.error('Error al subir el cinto:', error);
    }
  }

  // Borrar cinto
  async borrarLeatherStrap(leatherStrapId: string) {
    try {
      await this.firestoreService.deleteDocumentID('leatherStraps', leatherStrapId);

    } catch (error) {
      console.error('Error al eliminar el cinto:', error);

    }
  }

  // Reiniciar el formulario
  resetForm() {
    this.leatherStrap = {
      id: '',
      cintos: '',
      ancho: 0,
      espesor: 0,
      color: '',
      material: '',
      fechaCreacion: new Date(),
      price: 0,
      // imagenUrl: '',
                imagenesUrl: [],
      currency: 'USD',
      largo: '',

    };
    this.imagenArchivo = null;
  }


   // Obtener símbolo de moneda
  getCurrencySymbol(currency: string): string {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
         case 'ARS':
        return '$';
      default:
        return '';
    }
  }


}
