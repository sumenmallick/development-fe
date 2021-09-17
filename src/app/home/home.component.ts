import { UserService } from './../_services/user.service';
import { Router } from '@angular/router';
import { AuthService } from './../_services/auth.service';
import { TokenStorageService } from './../_services/token-storage.service';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from './../global-constants';
// import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
// import { EventEmitter } from 'stream';
import { Output,EventEmitter } from '@angular/core';
import { MapsAPILoader,AgmMap } from '@agm/core';
// import { google } from "google-maps";
import { Options,LabelType } from 'ng5-slider';
import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { stringify } from '@angular/compiler/src/util';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  [x: string]: any;
  currentUser: any;
  currentUserid: any;
  form: any = {};
  data: any = {};
  content: any = {};
  number: any = {};
  productId =[];
  login: any;
  ftpstring = GlobalConstants.ftpURL;
  city: any;
  selectedItems:string[];
  amenityArray = [];
  showLoadingIndicator = false;
  public testimonial_length:number=0;
  public product_length:number=0;
  public rent_range_slider:boolean= true;
  public buyyer_range_slider:boolean= false;
  e: any={};

  options: Options = {
    step:100,
    floor: 1,
    ceil: 500000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    },
  };
  options_sales: Options = {
    step:500,
    floor: 500000,
    ceil: 50000000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    }
  };
  
  public property_type:any;
  public property_type_result:any;
  public property_type_count:any;
  build_name:any;
  Location:any; 
  type:number;
  Bathrooms:any;
  Bedrooms:any;
  availability_condition:any;
  area_unit:any;
  Years:number;
  Minimum:number=0;
  Maximum:number=500000;
  geoCoder:any;
  latCus=78.89;
  longCus=76.897;
  @ViewChild("search") searchElementRef: ElementRef;
  @ViewChild(AgmMap,{static: true}) public agmMap: AgmMap;
  zoom: number;
  location: string;

  public constructor(
    private titleService: Title,
    private tokenService: TokenStorageService,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private idservice: TokenStorageService,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone:NgZone,
    private toastr: ToastrService
  ){
  }

// iqbal define funtion
  prod_func(data: string){
    this.idservice.saveProdId(data);
  }


  ngOnInit(): void {
    this.form.Minimum=1;
    this.form.Maximum=500000;
    this.form.search_type='rent';
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.latCus = place.geometry.location.lat();
          this.longCus = place.geometry.location.lng();
          this.location = place.formatted_address;
          this.zoom = 15;
          // console.log(this.latCus);
          // console.log(this.location);
          this.form.Location=this.location;
          // this.form.map_latitude=this.latCus;
          // this.form.map_longitude=this.longCus;
        
        });
      });
    });

    this.selectedItems = new Array<string>();
    this.home_call();
    this.amenities();
    this.Property_type_data();
    this.gettestimonialdata();
    
    if (this.tokenStorage.getToken() != null){
      this.titleService.setTitle('Housing Street');
      this.currentUser = this.tokenService.getUser().username;
      this.currentUserid = this.tokenService.getUser().id;
      this.login = this.tokenService.getToken();
    }
  }

