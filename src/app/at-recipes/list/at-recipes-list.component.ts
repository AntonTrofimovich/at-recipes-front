import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";

import { AtRecipe } from "../../model/at-backend";
import { AtRecipesService } from "../at-recipes.service";

@Component({
    selector: "at-recipes-list",
    templateUrl: "./at-recipes-list.component.html",
    styleUrls: ["./at-recipes-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesListComponent {
    public readonly recipes$: Observable<AtRecipe[]> = this._recipesService
        .recipes$;

    public readonly activeRecipe$: Observable<AtRecipe> = this._recipesService
        .selectedRecipe$;

    constructor(private readonly _recipesService: AtRecipesService) {}

    public onSelectedItemHasBeenChanged(v: AtRecipe): void {
        this.setSelectedRecipe(v);
    }

    private setSelectedRecipe(v: AtRecipe): void {
        this._recipesService.setSelectedRecipe(v);
    }
}
