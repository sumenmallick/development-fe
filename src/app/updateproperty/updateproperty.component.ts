import { HttpParams } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UserService } from './../_services/user.service';
import { GlobalConstants } from './../global-constants';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../_services/auth.service';
import { TokenStorageService } from './../_services/token-storage.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Validators } from '@angular/forms';
import { Options, LabelType } from 'ng5-slider';
import { FormBuilder } from '@angular/forms';
import { MapsAPILoader, AgmMap } from '@agm/core';
// import { google } from "google-maps";
import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { InternalUserService } from './../_services/internal-user.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-updateproperty',
  templateUrl: './updateproperty.component.html',
  styleUrls: ['./updateproperty.component.css']
})
export class UpdatepropertyComponent implements OnInit {
  addition_room: addition_room = [
    { id: 1, name: "Other Room" },
    { id: 2, name: "Pooja Room" },
    { id: 3, name: "Study Room" },
    { id: 4, name: "Servant Room" }
  ];

  selectedId: number;

  ftpstring: string = GlobalConstants.ftpURL;
  usertype;
  id;
  data_id: number = null;

  image1: string | ArrayBuffer;
  image2: string | ArrayBuffer;
  image3: string | ArrayBuffer;
  image4: string | ArrayBuffer;
  image5: string | ArrayBuffer;

  product_img_length: number = 0;
  amenitiesresult: () => void;
  errorMessage1: any;
  build_name: any;
  type: any;
  willing_to_rent_out_to: any;
  agreement_type: any;
  address: any;
  city: any;
  locality: any;
  property_detail: any;
  nearest_landmark: any;
  map_latitude: any;
  map_longitude: any;

  files_length: number;
  display_address: any;
  area: any;
  area_unit: any;
  carpet_area: any;
  bedroom: any;
  bathroom: any;
  balconies: any;
  additional_rooms: any;
  furnishing_status: any;
  furnishings: any;
  total_floors: any;
  property_on_floor: any;
  // rera_registration_status: any;
  additional_parking_status: any;
  parking_covered_count: any;
  expected_pricing: any;
  // possession_by: any;
  tax_govt_charge: any;
  price_negotiable: any;
  facing_towards: any;
  // availability_condition: any;
  buildyear: any;
  age_of_property: any;
  expected_rent: any;
  description: any;
  inc_electricity_and_water_bill: any;
  month_of_notice: any;
  duration_of_rent_aggreement: any;
  security_deposit: any;
  rent_availability: any;
  rent_cond: any;
  ownership: any;
  available_for: any;
  nearby_places: any;
  video_link: any;
  equipment: any;
  features: any;
  userEmail: any;
  userProfile: any;
  form: any = {};
  ared: any = {};
  isLoggedIn = false;
  isFormSubmitted = false;
  public isLoaded: boolean = true;
  public isLoaded1: any = {};
  public errorMessage: any = {};
  Message: any = {};
  roles: string[] = [];
  saleValue: boolean = true;
  rentValue: boolean = false;
  furnish: boolean = false;
  maintenance: boolean = true;
  parking: boolean = false;
  negotiable_status: any;
  pincode: any;
  additional_rooms_status: any;
  product_img: any = {};
  amenityArray = [];
  amenity_Uncheck = [];
  varAmenity: string;
  furnishingArray = [];
  varfurnishing: string;
  text: string; url: any;
  err_caused: boolean = false;
  selectedItems: string[];
  Uncheck_Items: string[];
  additional_room_array = [];
  add_room_array: any = [];
  update_room_array: any = [];
  unique_room_array: any = [];
  add_room_string: any = [];
  dropdownList = [];
  content: any = {};
  product_amenties: any;
  public property_type: any;
  public property_type_result: any;
  public price_negotiable_row: boolean = false;
  public parking_row: boolean = false;
  public maintenance_row: boolean = false;
  public furnish_row: boolean = false;
  public Add_room_tab: boolean = false;
  public show_draft_btn: boolean = false;

