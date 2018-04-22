import { Component, OnInit } from '@angular/core';
import { TableStats } from '@app/home/tableStatsResult';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  tableStats:TableStats;
  constructor() { }

  ngOnInit() {
  }

}
