import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "at-recipes-editor-view-mode",
    templateUrl: "./at-recipes-editor-view-mode.component.html",
    styleUrls: ["./at-recipes-editor-view-mode.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesEditorViewModeComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
