import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  TemplateRef,
  Type,
  ViewContainerRef,
  createComponent,
} from '@angular/core';
import { ModalComponent } from './modal.component';
import { Data } from './modal-options';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  newModalComponent!: ComponentRef<ModalComponent>;
  options!: Data | undefined;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  open(
    vcrOrComponent: ViewContainerRef,
    content: TemplateRef<Element>,
    options?: Data
  ): void;

  open<C>(vcrOrComponent: Type<C>, options?: Data): void;

  open<C>(
    vcrOrComponent: ViewContainerRef | Type<C>,
    param2?: TemplateRef<Element> | Data,
    options?: Data
  ) {
    if (vcrOrComponent instanceof ViewContainerRef) {
      this.openWithTemplate(vcrOrComponent, param2 as TemplateRef<Element>);
      this.options = options;
    } else {
      this.openWithComponent(vcrOrComponent);
      this.options = param2 as Data | undefined;
    }
  }

  openWithTemplate(vcr: ViewContainerRef, content: TemplateRef<Element>) {
    vcr.clear();

    const innerContent = vcr.createEmbeddedView(content);

    this.newModalComponent = vcr.createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [innerContent.rootNodes],
    });
  }

  openWithComponent(component: Type<unknown>) {
    const newComponent = createComponent(component, {
      environmentInjector: this.injector,
    });

    this.newModalComponent = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[newComponent.location.nativeElement]],
    });

    document.body.appendChild(this.newModalComponent.location.nativeElement);

    // Attach views to the changeDetection cycle
    this.appRef.attachView(newComponent.hostView);
    this.appRef.attachView(this.newModalComponent.hostView);
  }

  close() {
    this.newModalComponent.instance.close();
  }
}
