import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Ng5SliderModule } from 'ng5-slider';
import { ClipboardModule } from 'ngx-clipboard';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ContainerComponent } from './container/container.component';
import { HeaderComponent } from './container/header/header.component';
import { CreationMenuComponent } from './creation-menu/creation-menu.component';
import { PropertyComponentComponent } from './property-inspector/property-component/property-component.component';
import { PropertyInspectorComponent } from './property-inspector/property-inspector.component';
import { SceneComponent } from './scene/scene.component';
import { StatusComponent } from './status/status.component';


@NgModule({
  declarations: [
    AppComponent,
    PropertyInspectorComponent,
    CreationMenuComponent,
    StatusComponent,
    SceneComponent,
    PropertyComponentComponent,
    ContainerComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    ClipboardModule,
    Ng5SliderModule,
    FlexLayoutModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
