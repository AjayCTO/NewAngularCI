import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.css']
})
export class CustomFieldComponent implements OnInit {
 public DetailsOpen:boolean
 public Time:boolean
 public Number:boolean
 public False:boolean
  constructor() { }

  ngOnInit(): void {
  }
  Text() {
    this.DetailsOpen = true;
    this.Time = false;
    this.Number = false;
    this.False = false;
    
  }
  Settings() {
    this.Time = true;
    this.DetailsOpen = false;
    this.Number = false;
    this.False = false;
  
  }
  Numbers() {
    this.Number = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.False = false;
    
  }
  Users() {
    this.False = true;
    this.DetailsOpen = false;
    this.Time = false;
    this.Number = false;
   
  }
  
}
