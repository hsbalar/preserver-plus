import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { GridsterComponent, IGridsterOptions, IGridsterDraggableOptions } from 'angular2gridster';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  data: any = [];
  widget: any = {
    x: 0, y: 0,
    w: 1, h: 1,
    dragAndDrop: true,
    resizable: true
  }
  searchDraft = new FormControl();
  subscription: Subscription;

  static X_PROPERTY_MAP: any = {
    sm: 'xSm',
    md: 'xMd',
    lg: 'xLg',
    xl: 'xXl'
  };

  static Y_PROPERTY_MAP: any = {
    sm: 'ySm',
    md: 'yMd',
    lg: 'yLg',
    xl: 'yXl'
  };

  static W_PROPERTY_MAP: any = {
    sm: 'wSm',
    md: 'wMd',
    lg: 'wLg',
    xl: 'wXl'
  };

  static H_PROPERTY_MAP: any = {
    sm: 'hSm',
    md: 'hMd',
    lg: 'hLg',
    xl: 'hXl'
  };

  constructor(
    public cd: ChangeDetectorRef,
    public accountService: AccountService,
    public router: Router,
    public dbService: DbService
  ) { }

  @ViewChild(GridsterComponent, { static: true }) gridster: GridsterComponent;
  itemOptions = {
    maxWidth: 3,
    maxHeight: 4
  };
  gridsterOptions: IGridsterOptions = {
    lanes: 2,
    direction: 'vertical',
    floating: true,
    dragAndDrop: true,
    resizable: true,
    resizeHandles: {
      s: true,
      e: true,
      se: true
    },
    widthHeightRatio: 1,
    lines: {
      visible: true,
      color: '#afafaf',
      width: 2
    },
    shrink: true,
    useCSSTransforms: true,
    responsiveView: true,
    responsiveDebounce: 500,
    responsiveSizes: true,
    responsiveToParent: true,
    responsiveOptions: [
      {
        breakpoint: 'sm',
        minWidth: 480,
        lanes: 3
      },
      {
        breakpoint: 'md',
        minWidth: 768,
        lanes: 4
      },
      {
        breakpoint: 'lg',
        minWidth: 1250,
        lanes: 6
      },
      {
        breakpoint: 'xl',
        minWidth: 1800,
        lanes: 8
      }
    ]
  };

  gridsterDraggableOptions: IGridsterDraggableOptions = {
    handlerClass: 'panel-heading'
  };

  ngOnInit() {
    this.subscription = this.dbService.updatedList.subscribe((list) => {
      this.data = list;
      this.cd.detectChanges();
    });

    this.searchDraft.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(newValue => {
        this.filterNotes(newValue);
      });
  }

  onReflow(event: any) {}

  removeLine(gridster: GridsterComponent) {
    gridster.setOption('lanes', --this.gridsterOptions.lanes)
      .reload();
  }

  addLine(gridster: GridsterComponent) {
    gridster.setOption('lanes', ++this.gridsterOptions.lanes)
      .reload();
  }

  setWidth(widget: any, size: number, e: MouseEvent, gridster) {
    e.stopPropagation();
    e.preventDefault();

    const breakpoint = gridster.options.breakpoint;
    let newWidth = widget[DashboardComponent.W_PROPERTY_MAP[breakpoint] || 'w'] + size;
    if (newWidth < 1) {
      newWidth = 1;
    }
    widget[DashboardComponent.W_PROPERTY_MAP[breakpoint] || 'w'] = newWidth;
    gridster.reload();
    return false;
  }

  setHeight(widget: any, size: number, e: MouseEvent, gridster) {
    e.stopPropagation();
    e.preventDefault();

    const breakpoint = gridster.options.breakpoint;
    let newHeight = widget[DashboardComponent.H_PROPERTY_MAP[breakpoint] || 'h'] + size;
    if (newHeight < 1) {
      newHeight = 1;
    }
    widget[DashboardComponent.H_PROPERTY_MAP[breakpoint] || 'h'] = newHeight;
    gridster.reload();
    return false;
  }

  optionsChange(options: IGridsterOptions) {
    this.gridsterOptions = options;
  }

  itemChange($event: any, gridster: any) {}

  over(event: any) {
    const size = event.item.calculateSize(event.gridster);

    event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width = size.width + 'px';
    event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height = size.height + 'px';
    event.item.itemPrototype.$element.classList.add('is-over');
  }

  out(event: any) {
    event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width = '';
    event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height = '';
    event.item.itemPrototype.$element.classList.remove('is-over');
  }

  deleteNote(e: Event, note: any) {
    e.preventDefault();
    this.dbService.delete(note);
  }

  editNote(e: Event, note: any) {
    e.preventDefault();
    this.accountService.edit = note;
    this.router.navigateByUrl('editor');
  }

  filterNotes(searchTerm: string) {
    if (searchTerm) {
      let results = [];
      this.data.forEach(el => {
        if ((el.title && el.title.toLowerCase().includes(searchTerm.trim().toLowerCase())) || (el.content && el.content.toLowerCase().includes(searchTerm.trim().toLowerCase()))) {
          results.push(el);
        }
      });
      this.data = results;
    } else {
      this.data = this.dbService.list;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
