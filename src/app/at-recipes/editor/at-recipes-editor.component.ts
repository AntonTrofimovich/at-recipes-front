import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AtRecipesEditorService } from "./at-recipes-editor.service";

@Component({
    selector: "at-recipes-editor",
    templateUrl: "./at-recipes-editor.component.html",
    styleUrls: ["./at-recipes-editor.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AtRecipesEditorService],
})
export class AtRecipesEditorComponent {
    constructor() {}
}
