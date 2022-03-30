import { Component, Input, OnInit } from '@angular/core';
import { NavBarLink } from '@symbiota2/ui-common';

@Component({
  selector: 'symbiota2-sitemap-unordered-list',
  templateUrl: './sitemap-unordered-list.component.html',
  styleUrls: ['./sitemap-unordered-list.component.scss']
})
export class SitemapUnorderedListComponent implements OnInit {
  @Input() categoryTitle: string;
  @Input() categoryLinks: NavBarLink[];

  constructor() { }

  ngOnInit(): void {
  }

}
