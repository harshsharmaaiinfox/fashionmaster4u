import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Values, DeliveryBlock } from '../../../../shared/interface/setting.interface';

@Component({
  selector: 'app-delivery-block',
  templateUrl: './delivery-block.component.html',
  styleUrls: ['./delivery-block.component.scss']
})
export class DeliveryBlockComponent {

  @Input() setting: Values;

  @Output() selectDelivery: EventEmitter<DeliveryBlock> = new EventEmitter();

  public deliveryType: string | null = null;
  public delivery_description: string | null = null;

  ngOnInit() {
    if(this.setting?.delivery){
      // Automatically emit the selectAddress event for the first item if it's available
      let delivery: DeliveryBlock = {
        delivery_description: this.setting.delivery?.default?.title+ ' | ' +this.setting.delivery?.default?.description,
      }
      this.selectDelivery.emit(delivery);
    }
  }

  setDeliveryDescription(value: string, type: string) {
    this.delivery_description = value!;
    this.deliveryType = type;
    let delivery: DeliveryBlock = {
      delivery_description: this.delivery_description,
    }
    this.selectDelivery.emit(delivery);
  }


}
