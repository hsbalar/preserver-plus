import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { GridsterComponent, IGridsterOptions, IGridsterDraggableOptions } from 'angular2gridster';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: any = [];
  widget: any = {
    x: 0, y: 0,
    w: 1, h: 1,
    dragAndDrop: true,
    resizable: true
  }
  constructor(
    public cd: ChangeDetectorRef,
    public dbService: DbService
  ) { }

  ngOnInit() {
    this.dbService.updatedList.subscribe((list) => {
      console.log(list);
      this.data = list;
      this.cd.detectChanges();
    });
  }

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
        // minWidth: 480,
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
  onReflow(event) {
    console.log('onReflow', event);
  }

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
    console.log('options change:', options);
  }

  itemChange($event: any, gridster) {
    console.log('item change', $event);
  }

  // swap() {
  //   this.widgets[0].x = 3;
  //   this.widgets[3].x = 0;
  // }

  addWidgetFromDrag(gridster: GridsterComponent, event: any) {
    const item = event.item;
    const breakpoint = gridster.options.breakpoint;
    const widget = {
      dragAndDrop: true,
      resizable: true,
      title: 'New widget'
    };

    widget[DashboardComponent.W_PROPERTY_MAP[breakpoint] || 'w'] = item.w;
    widget[DashboardComponent.H_PROPERTY_MAP[breakpoint] || 'h'] = item.h;
    widget[DashboardComponent.X_PROPERTY_MAP[breakpoint] || 'x'] = item.x;
    widget[DashboardComponent.Y_PROPERTY_MAP[breakpoint] || 'y'] = item.y;

    for (const rwdProp of ['wSm', 'hSm', 'wMd', 'hMd', 'wLg', 'hLg', 'wXl', 'hXl']) {
      if (event.item.itemPrototype.hasOwnProperty(rwdProp)) {
        widget[rwdProp] = event.item.itemPrototype[rwdProp];
      }
    }

    // this.widgets.push(widget);

    console.log('add widget from drag to:', gridster);
  }

  over(event) {
    const size = event.item.calculateSize(event.gridster);

    event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width = size.width + 'px';
    event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height = size.height + 'px';
    event.item.itemPrototype.$element.classList.add('is-over');
  }

  out(event) {
    event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.width = '';
    event.item.itemPrototype.$element.querySelector('.gridster-item-inner').style.height = '';
    event.item.itemPrototype.$element.classList.remove('is-over');
  }
}
