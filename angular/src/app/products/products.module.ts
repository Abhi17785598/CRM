import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import PrimeNG modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Import components
import { ProductsComponent } from './products.component';
import { ProductCatalogComponent } from './product-catalog.component';
import { ProductManagementComponent } from './product-management.component';
import { CategoriesComponent } from './categories.component';
import { ProductDetailsComponent } from './product-details.component';
import { ProductReportComponent } from './product-report.component';

// Import service
import { ProductService } from './product.service';

// Import routing
import { PRODUCTS_ROUTES } from './products-routing.module';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductCatalogComponent,
    ProductManagementComponent,
    CategoriesComponent,
    ProductDetailsComponent,
    ProductReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PRODUCTS_ROUTES),
    FormsModule,
    HttpClientModule,
    // PrimeNG modules
    CardModule,
    ButtonModule,
    TagModule,
    ImageModule,
    RatingModule,
    InputTextModule,
    DropdownModule,
    SliderModule,
    ProgressSpinnerModule
  ],
  providers: [
    ProductService
  ]
})
export class ProductsModule {}
