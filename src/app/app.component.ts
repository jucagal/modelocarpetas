import {Component} from '@angular/core';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {PDFDocument} from 'pdf-lib'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  groupsNames: string[] = ['Cedula', 'RUT', 'Certificado'];
  allFileList: File[] = [];
  groupsFileList: File[][] = [];
  blocksNames: (CdkDropList | string)[] = ['cdk-drop-list-0'];
  pdfBytes: Uint8Array = new Uint8Array;
  showModal: boolean = false;
  displayModal!: boolean;
  headerFile!: string;

  cleanGroups() {
    this.allFileList = [];
    for (let i = 0; i < this.groupsNames.length; i++) {
      this.groupsFileList[i] = [];
      this.blocksNames.push('cdk-drop-list-' + (i + 1));
    }
  }

  onFolderSelected(event: any) {
    this.cleanGroups();
    if (event.target.files.length > 0) {
      let files = event.target.files;
      for (const file of files) {
        for (let i = 0; i < this.groupsNames.length; i++) {
          if (file.name.toUpperCase().includes(this.groupsNames[i].toUpperCase())) {
            this.groupsFileList[i].push(file);
            break;
          }
          if (i === this.groupsNames.length - 1) {
            this.allFileList.push(file);
          }
        }
      }
    }
  }

  drop(event: CdkDragDrop<File[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  async showPdf(file: File) {
    const pdfDoc = await PDFDocument.create()
    const firstDonorPdfBytes = await file.arrayBuffer();
    const secondDonorPdfBytes = await file.arrayBuffer();
    const firstDonorPdfDoc = PDFDocument.load(firstDonorPdfBytes)
    const secondDonorPdfDoc = PDFDocument.load(secondDonorPdfBytes)
    const [firstDonorPage] = await pdfDoc.copyPages(await firstDonorPdfDoc, [0])
    const [secondDonorPage] = await pdfDoc.copyPages(await secondDonorPdfDoc, [0])
    pdfDoc.addPage(firstDonorPage)
    pdfDoc.insertPage(0, secondDonorPage)
    pdfDoc.insertPage(0, secondDonorPage)
    pdfDoc.insertPage(0, secondDonorPage)
    pdfDoc.insertPage(0, secondDonorPage)
    this.pdfBytes = await pdfDoc.save();
  }

  callModal(file: File) {
    this.pdfBytes = new Uint8Array;
    this.showPdf(file);
    this.showModal = true;
    this.headerFile = file.name;
    /*file.arrayBuffer().then(buff => {
      this.pdfBytes = new Uint8Array(buff);
    }).finally(() => {
      this.showModal = true;
    }).catch(e => {
      this.showModal = false;
      console.error(e);
    });*/
  }
}