  public response: any;
  public user_id: any = {};
  public controls: any;
  public userDetails: any;

  filteredOptions: Observable<any[]>;

  update_property_rent = this.fb.group({
    Property_Details: new FormGroup({
      build_name: new FormControl('', Validators.required),
      draft_form_id: new FormControl(''),
      type: new FormControl('', Validators.required),

      area: new FormControl(''),
      area_unit: new FormControl('', Validators.required),
      bedroom: new FormControl('', Validators.required),
      bathroom: new FormControl('', Validators.required),
      balconies: new FormControl('', Validators.required),
      property_detail: new FormControl('', Validators.required)
    }),

    Property_address: new FormGroup({
      address: new FormControl('', Validators.required),
      map_latitude: new FormControl('', Validators.required),
      map_longitude: new FormControl('', Validators.required),
      city: new FormControl('Delhi', Validators.required),
      locality: new FormControl(''),
      pincode: new FormControl(''),
      nearest_landmark: new FormControl('')
    }),

    Property_additional_details: new FormGroup({
      additional_rooms_status: new FormControl('0'),
      furnishings: new FormControl(''),
      furnishing_status: new FormControl('NFR'),
      facing_towards: new FormControl(''),
      // rera_registration_status: new FormControl(''),
      additional_parking_status: new FormControl('0'),
      buildyear: new FormControl('', Validators.required),
      // availability_condition: new FormControl(''),
      // possession_by: new FormControl(''),
      property_on_floor: new FormControl(''),
      total_floors: new FormControl(''),
      willing_to_rent_out_to: new FormControl(''),
      agreement_type: new FormControl(''),
      available_for: new FormControl(''),
      rent_cond: new FormControl(''),
      duration_of_rent_aggreement: new FormControl(''),
      ownership: new FormControl(''),
      month_of_notice: new FormControl(''),
      parking_covered_count: new FormControl(''),
      parking_open_count: new FormControl('')
    }),

    Property_price_images: new FormGroup({
      expected_rent: new FormControl('5000'),
      security_deposit: new FormControl('', Validators.required),
      inc_electricity_and_water_bill: new FormControl('', Validators.required),
      tax_govt_charge: new FormControl('', Validators.required),
      price_negotiable: new FormControl(''),
      negotiable_status: new FormControl('0'),
      maintenance_charge_status: new FormControl('0'),
      maintenance_charge: new FormControl(''),
      maintenance_charge_condition: new FormControl(''),
      video_link: new FormControl('')
    })
  });

  imagePre1: any;
  imagePre2: any;
  imagePre3: any;
  imagePre4: any;
  imagePre5: any;

  maintenance_charge: any;
  maintenance_charge_status: any;
  maintenance_charge_condition: any;
  parking_open_count: any;
  Amenties_id: any;
  Amenties_length: number;
  product_amenties_length: number = null;
  p_images: number = 5;
  public showLoadingIndicator: boolean = false;
  Expected_PriceEroor: boolean = false;
  update_product_img: string[];
  geoCoder: any;
  // searchElementRef:any;
  latCus: any;
  longCus: any;
  @ViewChild("search") searchElementRef: ElementRef;
  @ViewChild(AgmMap, { static: true }) public agmMap: AgmMap;
  zoom: number;
  location: string;

