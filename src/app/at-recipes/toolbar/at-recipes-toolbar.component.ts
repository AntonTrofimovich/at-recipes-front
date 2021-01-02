import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "at-recipes-toolbar",
    templateUrl: "./at-recipes-toolbar.component.html",
    styleUrls: ["./at-recipes-toolbar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesToolbarComponent {
    constructor() {}
}
