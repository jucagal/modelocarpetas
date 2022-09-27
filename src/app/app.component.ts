import {Component} from '@angular/core';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

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
}
