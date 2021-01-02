import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { AtRecipe } from "src/app/model/at-backend";
import {
    AtRecipesEditorMode,
    AtRecipesEditorService,
} from "./at-recipes-editor.service";

@Component({
    selector: "at-recipes-editor",
    templateUrl: "./at-recipes-editor.component.html",
    styleUrls: ["./at-recipes-editor.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AtRecipesEditorService],
})
export class AtRecipesEditorComponent {
    public readonly AtRecipesEditorMode = AtRecipesEditorMode;

    public readonly selectedRecipe$: Observable<AtRecipe> = this
        ._recipesEditorService.selectedRecipe$;

    public readonly viewMode$: Observable<AtRecipesEditorMode> = this
        ._recipesEditorService.viewMode$;

    constructor(
        private readonly _recipesEditorService: AtRecipesEditorService
    ) {}
}
