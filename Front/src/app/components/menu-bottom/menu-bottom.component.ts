import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-bottom',
  templateUrl: './menu-bottom.component.html',
  styleUrls: ['./menu-bottom.component.scss']
})
export class MenuBottomComponent implements OnInit {
  menu:any[] = [
    {name: 'mic', icon :'material-icons '},
    {name: 'share', icon :'material-icons'},
    {name: 'home', icon :'material-icons '},
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
