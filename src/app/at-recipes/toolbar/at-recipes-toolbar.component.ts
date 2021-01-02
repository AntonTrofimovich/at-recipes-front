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

    public onEditClick(): void {
        this.triggerEditRecipe();
    }

    private triggerAddRecipe(): void {
        this._recipesService.triggerAddRecipe();
    }

    private triggerEditRecipe(): void {
        this._recipesService.triggerEditRecipe();
    }
}
