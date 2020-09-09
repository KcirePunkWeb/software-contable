import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
})
export class FacturaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  generarPDF() {
    // let doc = new jsPDF();
    // doc.fromHTML(document.getElementById('generar-factura'), 10, 10);
    // doc.save('client.pdf');
    window.print();
    // const options = {
    //   filename: 'cliente-12312323.pdf',
    //   html2canvas: { scale: 2 },
    //   margin: 1,
    //   jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    // };

    // const content: Element = document.getElementById('generar-factura');

    // html2pdf().from(content).set(options).save();
  }
}
