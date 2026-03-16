import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-success-modal',
  templateUrl: './registration-success-modal.component.html',
  styleUrls: ['./registration-success-modal.component.scss']
})
export class RegistrationSuccessModalComponent {

  public modalOpen: boolean = false;
  @ViewChild("registrationSuccessModal", { static: false }) RegistrationSuccessModal: TemplateRef<any>;

  constructor(private modalService: NgbModal, private router: Router) { }

  openModal() {
    this.modalOpen = true;
    this.modalService.open(this.RegistrationSuccessModal, {
      ariaLabelledBy: 'Registration-Success-Modal',
      centered: true,
      windowClass: 'theme-modal registration-success-modal'
    }).result.then((result) => {
      this.close();
    }, (reason) => {
      this.close();
    });
  }

  close() {
    this.modalOpen = false;
    this.router.navigateByUrl('/account/dashboard');
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
