import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AttendenceBackendService } from '../attendence-backend.service';
import { decodeToken, getToken } from '../authFunctions';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  amount : Number;
  user: any;
  constructor(private attendenceBackendService : AttendenceBackendService,private toastr: ToastrService, private router: Router ) { }

  payment(amount : Number){
    this.amount = amount;
    (async() => {
      let orderId = (await this.attendenceBackendService.createOrder({amount : this.amount }) as any).data.id;
      console.log(orderId);

      this.payWithRazor(orderId,this.amount);
    })();
  }

  payWithRazor(val:String,amount:Number) {
    const options: any = {
      key: 'rzp_test_kXOf3wAjRwPrXz',
      amount: this.amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: this.user.fullname, // company name or product name
      description: '',  // product description
      image: './assets/logo.png', // company logo or product image
      order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      this.toastr.success('Thank you for subscribing us','Success', environment.alertProperties);
      // call your backend api to verify payment signature & capture transaction
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
    });
    const rzp = new this.attendenceBackendService.nativeWindow.Razorpay(options);
    rzp.open();
  }
  ngOnInit(): void {
    let token = getToken();
    this.user = decodeToken(token);
    
    this.user = this.user._doc;
    console.log(this.user);
  }

}
