import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/models/cartItem';
import { Order } from 'src/models/order';
import { Product } from 'src/models/product';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {

  data: Order;
  product: CartItem[];
  qty: number;
  orderId: string='';
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.order;
      }
    });
    this.product = this.data.items;
    this.qty=this.data.order_qty;
    this.orderId=this.data.orderId;
  }

}
