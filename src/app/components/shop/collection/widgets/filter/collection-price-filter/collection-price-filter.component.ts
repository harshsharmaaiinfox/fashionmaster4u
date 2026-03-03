import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Params } from '../../../../../../shared/interface/core.interface';

@Component({
  selector: 'app-collection-price-filter',
  templateUrl: './collection-price-filter.component.html',
  styleUrls: ['./collection-price-filter.component.scss']
})
export class CollectionPriceFilterComponent {

  @Input() filter: Params;

  public prices = [
    {
      id: 1,
      minPrice: 300,
      maxPrice: 500,
      value: '300-500'
    },
    {
      id: 2,
      minPrice: 500,
      maxPrice: 700,
      value: '500-700'
    },
    {
      id: 3,
      minPrice: 700,
      maxPrice: 900,
      value: '700-900'
    },
    {
      id: 4,
      minPrice: 900,
      maxPrice: 1100,
      value: '900-1100'
    },
    {
      id: 5,
      minPrice: 1100,
      maxPrice: 1300,
      value: '1100-1300'
    },
    {
      id: 6,
      price: 1300,
      text: 'Above',
      value: '1300'
    }
  ]

  public selectedPrices: string[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnChanges() {
    this.selectedPrices = this.filter['price'] ? this.filter['price'].split(',') : [];
  }

  applyFilter(event: Event) {
    const index = this.selectedPrices.indexOf((<HTMLInputElement>event?.target)?.value);  // checked and unchecked value

    if ((<HTMLInputElement>event?.target)?.checked)
      this.selectedPrices.push((<HTMLInputElement>event?.target)?.value); // push in array cheked value
    else
      this.selectedPrices.splice(index, 1);  // removed in array unchecked value

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        price: this.selectedPrices.length ? this.selectedPrices?.join(",") : null,
        page: 1
      },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    });
  }

  // check if the item are selected
  checked(item: string) {
    if (this.selectedPrices?.indexOf(item) != -1) {
      return true;
    }
    return false;
  }

}