// product comaprision functinalty 
product_comp(id:number){
  //console.log(id);
  // Login check
  if(this.tokenStorage.getUser() != null){
    this.isLoggedIn = true
    //console.log(this.isLoggedIn);
    this.maintenance = true;
    this.parking = false;     
      this.authService.Crete_product_comp(id).pipe().subscribe(
        (data: any) =>{
          //console.log(data);
          this.home_call();
          //console.log(data.data.length);
          if(data.data.length>4){
            this.toastr.info('Bucket are the Full...!!!', 'Property', {
              timeOut: 3000,
            });
          }else{
            this.toastr.success('Succesfully Added in Bucket...', 'Property', {
              timeOut: 3000,
            });
          }
        },
        err => {
          //console.log(err.error);
        }
      );
  }
  else{
    this.redirect_to_home();
  }
}

  wishlist_added(data: any){
    // Login check
    if(this.tokenStorage.getUser() != null){
      this.isLoggedIn = true
      //console.log(this.isLoggedIn);
    }
    else{
      this.redirect_to_home();
    }
    this.maintenance = true;
    this.parking = false;
    if (this.tokenStorage.getToken()){
      this.isLoggedIn = true;      
      this.authService.Wishlist(data).pipe().subscribe(
        (result: any) =>{
          //console.log(result);
          this.home_call();
        },
        err => {
          //console.log(err.error);
        }
      );

    }
    else{
      this.isLoggedIn = false ;
    }
  }
  
  // encryptData(data) {
  //   try {
  //     return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  Wishlist_remove(data: any){
    if(this.tokenStorage.getUser() != null){
      this.isLoggedIn = true;
       this.authService.WishlistRemove(data).pipe().subscribe(
        (result: any) =>{
          //console.log(result);
          this.home_call();
        },
        err => {
          //console.log(err.error);
        }
      );
    }
    else{
      this.redirect_to_home();
    }
    
  }
  
  redirect_to_home(): void {
    window.location.href=GlobalConstants.siteURL="login"
    }

    getwishlist(): void{
      this.userService.getwishlistdata().pipe().subscribe(
        (wishlistdata: any) => {
          //  console.log(amenitiesdata);
          this.wishlistcontent = wishlistdata.data;
          this.wishlistresult = this.wishlistcontent;
          //console.log(this.wishlistresult);
          //console.log(this.content);
        },
        err => {
          this.content = JSON.parse(err.error).message;
		  this.content = err.error.message;								   
        }
      );
    }
    
  // pricre convert functionalty
  Price_convert(num: number) {
    if (num >= 1000000000) {
       return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'G';
    }
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2).replace(/\.0$/, '') + 'Crore';
    }
    if (num >= 100000) {
      return (num / 100000).toFixed(2).replace(/\.0$/, '') + 'Lac';
    }
    if (num >= 1000) {
      this.e=num;
      var t = (this.e = this.e ? this.e.toString() : "").substring(this.e.length - 3)
      , n = this.e.substring(0, this.e.length - 3);
    return "" !== n && (t = "," + t),
      n.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + t
    }
    return num;
  }
  
  home_call(): void{
    if(this.tokenStorage.getToken()){
      this.isLoggedIn = true;  
      this.showLoadingIndicator = true;
      this.authService.getproductWishlist().pipe().subscribe(
        (product: any) => {  
          this.content = product.data;
          this.number = this.content;
          this.product_length=this.content.length;
          // console.log(this.number);
          //console.log(this.number.length);
          this.showLoadingIndicator = false;
          this.wishlist_info();
          this.pro_comp_refresh();
        },
        err => {
          //this.content = JSON.parse(err.error).message;
          this.content = err.error.message;
        }
      );   
    }else{
      this.showLoadingIndicator = true;
      this.userService.getproductlistingfeatured().pipe().subscribe(
        (data: any) => {
          this.content = data.data;
          this.number = this.content;
          this.product_length=this.content.length;
          this.showLoadingIndicator = false;
          //console.log(this.number);        
        },
        err => {
          //this.content = JSON.parse(err.error).message;
          this.content = err.error.message;
        }
      );
    }
  }
 
  amenities(): void{
    this.userService.getamenitiesdata().pipe().subscribe(
      (amenitiesdata: any) => {
        //  console.log(amenitiesdata);
        this.amenities = amenitiesdata.data;
        this.amenitiesresult = this.amenities;
        //console.log(this.amenitiesresult);
        //console.log(this.content);
      },
      err => {
        //this.content = JSON.parse(err.error).message;
        this.content = err.error.message;
      }
    );
  }
  gettestimonialdata(): void{
    this.userService.gettestimonialdata().pipe().subscribe(
      (Reviewdata: any) => {
        this.contenttestimonial = Reviewdata.data;
        this.testimonial = this.contenttestimonial;
        this.testimonial_length= this.testimonial.length;
        //console.log(this.testimonial);
        //console.log(this.content);
      },
      err => {
        this.content = err.error.message;
      }
    );
  }
  
  viewStationData(id: number) {
    //console.log(id);
    this.router.navigate(["productpage/", id]);
  }
  
 onchangeAmenties(e:any,id:string){
    if(e.target.checked){
      //console.log(id + 'Checked');
      this.selectedItems.push(id);
    }else{
      
      //console.log(id + 'UNChecked');
      this.selectedItems= this.selectedItems.filter(m=>m!=id);
    }
    this.amenityArray=this.selectedItems;
   //console.log(this.amenityArray);

  }
  onSearch(): void{
    //console.log(this.form,this.amenityArray);
    if(this.tokenStorage.getToken()){
      //console.log("login");
      this.isLoggedIn = true; 
      this.authService.Login_search_home(this.form,this.amenityArray).subscribe(
        data => {
          //console.log(data);
          this.tokenService.searchData(data);
          //console.log(this.tokenService.returnSearch());
          this.data_session=[this.form,this.amenityArray];
          this.tokenService.search_formData(this.data_session);
          //console.log(this.tokenService.get_formData());
          window.location.href=GlobalConstants.siteURL+"productlisting"
        },
        err => {
          this.err_caused = true;
          this.errorMessage = err.error.errors;
          //console.log(this.errorMessage);
        }
      );
    }
    else{
       //console.log("withoutlogin");
      this.authService.search(this.form,this.amenityArray).subscribe(
        data => {
          //console.log(data);
          this.tokenService.searchData(data);
          //console.log(this.tokenService.returnSearch());
          this.data_session=[this.form,this.amenityArray];
          this.tokenService.search_formData(this.data_session);
          //console.log(this.tokenService.get_formData());
          window.location.href=GlobalConstants.siteURL+"productlisting"
        },
        err => {
          this.err_caused = true;
          this.errorMessage = err.error.errors;
          //console.log(this.errorMessage);
        }
      );
    }
  }
  

  property_search(event: any): void{
    //console.log(event)
    this.authService.city_search(event).subscribe(
      data => {
        this.tokenService.searchData(data);
      },
      err => {
        //console.log(err.error.message);
      }
    );
    //console.log(this.tokenService.returnSearch().product.data);
      window.location.href=GlobalConstants.siteURL+"search"
      // this.router.navigate(["/search"])

  }

  // comparison funtion property
  
  onComp(data){
    if(this.first_prod == null){
      this.first_prod = data
    }
    else if(this.first_prod != null){
      if (this.second_prod != null){
        this.third_prod = this.second_prod
        this.second_prod = this.first_prod
        this.first_prod = data
      }
      else{
      this.second_prod = data
      }
    }

    //console.log(this.first_prod+"|"+this.second_prod)

    if (this.first_prod != null && this.second_prod != null && this.third_prod != null){

      // alert("Added two property to compare list. (Only two properties can be compared at a time)")

      this.idservice.saveProdId(this.first_prod);
      this.idservice.saveCdata(this.second_prod)
      this.idservice.saveProd2Id(this.third_prod);
      window.location.href=GlobalConstants.siteURL+"compare"
    }

    //console.log(this.idservice.getProdId());
    //console.log(this.idservice.getProd2Id());
    //console.log(this.idservice.getCdata());



  }

  rent_price_fun(){
    this.form.Minimum=1;
    this.form.Maximum=500000;
    this.form.search_type='rent';
    this.rent_range_slider=true;
    this.buyyer_range_slider=false;
  }
  buyyer_price_fun(){
    this.form.Minimum=500000;
    this.form.Maximum=50000000;
    this.form.search_type='sales';
    this.rent_range_slider=false;
    this.buyyer_range_slider=true;
  }
  Property_type_data(): void{
    this.userService.get_property_type().pipe().subscribe(
      (data: any) => {
         //console.log(data);
        this.property_type_data = data.data;
        this.property_type_result = this.property_type;
        this.property_type_count=data.count;
        //console.log(this.property_type_count);
        //console.log(this.property_type_data);
        //console.log(this.content);
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

// wishlist refreh functionalty 
wishlist_info(){
  this.userService.emit<string>('true');
 } 
  // topbar proeprty comparion functionalty
  pro_comp_refresh(){
    this.userService.pro_comp_emit<string>('true');
  } 

  // property comparision redirect comapre page 
  redirect_to_compare(): void {
    window.location.href=GlobalConstants.siteURL="compare"
  }
// carosule image
customOptions: OwlOptions = {
  loop:true,
  dots:true,
  autoplay:true,
  autoplayTimeout:4000,
  // items:3,
  autoplayHoverPause:true,
  responsive: {
    0: {
      items: 1
    },
    400: {
      items: 1
    },
    740: {
      items: 1
    },
    940: {
      items: 3
    },
    1050: {
      items: 3
    },
    1250: {
      items: 3
    }
  },
  nav: false
}  

}
