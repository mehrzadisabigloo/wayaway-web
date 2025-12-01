import { Directive, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';

/**
 * Drag Scroll Directive for panel tables 
 * 
 * Usage:
 * 1. Import DragScrollDirective in your component
 * 2. Add it to the imports array
 * 3. Add appDragScroll attribute to your table container
 * 4. Add drag-scroll-container class to the container
 * 5. Add drag-scroll-table class to the table
 * 
 * Example:
 * <div class="drag-scroll-container" appDragScroll>
 *   <table class="drag-scroll-table">
 *     <!-- table content -->
 *   </table>
 * </div>
 */

@Directive({
  selector: '[appDragScroll]',
  standalone: true
})
export class DragScrollDirective implements OnInit, OnDestroy {
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setupDragScroll();
  }

  ngOnDestroy() {
    this.removeDragScrollListeners();
  }

  private setupDragScroll() {
    const container = this.el.nativeElement;
    
    const handleMouseDown = (e: MouseEvent) => {
      this.isDragging = true;
      this.startX = e.pageX - container.offsetLeft;
      this.scrollLeft = container.scrollLeft;
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
      container.classList.add('dragging');
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - this.startX) * 2;
      container.scrollLeft = this.scrollLeft - walk;
    };

    const handleMouseUp = () => {
      this.isDragging = false;
      container.style.cursor = 'grab';
      container.style.userSelect = 'auto';
      container.classList.remove('dragging');
    };

    // Store handlers for cleanup
    this.mouseDownHandler = handleMouseDown;
    this.mouseMoveHandler = handleMouseMove;
    this.mouseUpHandler = handleMouseUp;

    // Add listeners
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  private removeDragScrollListeners() {
    const container = this.el.nativeElement;
    
    if (this.mouseDownHandler) {
      container.removeEventListener('mousedown', this.mouseDownHandler);
    }
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (this.mouseUpHandler) {
      document.removeEventListener('mouseup', this.mouseUpHandler);
    }
  }

  // Store handlers for cleanup
  private mouseDownHandler?: (e: MouseEvent) => void;
  private mouseMoveHandler?: (e: MouseEvent) => void;
  private mouseUpHandler?: () => void;
} 