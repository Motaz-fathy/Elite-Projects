/* eslint-disable no-magic-numbers */
/* eslint-disable @angular-eslint/prefer-output-readonly */
/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-advanced-data-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedDataTableComponent implements OnChanges {
  @Input() data: Array<Record<string, unknown>> = [];
  @Input() columns?: string[];
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() displayActions = true;

  @Output() edit = new EventEmitter<Record<string, unknown>>();
  @Output() delete = new EventEmitter<Record<string, unknown>>();

  public displayedColumns: string[] = [];
  public searchControl = new FormControl<string>('', { nonNullable: true });

  public sortKey: string | null = null;
  public sortDir: 'asc' | 'desc' = 'asc';
  public currentPage = 0;

  private static readonly SEARCH_DEBOUNCE_MS = 300;
pageSizeControl = new FormControl<number>(this.pageSize);

  constructor() {
    this.searchControl.valueChanges.pipe(debounceTime(AdvancedDataTableComponent.SEARCH_DEBOUNCE_MS)).subscribe(() => {
      this.currentPage = 0;
    });
    this.pageSizeControl.valueChanges.subscribe((size) => {
      if (typeof size === 'number') {
        this.changePageSize(size);
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns']) {
      const first = this.data?.[0] ?? {};
      this.displayedColumns = (this.columns && this.columns.length > 0) ? [...this.columns] : Object.keys(first);
      if (this.displayActions && !this.displayedColumns.includes('__actions')) {
        this.displayedColumns = [...this.displayedColumns, '__actions'];
      }
    }
  }

  public get filteredSortedPaged(): Array<Record<string, unknown>> {
    const term = this.searchControl.value.trim().toLowerCase();

    // Filter
    let rows = (this.data ?? []).filter((row) => {
      if (!term) return true;
      return Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(term));
    });

    // Sort
    if (this.sortKey) {
      const key = this.sortKey;
      const dir = this.sortDir;
      rows = [...rows].sort((a, b) => {
        const av = String(a[key] ?? '').toLowerCase();
        const bv = String(b[key] ?? '').toLowerCase();
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return dir === 'asc' ? cmp : -cmp;
      });
    }

    // Page
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return rows.slice(start, end);
  }

  public totalCount(): number {
    const term = this.searchControl.value.trim().toLowerCase();
    if (!term) return (this.data ?? []).length;
    return (this.data ?? []).filter((row) => Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(term))).length;
  }

  public totalPages(): number {
    const count = this.totalCount();
    return Math.max(1, Math.ceil(count / this.pageSize));
  }

  public sortBy(col: string): void {
    if (col === '__actions') return;
    if (this.sortKey === col) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = col;
      this.sortDir = 'asc';
    }
    this.currentPage = 0;
  }

  public changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
  }

  public goPrev(): void {
    if (this.currentPage > 0) this.currentPage -= 1;
  }

  public goNext(): void {
    const last = this.totalPages() - 1;
    if (this.currentPage < last) this.currentPage += 1;
  }

  public goTo(page: number): void {
    const last = this.totalPages() - 1;
    this.currentPage = Math.min(Math.max(page, 0), last);
  }

  public onEdit(row: Record<string, unknown>): void {
    this.edit.emit(row);
  }

  public onDelete(row: Record<string, unknown>): void {
    this.delete.emit(row);
  }

  public get pageNumbers(): Array<number | 'ellipsis-start' | 'ellipsis-end'> {
    const pageCount = this.totalPages();
    const currentPage = this.currentPage + 1; // 1-based for display
    const pages: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [];

    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(pageCount - 1, currentPage + 1);

    if (currentPage <= 3) {
      start = 2;
      end = Math.min(4, pageCount - 1);
    }

    if (currentPage >= pageCount - 2) {
      start = Math.max(2, pageCount - 3);
      end = pageCount - 1;
    }

    if (start > 2) {
      pages.push('ellipsis-start');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < pageCount - 1) {
      pages.push('ellipsis-end');
    }

    if (pageCount > 1) {
      pages.push(pageCount);
    }

    return pages;
  }
}
