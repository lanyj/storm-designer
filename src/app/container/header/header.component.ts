import {Component, Input, OnInit} from '@angular/core';
import {SceneComponent} from '../../scene/scene.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  serializedUrl;
  @Input() sceneComponent: SceneComponent;
  constructor() { }

  ngOnInit() {
  }

  shortenURL(serialized) {
    return serialized;
  }
  share() {
    const serialized = this.sceneComponent.serialize();
    this.serializedUrl = 'localhost:4200/load/' + this.shortenURL(serialized);
  }
  download() {
    console.log('Download...');
  }
}
