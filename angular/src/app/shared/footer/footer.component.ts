import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer bg-light border-top mt-5 py-4">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-1">
              <strong>© 2026 HYD ERP System</strong> - All Rights Reserved
            </p>
            <p class="text-muted small mb-0">
              Built with enterprise-grade technology for modern business
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-1">
              <small class="text-muted">
                Powered by 
                <a href="https://abp.io/" target="_blank" class="text-decoration-none">
                  <strong>ABP Framework</strong>
                </a>
              </small>
            </p>
            <p class="text-muted small mb-0">
              Theme by 
              <a href="https://volosoft.com/" target="_blank" class="text-decoration-none">
                <strong>Volosoft</strong>
              </a>
              - Lepton X
            </p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      position: relative;
      z-index: 1000;
    }
    
    .app-footer a {
      color: #007bff;
      transition: color 0.3s ease;
    }
    
    .app-footer a:hover {
      color: #0056b3;
      text-decoration: underline !important;
    }
  `]
})
export class FooterComponent {}
