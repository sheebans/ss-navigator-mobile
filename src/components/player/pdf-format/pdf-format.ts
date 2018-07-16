import { Component, Input, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ContentFormatComponent } from '@components/player/content-format.component';
import { Loading, LoadingController } from 'ionic-angular';

@Component({
  selector: 'pdf-format',
  templateUrl: 'pdf-format.html'
})
export class PdfFormatComponent implements ContentFormatComponent, OnInit {
  pdfPlayerUrl: string = 'https://docs.google.com/gview?embedded=true&url=';

  @Input() content: any;

  @Input() isActive: boolean;

  trustedPdfUrl: SafeResourceUrl;

  loading: Loading;

  constructor(
    private domSanitizer: DomSanitizer,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const pdfUrl = `${this.pdfPlayerUrl}${this.content.url}`;
    this.trustedPdfUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      pdfUrl
    );
  }

  onPdfLoad(): void {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    } else {
      this.loading = this.loadingCtrl.create({
        content: ''
      });
      this.loading.present();
    }
    console.log('pdf loaded Successfully!!!!');
  }
}
