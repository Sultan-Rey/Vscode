import { Component, OnInit } from '@angular/core';
import { LoadingController, PickerController, AlertController, ModalController } from '@ionic/angular';
import {ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/models/product';
import { Storage} from '@ionic/storage';
import { Address } from 'src/models/addresses';
import { User } from 'src/models/user';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit{

  civilite = ['Mr', 'Mme', 'Mlle', 'Miss', 'Other'];
  method: string;
  check: true;
  data: Product|'';
  user:  User;
  registrationForm = this.formBuilder.group({
    identification: this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      civilite: [''],
      birthday: [''],
    }),
    location: this.formBuilder.group({
      address1: ['', [Validators.required, Validators.maxLength(100)]],
      address2: [''],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$')]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
    }),
    paymethod: this.formBuilder.group({
      agree: [false, [Validators.requiredTrue]]
    }),
    security: this.formBuilder.group({
      mail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
      confirm: ['',[Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]]
    })
  });

  constructor( public loadingController: LoadingController, private alertController: AlertController,
              private pickerCtrl: PickerController, private formBuilder: FormBuilder, private modalcontroller: ModalController,
              private storage: Storage, private route: ActivatedRoute, private router: Router) {
                this.user = {} as User;
                this.user.address = {} as Address;
              }

public errorMessages = {
  name: [
    {type: 'required', message: 'Name is required' },
    {type: 'maxlenght', message: 'Name can\'t be longer than 100 characters'}
  ],
  address1: [
    {type: 'required', message: 'Main address is required' },
    {type: 'maxlenght', message: 'City can\'t be longer than 100 characters'}
  ],
  city: [
    {type: 'required', message: 'City is required' },
    {type: 'maxlenght', message: 'City can\'t be longer than 100 characters'}
  ],
  state: [
    {type: 'required', message: 'State is required' },
    {type: 'maxlenght', message: 'State can\'t be longer than 100 characters'}
  ],
  phone: [
    {type: 'required', message: 'Phone is required' },
    {type: 'pattern', message: 'Please enter a valid number phone'}
  ],
  zipcode: [
    {type: 'required', message: 'Zipcode is fully required' },
    {type: 'pattern', message: 'Please enter a valid zip code number!'}
  ],
  mail: [
    {type: 'required', message: 'E-mail is fully required' },
    {type: 'pattern', message: 'Please enter a valid email address'}
  ],
  password: [
    {type: 'required', message: 'Password is fully required' },
    {type: 'pattern', message: 'Password must be at least 8 characters with digits and uppercase'}
  ],
  method: [
    {type: 'required', message: 'Please check the box' }
  ]
};

 getName(){
   return this.registrationForm.get('identification.name');
 }
 getCivilite(){
  return this.registrationForm.get('identification.civilite');
}
getBirth(){
  return this.registrationForm.get('identification.birthday');
}
getAddress1(){
  return this.registrationForm.get('location.address1');
}
getAddress2(){
  return this.registrationForm.get('location.address2');
}
getCity(){
  return this.registrationForm.get('location.city');
}
getState(){
  return this.registrationForm.get('location.state');
}
getPhone(){
  return this.registrationForm.get('location.phone');
}
getZipcode(){
  return this.registrationForm.get('location.zipcode');
}

getMail(){
  return this.registrationForm.get('security.mail');
}
getPassword(){
  return this.registrationForm.get('security.password');
}
getConfirm(){
  return this.registrationForm.get('security.confirm');
}
getMethod(){
  return this.registrationForm.get('paymethod.method');
}
getAgree(){
  return this.registrationForm.get('paymethod.agree');
}
  public async submit() {
  
      if(this.registrationForm.valid){
       
        if ( this.registrationForm.get('security.confirm').value !== this.registrationForm.get('security.password').value) {

          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Alert',
            subHeader: 'Subtitle',
            message: 'Password & confirm must be same.',
            buttons: ['Ok']
          });
          await alert.present();
        }else{
          const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Please wait...',
            duration: 2000
          }).then((loaded)=>{
            loaded.present();
            loaded.onDidDismiss().then((dismiss)=>{
              this.storeAddress();
              this.persistenceLogin(this.registrationForm.value);
            });
          });
        
        }
        
      }else{
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          subHeader: 'Subtitle',
          message: 'Required field must be fill correctly.',
          buttons: ['Ok']
        });
        await alert.present();
      }
      
      
  }



 /*  async showMethod() {
    const opts: PickerOptions = {
      buttons: [
        {
          text: 'Done',
          role: 'Done'
        }
      ],
      columns: [
        {
          name: 'method',
          options: [
            { text: 'None', value: 'none' },
            { text: 'MonCash$', value: 'moncash' },
            { text: 'Star Card Balance', value: 'sc' },
            { text: 'PayPal', value: 'pp' },
            { text: 'Cashapp', value: 'cashapp' }
          ]

        }
      ]
    };
    const picker = await this.pickerCtrl.create(opts);
    picker.present();
    picker.onDidDismiss().then(async data => {
      const col = await picker.getColumn('method');
      this.method = col.options[col.selectedIndex].text;
      if (this.method === 'MonCash$'){
        this.openModal(this.method);
      }else if (this.method === 'PayPal'){
        this.openModal(this.method);
      }
    });
  } */

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.order;
        }
    });
  }
 

  addInfo(value: any){
    this.storage.set('moncashId', value);
    }

    persistenceLogin(register: any){

        this.user.type = "USER"
        this.user.name = register.identification.name
        this.user.email = register.security.mail;
        this.user.password = register.security.password;
        this.user.address.address1 = register.location.address1;
        this.user.address.address2 = register.location.address1;
        this.user.address.phone = register.location.phone;
        this.user.address.city =register.location.city;
        this.user.address.state=register.location.state;
        this.user.address.zipcode=register.location.zipcode;
        this.user.civilite = register.identification.civilite;
        this.user.birthday = register.identification.birthday;
        this.user.connection = true;
        this.user.status= true;
       const navigationExtras: NavigationExtras = {
        state: {
          product: this.data,
          info: this.user
        }
      };
      this.router.navigate(['/verification'], navigationExtras);
    }

    crypto(){
      let _character=['F','A','S','H','I','O','N','T','R','B','E','U','Y'];
      let sequence:number = Math.floor(Math.random()*100);
      let index:number= Math.floor(Math.random() * 12);
      let encryption:string = _character[index]+_character[index+1]+sequence;
      return encryption;
    }
    storeAddress(){
      this.storage.get("address").then((data:Address[])=>{
        if(data === null || data.length === 0){
          data=[];
          data.push({
            id: this.crypto(),
            name: this.registrationForm.get('identification.name').value,
            address1: this.registrationForm.get('location.address1').value,
            address2: this.registrationForm.get('location.address2').value,
            city: this.registrationForm.get('location.city').value,
            phone:this.registrationForm.get('location.phone').value,
            state: this.registrationForm.get('location.state').value,
            zipcode: this.registrationForm.get('location.zipcode').value,
            default: false
          });
        }else{
            data.push({
              id: this.crypto(),
              name: this.registrationForm.get('identification.name').value,
              address1: this.registrationForm.get('location.address1').value,
              address2: this.registrationForm.get('location.address2').value,
              city: this.registrationForm.get('location.city').value,
              phone:this.registrationForm.get('location.phone').value,
              state: this.registrationForm.get('location.state').value,
              zipcode: this.registrationForm.get('location.zipcode').value,
              default: false
            });
          
        }
        this.storage.set("address",data);
       
      });
    }
    
    
}
