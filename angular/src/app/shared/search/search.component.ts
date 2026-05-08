import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="global-search-container">
      <div class="search-input-group">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Search across all modules..." 
          [(ngModel)]="searchQuery"
          (input)="onSearchInput($event)"
          (focus)="showResults = true"
          (keydown)="onKeydown($event)"
          #searchInput>
        <button class="btn btn-outline-secondary" type="button" (click)="clearSearch()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Search Results Dropdown -->
      <div class="search-results-dropdown" *ngIf="showResults && (searchResults.length > 0 || searchQuery.length > 1)">
        <div class="search-header" *ngIf="searchQuery.length > 1">
          <small class="text-muted">{{ searchResults.length }} results found</small>
        </div>
        
        <div class="search-results-list">
          <div 
            *ngFor="let result of searchResults; let i = index" 
            class="search-result-item"
            [class.selected]="i === selectedIndex"
            (click)="selectResult(result)"
            (mouseenter)="selectedIndex = i">
            
            <div class="result-icon">
              <i class="fas {{ getIconForType(result.type) }} {{ getColorForModule(result.module) }}"></i>
            </div>
            
            <div class="result-content">
              <div class="result-title">{{ result.title }}</div>
              <div class="result-description">{{ result.description }}</div>
              <div class="result-meta">
                <span class="badge bg-light text-dark">{{ result.module }}</span>
                <span class="badge bg-light text-dark">{{ formatType(result.type) }}</span>
              </div>
            </div>
            
            <div class="result-actions">
              <button class="btn btn-sm btn-outline-primary" (click)="navigateToResult(result); $event.stopPropagation()">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- No Results -->
        <div class="no-results" *ngIf="searchQuery.length > 1 && searchResults.length === 0">
          <div class="text-center py-3">
            <i class="fas fa-search fa-2x text-muted mb-2"></i>
            <p class="text-muted">No results found for "{{ searchQuery }}"</p>
          </div>
        </div>
        
        <!-- Popular Searches -->
        <div class="popular-searches" *ngIf="searchQuery.length === 0">
          <div class="search-header">
            <small class="text-muted">Popular Searches</small>
          </div>
          <div class="popular-tags">
            <span 
              *ngFor="let term of popularSearches" 
              class="popular-tag"
              (click)="searchQuery = term; onSearchInput($event)">
              {{ term }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .global-search-container {
      position: relative;
      width: 100%;
      max-width: 500px;
    }
    
    .search-input-group {
      display: flex;
      position: relative;
    }
    
    .search-input-group input {
      border-radius: 20px 0 0 20px;
      border-right: none;
    }
    
    .search-input-group button {
      border-radius: 0 20px 20px 0;
      border-left: none;
    }
    
    .search-results-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      margin-top: 4px;
    }
    
    .search-header {
      padding: 8px 16px;
      border-bottom: 1px solid #f0f0f0;
      background: #f8f9fa;
    }
    
    .search-result-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .search-result-item:hover,
    .search-result-item.selected {
      background-color: #f8f9fa;
    }
    
    .result-icon {
      margin-right: 12px;
      font-size: 16px;
      width: 20px;
      text-align: center;
    }
    
    .result-content {
      flex: 1;
    }
    
    .result-title {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .result-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 6px;
    }
    
    .result-meta {
      display: flex;
      gap: 6px;
    }
    
    .result-actions {
      margin-left: 12px;
    }
    
    .no-results {
      padding: 20px;
      text-align: center;
    }
    
    .popular-searches {
      padding: 12px 16px;
    }
    
    .popular-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .popular-tag {
      background: #e9ecef;
      color: #495057;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .popular-tag:hover {
      background: #dee2e6;
    }
  `]
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  searchQuery = '';
  searchResults: SearchResult[] = [];
  showResults = false;
  selectedIndex = -1;
  popularSearches: string[] = [];
  
  private searchSubscription: Subscription | null = null;
  
  @Output() resultSelected = new EventEmitter<SearchResult>();
  @Output() searchPerformed = new EventEmitter<string>();

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchSubscription = this.searchService.searchResults$.subscribe(results => {
      this.searchResults = results;
      this.selectedIndex = -1;
    });
    
    this.popularSearches = this.searchService.getPopularSearches();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchInput(event: any) {
    this.searchPerformed.emit(this.searchQuery);
    this.searchService.search(this.searchQuery);
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.searchResults.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0 && this.searchResults[this.selectedIndex]) {
          this.selectResult(this.searchResults[this.selectedIndex]);
        }
        break;
      case 'Escape':
        this.showResults = false;
        break;
    }
  }

  selectResult(result: SearchResult) {
    this.resultSelected.emit(result);
    this.navigateToResult(result);
    this.showResults = false;
    this.clearSearch();
  }

  navigateToResult(result: SearchResult) {
    // In a real app, this would use the router to navigate
    console.log('Navigate to:', result.url);
    // this.router.navigate([result.url]);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedIndex = -1;
    this.searchService.clearResults();
  }

  getIconForType(type: string): string {
    const iconMap: { [key: string]: string } = {
      'customer': 'fas fa-users',
      'lead': 'fas fa-user-tie',
      'opportunity': 'fas fa-chart-line',
      'employee': 'fas fa-user',
      'payslip': 'fas fa-file-invoice-dollar',
      'production-order': 'fas fa-tasks',
      'work-order': 'fas fa-tools',
      'maintenance': 'fas fa-wrench',
      'quality-check': 'fas fa-check-circle'
    };
    return iconMap[type] || 'fas fa-circle';
  }

  getColorForModule(module: string): string {
    const colorMap: { [key: string]: string } = {
      'CRM': 'text-primary',
      'Manufacturing': 'text-success',
      'Payroll': 'text-warning'
    };
    return colorMap[module] || 'text-secondary';
  }

  formatType(type: string): string {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Close results when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.global-search-container')) {
      this.showResults = false;
    }
  }
}
