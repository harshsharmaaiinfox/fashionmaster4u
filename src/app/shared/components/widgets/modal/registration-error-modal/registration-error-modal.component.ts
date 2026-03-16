import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration-error-modal',
  templateUrl: './registration-error-modal.component.html',
  styleUrls: ['./registration-error-modal.component.scss']
})
export class RegistrationErrorModalComponent {

  public modalOpen: boolean = false;
  @ViewChild("registrationErrorModal", { static: false }) RegistrationErrorModal: TemplateRef<any>;

  constructor(private modalService: NgbModal) { }

  openModal() {
    this.modalOpen = true;
    this.modalService.open(this.RegistrationErrorModal, {
      ariaLabelledBy: 'Registration-Error-Modal',
      centered: true,
      windowClass: 'theme-modal registration-error-modal'
    }).result.then((result) => {
      this.modalOpen = false;
    }, (reason) => {
      this.modalOpen = false;
    });
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