  options: Options = {
    // step:500,
    floor: 5000,
    ceil: 500000,
    translate: (value: number, label: LabelType): string => {
      return '₹' + value.toLocaleString('en');
    }
  };


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private internalUserService: InternalUserService
  ) {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
    this.getLocation();
  }

  get f() {
    return this.update_property_rent.controls;
  }


  ngOnInit(): void {
    if (this.tokenStorage.getToken() != null) {
      this.isLoggedIn = true;
      if (this.tokenStorage.getUser().misc) {
        console.log(this.tokenStorage.getUser());
        this.user_id = this.tokenStorage.getUser().id;
      }
      else {
        console.log(this.tokenStorage.getUser());
        this.userDetails = JSON.parse(this.tokenStorage.getUser());
        this.user_id = this.userDetails.id;
      }
      this.property_details(this.id);
      this.amenities();
      this.Property_type_data();
      this.get_area();
    }
    else {
      this.isLoggedIn = false;
      this.redirect_to_home();
    }

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
          //console.log(this.latCus);
          //console.log(this.location);
          this.update_property_rent.controls.Property_address.patchValue({
            address: this.location,
            map_latitude: this.latCus,
            map_longitude: this.longCus,
          });

        });
      });
    });

    this.filteredOptions = this.update_property_rent.controls.Property_address.get('locality').valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filter(value))
      );

    this.selectedItems = new Array<string>();
    this.Uncheck_Items = new Array<string>();
    this.update_product_img = new Array<string>();
  }

  getLocation() {
    this.userService.getLocationService().then(resp => {
      //console.log(resp.lng);
      //console.log(resp); 
      this.longCus = resp.lng;
      this.latCus = resp.lat;
      this.update_property_rent.controls.Property_address.patchValue({
        address: this.location,
        map_latitude: this.latCus,
        map_longitude: this.longCus,
      });
    })
  }

  markerDragEnd($event: google.maps.MouseEvent) {
    this.latCus = $event.latLng.lat();
    this.longCus = $event.latLng.lng();

    this.geoCoder.geocode({ 'location': { lat: this.latCus, lng: this.longCus } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          //console.log(results[0].formatted_address);
          this.update_property_rent.controls.Property_address.patchValue({
            address: results[0].formatted_address,
            map_latitude: this.latCus,
            map_longitude: this.longCus,
          });
        } else {
          //console.log('No results found');
        }
      } else {
        //console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  property_details(p_id): void {
    //console.log(p_id);
    this.id = p_id;
    this.showLoadingIndicator = true;
    this.authService.Propery_get_id(this.id).subscribe(
      (data: any) => {
        // console.log(data);
        this.data_id = data.data.id;
        if (this.data_id == 0) {
          this.redirect_to_myproperties();
        }
        this.add_room_string = data.data.additional_rooms;
        this.add_room_array = this.add_room_string.split(',');
        if (data.data.additional_rooms.length) {
          this.update_room_array = this.add_room_array;
          // console.log(this.update_room_array);
        }
        if (data.data.draft == 1) {
          this.show_draft_btn = true;
        }
        this.product_img = data.data.product_img;
        this.product_img_length = this.product_img.length;
        //console.log(this.product_img);
        //console.log(this.product_img_length);
        this.product_amenties = data.data.amenities;
        //console.log(this.product_amenties);
        this.product_amenties_length = data.data.amenities.length;
        //console.log(this.product_amenties_length);

        this.url = this.ftpstring;

        this.id = data.data.id;
        this.build_name = data.data.build_name;
        this.type = data.data.type;
        this.willing_to_rent_out_to = data.data.willing_to_rent_out_to;
        this.agreement_type = data.data.agreement_type;
        this.address = data.data.address;
        this.city = data.data.city;
        this.locality = data.data.locality;
        this.property_detail = data.data.property_detail;
        this.nearest_landmark = data.data.nearest_landmark;
        this.map_latitude = data.data.map_latitude;
        this.map_longitude = data.data.map_longitude;
        this.display_address = data.data.display_address;
        this.area = data.data.area;
        this.area_unit = data.data.area_unit;
        this.carpet_area = data.data.carpet_area;
        this.bedroom = data.data.bedroom;
        this.bathroom = data.data.bathroom;
        this.balconies = data.data.balconies;
        this.additional_rooms = data.data.additional_rooms;
        this.furnishing_status = data.data.furnishing_status;
        this.furnishings = data.data.furnishings;
        this.total_floors = data.data.total_floors;
        this.property_on_floor = data.data.property_on_floor;
        //  this.rera_registration_status = data.data.rera_registration_status;
        this.additional_parking_status = data.data.additional_parking_status;
        this.parking_covered_count = data.data.parking_covered_count;
        //  this.possession_by = data.data.possession_by;
        this.negotiable_status = data.data.negotiable_status;
        this.pincode = data.data.pincode;
        this.additional_rooms_status = data.data.additional_rooms_status;
        this.tax_govt_charge = data.data.tax_govt_charge;
        this.price_negotiable = data.data.price_negotiable;
        this.facing_towards = data.data.facing_towards;
        //  this.availability_condition = data.data.availability_condition;
        this.buildyear = data.data.buildyear;
        this.age_of_property = data.data.age_of_property;
        this.expected_rent = data.data.expected_rent;
        this.expected_pricing = data.data.expected_pricing;
        this.description = data.data.description;
        this.inc_electricity_and_water_bill = data.data.inc_electricity_and_water_bill;
        this.month_of_notice = data.data.month_of_notice;
        this.duration_of_rent_aggreement = data.data.duration_of_rent_aggreement;
        this.security_deposit = data.data.security_deposit;
        this.rent_availability = data.data.rent_availability;
        this.rent_cond = data.data.rent_cond;
        this.ownership = data.data.ownership;
        this.available_for = data.data.available_for;
        this.nearby_places = data.data.nearby_places;
        this.equipment = data.data.equipment;
        this.features = data.data.features;
        this.maintenance_charge = data.data.maintenance_charge,
          this.maintenance_charge_status = data.data.maintenance_charge_status;
        this.maintenance_charge_condition = data.data.maintenance_charge_condition;
        this.parking_open_count = data.data.parking_open_count;
        this.video_link = data.data.video_link;


        // property details form control 
        this.update_property_rent.controls.Property_Details.patchValue({
          build_name: this.build_name,
          area: this.area,
          property_detail: this.property_detail,
        });
        if (this.type) {
          this.update_property_rent.controls.Property_Details.patchValue({
            type: this.type,
          });
        }
        if (this.area_unit) {
          this.update_property_rent.controls.Property_Details.patchValue({
            area_unit: this.area_unit,
          });
        }
        if (this.bedroom) {
          this.update_property_rent.controls.Property_Details.patchValue({
            bedroom: this.bedroom,
          });
        }
        if (this.bathroom) {
          this.update_property_rent.controls.Property_Details.patchValue({
            bathroom: this.bathroom,
          });
        }
        if (this.balconies) {
          this.update_property_rent.controls.Property_Details.patchValue({
            balconies: this.balconies,
          });
        }
        // property location form controls
        this.update_property_rent.controls.Property_address.patchValue({
          address: this.address,
          map_latitude: this.map_latitude,
          map_longitude: this.map_longitude,
          city: this.city,
          //pincode: this.pincode,
          nearest_landmark: this.nearest_landmark,
        });
        if (this.locality) {
          // console.log(this.locality);
          this.locality = JSON.parse(this.locality);
          /*this.update_property_rent.controls.Property_address.patchValue({
            locality: this.locality.id,
          });*/
          this.update_property_rent.controls.Property_address.get('locality').patchValue(this.locality);
          this.update_property_rent.controls.Property_address.patchValue({
            pincode: this.locality.item_pincode
          });
        }

        // property addtional details form control
        if (this.additional_rooms_status) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            additional_rooms_status: this.additional_rooms_status,
          });
        }
        if (this.facing_towards) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            facing_towards: this.facing_towards,
          });
        }
        // if(this.rera_registration_status){
        //   this.update_property_rent.controls.Property_additional_details.patchValue({
        //     rera_registration_status:this.rera_registration_status,
        //   });   
        // }

        if (this.furnishing_status) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            furnishing_status: this.furnishing_status,
          });
        }
        if (this.additional_parking_status) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            additional_parking_status: this.additional_parking_status,
          });
        }
        if (this.buildyear) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            buildyear: this.buildyear,
          });
        }
        // if(this.availability_condition  !=null){
        //   this.update_property_rent.controls.Property_additional_details.patchValue({
        //     availability_condition:this.availability_condition,
        //   });   
        // }
        if (this.willing_to_rent_out_to != null) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            willing_to_rent_out_to: this.willing_to_rent_out_to,
          });
        }
        if (this.agreement_type != null) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            agreement_type: this.agreement_type,
          });
        }
        if (this.available_for != null) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            available_for: this.available_for,
          });
        }
        if (this.month_of_notice != null) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            month_of_notice: this.month_of_notice,
          });
        }
        if (this.duration_of_rent_aggreement != null) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            duration_of_rent_aggreement: this.duration_of_rent_aggreement,
          });
        }
        // if(this.possession_by  !=null){
        //   this.update_property_rent.controls.Property_additional_details.patchValue({
        //     possession_by:this.possession_by,
        //   });   
        // }
        if (this.property_on_floor != null) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            property_on_floor: this.property_on_floor,
          });
        }
        if (this.total_floors) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            total_floors: this.total_floors,
          });
        }
        if (this.parking_covered_count) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            parking_covered_count: this.parking_covered_count,
          });
        }
        if (this.parking_open_count) {
          this.update_property_rent.controls.Property_additional_details.patchValue({
            parking_open_count: this.parking_open_count,
          });
        }
        // property pricing & images form control

        if (this.video_link) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            video_link: "https://www.youtube.com/watch?v=" + this.video_link,
          });
        } else {
          this.update_property_rent.patchValue({
            video_link: this.video_link,
          });
        }
        if (this.security_deposit) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            security_deposit: this.security_deposit,
          });
        }

        if (this.ownership) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            ownership: this.ownership,
          });
        }
        if (this.expected_pricing) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            expected_pricing: this.expected_pricing,
          });
        }
        if (this.inc_electricity_and_water_bill != null) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            inc_electricity_and_water_bill: this.inc_electricity_and_water_bill,
          });
        }
        // console.log(this.tax_govt_charge);
        if (this.tax_govt_charge != null) {
          // console.log(this.tax_govt_charge);
          this.update_property_rent.controls.Property_price_images.patchValue({
            tax_govt_charge: this.tax_govt_charge,
          });
        }
        if (this.price_negotiable) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            price_negotiable: this.price_negotiable,
          });
        }
        if (this.negotiable_status) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            negotiable_status: this.negotiable_status,
          });
        }
        if (this.maintenance_charge_status) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            maintenance_charge_status: this.maintenance_charge_status,
          });
        }
        if (this.maintenance_charge) {
          this.update_property_rent.controls.Property_price_images.patchValue({
            maintenance_charge: this.maintenance_charge,
          });
        }
        // console.log(this.maintenance_charge_condition);
        if (this.maintenance_charge_condition) {
          // console.log(this.maintenance_charge_condition);
          this.update_property_rent.controls.Property_price_images.patchValue({
            maintenance_charge_condition: this.maintenance_charge_condition,
          });
        }
        this.showLoadingIndicator = false;
      }
    );

  }
  price_nego_Change(event) {
    //console.log(event);
  }
  onChange(UpdatedValue: string): void {
    this.text = UpdatedValue;
    this.amenityArray.push(UpdatedValue);
  }

  amenity(event): void {
    //console.log(event)
    this.amenityArray.push(event);

    //console.log(this.amenityArray);
  }
  onchangeAmenties(e: any, id: string) {
    //console.log(e.target.checked);
    if (e.target.checked) {
      //console.log(id + 'Checked');
      this.selectedItems.push(id);
      this.Uncheck_Items = this.Uncheck_Items.filter(m => m != id);
    } else {

      //console.log(id + 'UNChecked');
      this.Uncheck_Items.push(id);
      this.selectedItems = this.selectedItems.filter(m => m != id);
    }
    this.amenityArray = this.selectedItems;
    this.amenity_Uncheck = this.Uncheck_Items;

  }

  onchange_rooms(e: any, room: string) {
    if (e.target.checked) {
      this.update_room_array.push(room);
      const expected = new Set();
      const unique = this.update_room_array.filter(item => !expected.has(JSON.stringify(item)) ? expected.add(JSON.stringify(item)) : false);
      this.unique_room_array = unique;
      this.additional_room_array = this.unique_room_array;
    } else {
      // arr.pop();
      const index: number = this.update_room_array.indexOf(room);
      if (index !== -1) {
        this.update_room_array.splice(index, 1);
        this.additional_room_array = this.update_room_array;
      }
    }
    // console.log(this.additional_room_array);
  }

  add_room_check(room: any) {
    // var len= this.product_amenties.length; 
    if (this.add_room_array.length != null) {
      for (let i = 0; i < this.add_room_array.length; i++) {
        if (room == this.add_room_array[i]) {
          return true;
        }
      }
    }
    return false;
  }

  furnishing(event): void {
    //console.log(event)
    this.furnishingArray.push(event);

    //console.log(this.furnishingArray);
  }

  insert_image1(event: { target: { files: string | any[]; }; }) {
    this.files_length = this.p_images - this.product_img_length;
    if (event.target.files.length <= this.files_length) {
      for (let i = 0; i <= this.files_length; i++) {
        if (i == 0) {
          this.readThis1(event.target.files[0]);
        }
        if (i == 1) {
          this.readThis2(event.target.files[1]);
        }
        if (i == 2) {
          this.readThis3(event.target.files[2]);
        }
        if (i == 3) {
          this.readThis4(event.target.files[3]);
        }
        if (i == 4) {
          this.readThis5(event.target.files[4]);
        }
      }
    } else {
      this.toastr.error("Maximum (" + this.files_length + ") Images Selected", 'Image Upload Error!!!...', {
        timeOut: 1500,
      });
    }
  }


  readThis1(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image1 = myReader.result;
      this.imagePre1 = this.image1;
      if (this.imagePre1 != null) {
        this.update_product_img.push(this.imagePre1);
      }
    }
    myReader.readAsDataURL(file);
  }

  insert_image2(event) {

    this.readThis2(event.target)

  }
  readThis2(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image2 = myReader.result;
      this.imagePre2 = this.image2;
      if (this.imagePre2 != null) {
        this.update_product_img.push(this.imagePre2);
      }
    }
    myReader.readAsDataURL(file);
  }
  insert_image3(event) {

    this.readThis3(event.target)

  }
  readThis3(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image3 = myReader.result;
      this.imagePre3 = this.image3;
      if (this.imagePre3 != null) {
        this.update_product_img.push(this.imagePre3);
      }
    }
    myReader.readAsDataURL(file);
  }
  insert_image4(event) {

    this.readThis4(event.target)

  }
  readThis4(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image4 = myReader.result;
      this.imagePre4 = this.image4;
      if (this.imagePre4 != null) {
        this.update_product_img.push(this.imagePre4);
      }
    }
    myReader.readAsDataURL(file);
  }
  insert_image5(event) {

    this.readThis5(event.target)

  }
  readThis5(inputValue: any): void {
    var file: File = inputValue;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image5 = myReader.result;
      this.imagePre5 = this.image5;
      if (this.imagePre5 != null) {
        this.update_product_img.push(this.imagePre5);
      }
    }
    myReader.readAsDataURL(file);
  }


  delete_pic1() {
    this.imagePre1 = null;
  }
  delete_pic2() {
    this.imagePre2 = null;
  }
  delete_pic3() {
    this.imagePre3 = null;
  }
  delete_pic4() {
    this.imagePre4 = null;
  }
  delete_pic5() {
    this.imagePre5 = null;
  }


  onchange_locality(id: any) {
    this.authService.get_pincodebyid(id.option.value.item_id).subscribe(
      data => {
        ;
        this.update_property_rent.controls.Property_address.patchValue({
          pincode: data.data.pincode,
        });
      },
      err => {
        // console.log(err);
      }
    );
  }

  onchange_add_room(event: any) {
    if (event == 1) {
      this.Add_room_tab = true;
    } else {
      this.Add_room_tab = false;
    }
  }
  furnishStatus(event): void {
    if (event == 'FFR') {
      this.furnish_row = true;
    }
    else {
      this.furnish_row = false;
    }
  }
  parkingStatus(event): void {
    if (event == 1) {
      this.parking_row = true;
    }
    else {
      this.parking_row = false;
    }
  }
  price_negotiable_status(event): void {
    if (event == 1) {
      this.price_negotiable_row = true;
    }
    else {
      this.price_negotiable_row = false;
    }
  }

  maintenanceStatus(event): void {
    if (event == 1) {
      this.maintenance_row = true;
    }
    else {
      this.maintenance_row = false;
    }
  }

  Property_type_data(): void {
    this.userService.get_property_type().pipe().subscribe(
      (data: any) => {
        //  console.log(amenitiesdata);
        this.property_type = data.data;
        this.property_type_result = this.property_type;
        //console.log(this.property_type_result);
        //console.log(this.content);
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }


  amenities(): void {
    this.userService.getamenitiesdata().pipe().subscribe(
      (amenitiesdata: any) => {
        //  console.log(amenitiesdata);
        this.amenities = amenitiesdata.data;
        this.amenitiesresult = this.amenities;
        this.Amenties_length = this.amenitiesresult.length;
        //console.log(this.content);
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  Amenties_funtion(Amenties_id: any) {
    // var len= this.product_amenties.length; 
    if (this.product_amenties_length != null) {
      for (let i = 0; i < this.product_amenties_length; i++) {
        if (Amenties_id == this.product_amenties[i].amenties) {
          return true;
        }
      }
    }
    return false;
  }

  saleButton(): void {
    this.saleValue = true;
    this.rentValue = false;
  }

  rentButton(): void {
    this.saleValue = false;
    this.rentValue = true;
  }

  reloadPage(): void {
    window.location.reload();
  }
  RangeSlider_Price(event) {
    this.expected_rent = event;
    this.update_property_rent.controls.Property_price_images.patchValue({
      expected_rent: this.expected_rent,
    });
    if (event < 5000 || event > 500000) {
      this.Expected_PriceEroor = true;
    } else {
      this.Expected_PriceEroor = false;
    }
  }

  Expected_RentPrice(event: number) {
    if (event >= 5000 && event <= 500000) {
    } else {
      this.toastr.error("Expected Price Between 5k to 5 Lakhs", 'Price Invalid..!!', {
        timeOut: 1500,
      });
    }
  }
  keyPressNumbers(event: { which: any; keyCode: any; preventDefault: () => void; }) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  rangeInput_Price(event) {
    this.expected_rent = event;
    if (event < 500000 || event > 50000000) {
      this.Expected_PriceEroor = true;
    } else {
      this.Expected_PriceEroor = false;
    }
  }

  get_area(): void {
    this.internalUserService.get_areas().subscribe(
      data => {
        // this.dropdownList = data;
        for (let i = 1; i < data.length; i++) {
          this.dropdownList = this.dropdownList.concat({ item_id: data[i].id, item_text: data[i].area, item_pincode: data[i].pincode });
        }
        this.filteredOptions = this.update_property_rent.controls.Property_address.get('locality').valueChanges
          .pipe(
            startWith(''),
            map((value) => this._filter(value))
          );

      },
      err => {
        // console.log(err);
      }
    );
  }

  private _filter(value: any): string[] {
    console.log(value);
    if (value.item_text) {
      const filterValue = value.item_text.toLowerCase();
      console.log(filterValue);
      return this.dropdownList.filter(option => option.item_text.toLowerCase().includes(filterValue));
    }
    else {
      const filterValue = value.toLowerCase();
      console.log(filterValue);
      return this.dropdownList.filter(option => option.item_text.toLowerCase().includes(filterValue));
    }
  }

  displayFn(value?) {
    if (this.dropdownList.length > 0) {
      return value ? this.dropdownList?.find(option => option.item_id === value.item_id).item_text : undefined;
    }
    else {
      return value.item_text;
    }
  }

  delete_Pro_img(id: any) {
    this.authService.delete_pro_img(id).subscribe(
      data => {
        //console.log(data);
        this.property_details(this.id);
      },
      err => {
        //console.log(err)
      }
    );
  }

  onSubmitRent(): void {
    if (this.update_property_rent.invalid) {
      return;
    }
    this.showLoadingIndicator = true;
    if (this.update_property_rent.value.Property_price_images.expected_rent >= 5000 && this.update_property_rent.value.Property_price_images.expected_rent <= 500000) {
      this.authService.product_rent_update(this.update_property_rent.value, this.id, this.additional_room_array, this.amenityArray, this.amenity_Uncheck, this.furnishingArray, this.update_product_img).subscribe(
        data => {
          //console.log("successful Updated" + data)
          this.showLoadingIndicator = false;
          this.toastr.success('Successfuly Updated', 'Property Rent');
          window.location.href = GlobalConstants.siteURL + "myproperties"
        },
        err => {
          this.err_caused = true;
          this.errorMessage = err.error.errors;
          this.Message = err.error.message;
          this.showLoadingIndicator = false;
          //console.log(this.errorMessage);
          this.toastr.error(this.Message, 'Error', {
            timeOut: 3000,
          });
        }
      );
    } else {
      this.showLoadingIndicator = false;
      this.toastr.error("Expected Price Between  5k to 5 Lakhs", 'Price Invalid..!!', {
        timeOut: 2000,
      });
    }

  }
  saveDraft_form(): void {
    this.showLoadingIndicator = true;
    console.log(this.additional_room_array);
    if (this.update_property_rent.value.Property_price_images.expected_rent >= 5000 && this.update_property_rent.value.Property_price_images.expected_rent <= 500000) {
      this.authService.draft_rent_update(this.update_property_rent.value, this.id, this.additional_room_array, this.amenityArray, this.amenity_Uncheck, this.furnishingArray, this.update_product_img).subscribe(
        data => {
          //console.log("successful Updated" + data)
          this.showLoadingIndicator = false;
          this.toastr.success('Successfuly Updated', 'Draft Property Rent');
          // window.location.href=GlobalConstants.siteURL+"myproperties"
        },
        err => {
          this.err_caused = true;
          this.errorMessage = err.error.errors;
          this.Message = err.error.message;
          this.showLoadingIndicator = false;
          //console.log(this.errorMessage);
          this.toastr.error(this.Message, 'Error', {
            timeOut: 3000,
          });
        }
      );
    } else {
      this.showLoadingIndicator = false;
      this.toastr.error("Expected Price Between  5k to 5 Lakhs", 'Price Invalid..!!', {
        timeOut: 2000,
      });
    }

  }

  redirect_to_myproperties(): void {
    window.location.href = GlobalConstants.siteURL = "myproperties"
  }
  redirect_to_home(): void {
    window.location.href = GlobalConstants.siteURL = "login"
  }

  crm_api_call() {
    this.controls = this.update_property_rent.get('Property_Details');
    if (this.controls.valid) {
      console.log("Valid");
      console.log(this.controls);
      this.authService.crm_call(this.user_id).subscribe(
        data => {
          this.response = data;
        },
        err => {
          this.response = err;
        }
      );
    }
    else {
      console.log("Invalid");
    }

  }
}

type addition_room = Array<{ id: number; name: string }>;
