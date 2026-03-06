import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Option } from '../../../../shared/interface/theme-option.interface';
import { Footer } from '../../../../shared/interface/theme.interface';

@Component({
  selector: 'app-basic-footer',
  templateUrl: './basic-footer.component.html',
  styleUrls: ['./basic-footer.component.scss']
})
export class BasicFooterComponent implements OnInit, OnDestroy {

  @Input() data: Option | null;
  @Input() footer: Footer;

  public active: { [key: string]: boolean } = {
    categories: false,
    useful_link: false
  };

  public showBackToTop: boolean = false;

  public newsletterEmail: string = '';
  public newsletterSuccess: boolean = false;
  public newsletterError: string | null = null;

  ngOnInit(): void {
    // Initial check
    this.checkScrollPosition();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  checkScrollPosition(): void {
    // Show button after scrolling down 300px
    this.showBackToTop = window.pageYOffset > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  toggle(value: string) {
    this.active[value] = !this.active[value];
  }

  subscribeNewsletter() {
    this.newsletterError = null;
    this.newsletterSuccess = false;

    if (!this.newsletterEmail) {
      this.newsletterError = 'Please enter an email address.';
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.newsletterEmail)) {
      this.newsletterError = 'Please enter a valid email address.';
      return;
    }

    // Simulate API call
    console.log('Subscribing:', this.newsletterEmail);
    this.newsletterSuccess = true;
    this.newsletterEmail = '';

    // Clear success message after 5 seconds
    setTimeout(() => {
      this.newsletterSuccess = false;
    }, 5000);
  }
}
