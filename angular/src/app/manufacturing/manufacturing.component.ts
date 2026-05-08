import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductionOrderDto, ProductionOrderStatus } from '../models/manufacturing.models';

@Component({
  selector: 'app-manufacturing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './manufacturing.component.html',
  styleUrls: ['./manufacturing.component.css']
})

export class ManufacturingComponent implements OnInit {
  productionOrders: ProductionOrderDto[] = [];
  selectedProductionOrder: ProductionOrderDto | null = null;

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }
}
