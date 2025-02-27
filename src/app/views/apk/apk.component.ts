import { BuckleBelt } from './../../common/models/cinturonH.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';
import { FirestoreService } from './../../common/services/firestore.service';
import { Categoria } from './../../common/models/categoria.models';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-apk',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './apk.component.html',
  styleUrls: ['./apk.component.scss'],
})
export class ApkComponent implements OnInit {
  // Propiedades del Cinturón y Hebilla
  buckleBelt: BuckleBelt = {
    id: '',
    buckleColor: '',
    price: '',
    size: '',
    fabricDesign: '',
    width: 0,
    fechaCreacion: new Date(),
    // Propiedades de la Hebilla
    style: '',
    targetAgeGroup: 0,
    currency: 'USD', // Valor por defecto
      imagenesUrl: []  // Almacenará las URLs de las imágenes

  };

  // Lista de cinturones
  belts: BuckleBelt[] = [];

  // Archivo de imagen seleccionado
  imagenArchivo: File | null = null;

  imagenArchivos: File[] = [];


  // Opciones de moneda
  currencies = [
    { value: 'USD', label: 'Dólar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'ARS', label: 'Pesos (ARS)' },
  ];

  constructor(
    private firestoreService: FirestoreService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarBelts();
  }

  // Cargar cinturones desde Firestore
  cargarBelts() {
    this.firestoreService.getCollectionChanges<BuckleBelt>('belts').subscribe(
      (data) => {
        this.belts = data;
              console.log(this.belts);  // Revisa si las URLs están llegando bien

      },
      (error) => {
        console.error('Error al cargar cinturones:', error);
      }
    );
  }

 onFileSelected(event: any) {
  const files: FileList = event.target.files;
  this.imagenArchivos = Array.from(files); // Convertir FileList a Array
  console.log('Archivos seleccionados:', this.imagenArchivos);
}



// Subir cinturón con hebilla
async subirBelt() {
  // Validaciones básicas
  if (
    !this.buckleBelt.buckleColor ||
    !this.buckleBelt.size ||
    !this.buckleBelt.fabricDesign ||
    !this.buckleBelt.width ||
    !this.buckleBelt.style ||
    !this.buckleBelt.targetAgeGroup ||
    !this.buckleBelt.currency
  ) {
    this.mostrarToast('Por favor, complete todos los campos obligatorios.', 'warning');
    return;
  }

  const id = uuidv4();
  this.buckleBelt.id = id;
  this.buckleBelt.fechaCreacion = new Date();

  try {
    // Si hay archivos de imagen seleccionados
    if (this.imagenArchivos.length > 0) {
      this.buckleBelt.imagenesUrl = []; // Reiniciar la lista de URLs de imágenes
      for (const imagen of this.imagenArchivos) {
  const imagenUrl = await this.firestoreService.uploadFile(imagen, `imagenes/${id}/${imagen.name}`);
  console.log('URL de la imagen subida:', imagenUrl);
  this.buckleBelt.imagenesUrl.push(imagenUrl);
}

    }

    await this.firestoreService.createDocument(this.buckleBelt, `belts/${id}`);
    this.mostrarToast('Cinturón con hebilla subido exitosamente', 'success');
    this.resetForm();
  } catch (error) {
    console.error('Error al subir el cinturón:', error);
    this.mostrarToast('Error al subir el cinturón', 'danger');
  }
}



  // async subirBelt() {

  //   if (
  //     !this.buckleBelt.buckleColor ||
  //     !this.buckleBelt.size ||
  //     !this.buckleBelt.fabricDesign ||
  //     !this.buckleBelt.width ||
  //     !this.buckleBelt.style ||
  //     !this.buckleBelt.targetAgeGroup ||
  //     !this.buckleBelt.currency

  //   ) {
  //     this.mostrarToast(
  //       'Por favor, complete todos los campos obligatorios.',
  //       'warning'
  //     );
  //     return;
  //   }

  //   const id = uuidv4();
  //   this.buckleBelt.id = id;
  //   this.buckleBelt.fechaCreacion = new Date();

  //   try {
  //     if (this.imagenArchivo) {
  //       const imagenUrl = await this.firestoreService.uploadFile(
  //         this.imagenArchivo,
  //         `imagenes/${id}`
  //       );
  //       this.buckleBelt.imagenUrl = imagenUrl;
  //     }

  //     await this.firestoreService.createDocument(
  //       this.buckleBelt,
  //       `belts/${id}`
  //     );
  //     this.mostrarToast('Cinturón con hebilla subido exitosamente', 'success');
  //     this.resetForm();
  //   } catch (error) {
  //     console.error('Error al subir el cinturón:', error);
  //     this.mostrarToast('Error al subir el cinturón', 'danger');
  //   }
  // }

  // Borrar cinturón
  async borrarBelt(beltId: string) {
    try {
      await this.firestoreService.deleteDocumentID('belts', beltId);
      this.mostrarToast('Cinturón eliminado exitosamente', 'success');
      // No es necesario recargar los cinturones ya que Firestore actualiza la suscripción automáticamente
    } catch (error) {
      console.error('Error al eliminar el cinturón:', error);
      this.mostrarToast('Error al eliminar el cinturón', 'danger');
    }
  }

  // Reiniciar el formulario
  resetForm() {
    this.buckleBelt = {
      id: '',
      buckleColor: '',
      price: '',
      size: '',
      fabricDesign: '',
      width: 0,
      fechaCreacion: new Date(),
      // Propiedades de la Hebilla
      style: '',
      targetAgeGroup: 0,
      currency: 'USD', // Valor por defecto
          imagenesUrl: []  // Reiniciar la lista de URLs de imágenes

    };
    this.imagenArchivo = null;
  }

  // Mostrar Toast
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    toast.present();
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
