import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AtRecipesService } from "../at-recipes.service";

@Component({
    selector: "at-recipes-toolbar",
    templateUrl: "./at-recipes-toolbar.component.html",
    styleUrls: ["./at-recipes-toolbar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesToolbarComponent {
    constructor(private readonly _recipesService: AtRecipesService) {}

    public onAddClick(): void {
        this.triggerAddRecipe();
    }

    private triggerAddRecipe(): void {
        this._recipesService.triggerAddRecipe();
    }
}
