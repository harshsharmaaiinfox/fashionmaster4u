import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, forkJoin } from 'rxjs';
import { GetProductByIds } from '../../../shared/action/product.action';
import { Denver } from '../../../shared/interface/theme.interface';
import { ThemeOptionService } from '../../../shared/services/theme-option.service';
import * as data from '../../../shared/data/owl-carousel';
import { GetBrands } from '../../../shared/action/brand.action';
import { GetStores } from '../../../shared/action/store.action';
import { ThemeOptionState } from '../../../shared/state/theme-option.state';
import { Option } from '../../../shared/interface/theme-option.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-denver',
  templateUrl: './denver.component.html',
  styleUrls: ['./denver.component.scss']
})
export class DenverComponent implements OnInit {

  @Input() data?: Denver;
  @Input() slug?: string;

  @Select(ThemeOptionState.themeOptions) themeOption$: Observable<Option>;

  public categorySlider = data.categorySlider9;
  public productSlider6ItemMargin = data.productSlider6ItemMargin;
  public heroSlider = data.heroSlider;

  public heroImages = [
    { image: 'assets/images/banner1.png' },
    { image: 'assets/images/banner2.png' }
  ];

  /** Featured products by ID: 4 top, 4 middle, 4 bottom */
  public featuredProductIds = {
    // top: [28098, 12301, 12304, 12321],
    middle: [12308, 12061, 12145, 12118],
    bottom: [12322, 12142, 12116, 12325]
  };
  public allFeaturedProductIds = [12308, 12061, 12145, 12118, 12322, 12142, 12116, 12325];

  /** Products for products_list_2 section (4 products) */
  public productsList2Ids = [12140, 12198, 12148, 12201];

  /** Products for products_list_3 section (4 products) */
  public productsList3Ids = [12135, 12134, 12137, 12141];

  constructor(private store: Store,
    private route: ActivatedRoute,
    private themeOptionService: ThemeOptionService) { }

  public exploreMoreItems = [
    {
      image: 'assets/images/dress-first.png',
      title: 'DRESS COLLECTION'
    },
    {
      image: 'assets/images/jeans.jpg',
      title: 'JEANS COLLECTION'
    },
    {
      image: 'assets/images/tshirt.jpg',
      title: 'T-SHIRT COLLECTION'
    },
    {
      image: 'assets/images/dress1.png',
      title: 'FASHION DRESSES'
    }
  ];


  public featuredProduct: any;

  ngOnInit() {
    if (this.data?.slug == this.slug) {
      const existingIds = this.data?.content?.products_ids ?? [];
      const idsToFetch = [...new Set([...existingIds, ...this.allFeaturedProductIds, ...this.productsList2Ids, ...this.productsList3Ids])];
      const getProducts$ = this.store.dispatch(new GetProductByIds({
        status: 1,
        paginate: idsToFetch.length,
        ids: idsToFetch.join(',')
      }));

      // Only call GetBrands if brand_ids exist and are not empty
      const brandIds = this.data?.content?.brands?.brand_ids;
      const getBrand$ = brandIds && brandIds.length > 0
        ? this.store.dispatch(new GetBrands({
          status: 1,
          ids: brandIds.join()
        }))
        : null;

      // Only call GetStores if store_ids exist and are not empty
      const storeIds = this.data?.content?.seller?.store_ids;
      const getStore$ = storeIds && storeIds.length > 0
        ? this.store.dispatch(new GetStores({
          status: 1,
          ids: storeIds.join()
        }))
        : null;

      // Skeleton Loader
      document.body.classList.add('skeleton-body');

      // Build array of valid API calls
      const apiCalls = [getProducts$];
      if (getBrand$) apiCalls.push(getBrand$);
      if (getStore$) apiCalls.push(getStore$);

      forkJoin(apiCalls).subscribe({
        complete: () => {
          document.body.classList.remove('skeleton-body');
          this.themeOptionService.preloader = false;

          // Select the first product as featured
          this.store.select(state => state.product.productByIds).subscribe(products => {
            if (products && products.length > 0) {
              this.featuredProduct = products[0];
            }
          });
        }
      });
    }

    this.route.queryParams.subscribe(params => {
      if (this.route.snapshot.data['data'].theme_option.productBox === 'digital') {
        if (this.productSlider6ItemMargin && this.productSlider6ItemMargin.responsive && this.productSlider6ItemMargin.responsive['1180']) {
          this.productSlider6ItemMargin = {
            ...this.productSlider6ItemMargin, items: 4, responsive: {
              ...this.productSlider6ItemMargin.responsive,
              1180: {
                items: 4
              }
            }
          }
        }
      } else {
        if (this.productSlider6ItemMargin && this.productSlider6ItemMargin.responsive && this.productSlider6ItemMargin.responsive['1180']) {
          this.productSlider6ItemMargin = {
            ...this.productSlider6ItemMargin, items: 6, responsive: {
              ...this.productSlider6ItemMargin.responsive,
              1180: {
                items: 6
              }
            }
          }
        }
      }
    })
  }

}
