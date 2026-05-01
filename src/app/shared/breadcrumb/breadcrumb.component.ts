import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Elemento del breadcrumb.
 */
export interface BreadcrumbItem {
  label: string;
  url?: string;
}
@Component({
  selector: 'app-breadcrumb',
  imports: [NgIf,NgFor, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})

export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
