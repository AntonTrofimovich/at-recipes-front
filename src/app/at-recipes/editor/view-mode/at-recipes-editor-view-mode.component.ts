import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { share, shareReplay } from "rxjs/operators";

import { AtRecipe } from "../../../model/at-backend";
import { AtRecipesEditorService } from "../at-recipes-editor.service";

@Component({
    selector: "at-recipes-editor-view-mode",
    templateUrl: "./at-recipes-editor-view-mode.component.html",
    styleUrls: ["./at-recipes-editor-view-mode.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesEditorViewModeComponent {
    public readonly selectedRecipe$: Observable<AtRecipe> = this._recipesEditorService.selectedRecipe$.pipe(
        shareReplay({ bufferSize: 1, refCount: true })
    );

    constructor(
        private readonly _recipesEditorService: AtRecipesEditorService
    ) {}
}
