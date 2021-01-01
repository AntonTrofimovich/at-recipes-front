import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "at-root",
    templateUrl: "./app.component.html",
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
