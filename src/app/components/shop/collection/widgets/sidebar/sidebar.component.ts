import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AttributeService } from '../../../../../shared/services/attribute.service';
import { Params } from '../../../../../shared/interface/core.interface';
import { AttributeModel } from '../../../../../shared/interface/attribute.interface';
import { AttributeState } from '../../../../../shared/state/attribute.state';
import { GetAttributes } from '../../../../../shared/action/attribute.action';
import { BrandState } from '../../../../../shared/state/brand.state';
import { BrandModel } from '../../../../../shared/interface/brand.interface';
import { GetBrands } from '../../../../../shared/action/brand.action';

@Component({
  selector: 'app-collection-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class CollectionSidebarComponent implements OnChanges {
  // Size filter options
  sizeOptions: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
  selectedSizes: string[] = [];

  @Input() filter: Params;
  @Input() hideFilter: string[];

  @Select(AttributeState.attribute) attribute$: Observable<AttributeModel>;
  @Select(BrandState.brand) brand$: Observable<BrandModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    public attributeService: AttributeService) {
    this.store.dispatch(new GetAttributes({ status: 1}));
    this.store.dispatch(new GetBrands({status: 1}));
  }

  ngOnChanges() {
    this.selectedSizes = this.filter?.['size'] ? String(this.filter['size']).split(',') : [];
  }

  closeCanvasMenu() {
    this.attributeService.offCanvasMenu = false;
  }

  // Handle size filter toggle
  onSizeToggle(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const size = checkbox.value;
    const index = this.selectedSizes.indexOf(size);

    if (checkbox.checked && index === -1) this.selectedSizes.push(size);
    if (!checkbox.checked && index !== -1) this.selectedSizes.splice(index, 1);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        size: this.selectedSizes.length ? this.selectedSizes.join(',') : null,
        page: 1
      },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }

  checkedSize(size: string) {
    return this.selectedSizes.indexOf(size) !== -1;
  }
}


