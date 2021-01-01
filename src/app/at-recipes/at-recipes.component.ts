import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";

import { AtRecipe } from "../model/at-backend";
import { AtRecipesService } from "./at-recipes.service";

@Component({
    selector: "at-recipes",
    templateUrl: "./at-recipes.component.html",
    styleUrls: ["./at-recipes.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AtRecipesService],
})
export class AtRecipesComponent {
    public readonly recipes$: Observable<
        AtRecipe[]
    > = this._recipesService.getRecipes();

    constructor(private readonly _recipesService: AtRecipesService) {}
}
