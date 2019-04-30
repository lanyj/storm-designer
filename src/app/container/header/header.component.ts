import { HttpClient, HttpUrlEncodingCodec, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { SceneComponent } from '../../scene/scene.component';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  serializedUrl;
  preFlower = false;

  @Input() sceneComponent: SceneComponent;
  constructor(private http: HttpClient, private service: AppService) { }

  ngOnInit() {
  }

  changeFlower() {
    this.preFlower = !this.preFlower;
    this.service.setShowFlower(this.preFlower);
    this.service.refreshRxObjects();
  }

  shortenURL(serialized) {
    return serialized;
  }
  share() {
    const serialized = this.sceneComponent.serialize();
    this.serializedUrl = 'https://lanyj.github.io/storm-designer/load/' + this.shortenURL(serialized);
  }
  download() {
    const baseUrl = 'https://www.lanyj.cn/StormDesignerServer/';
    // const baseUrl = 'http://localhost:8080/StormDesignerServer/';
    const urlCodec = new HttpUrlEncodingCodec();

    const serialized = this.sceneComponent.serialize();

    this.downloadFile(baseUrl, 'storm/download?struct=' + urlCodec.encodeValue(serialized.toString()));
  }

  downloadFile(baseUrl: string, route: string, filename: string = null): void {
    console.log(baseUrl + route);
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });

    this.http.get(baseUrl + route, { headers, responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.setAttribute("target", "_blank");
        // downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        downloadLink.href = baseUrl + route;
        if (filename)
          downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    )
  }
}
