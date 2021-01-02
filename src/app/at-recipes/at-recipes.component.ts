import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { share, map, filter } from "rxjs/operators";

import { AtRecipe } from "../model/at-backend";
import { AtTabsetData } from "../components/at-tabset/at-tabset.model";
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
    > = this._recipesService.getRecipes().pipe(share());

    public readonly activeTab$: Observable<AtTabsetData> = this.recipes$.pipe(
        map((r) => r[0]),
        filter((r) => !!r),
        map((r) => this.convertRecipeToTabSetData(r))
    );

    constructor(private readonly _recipesService: AtRecipesService) {}

    private convertRecipeToTabSetData(r: AtRecipe): AtTabsetData {
        return this._recipesService.convertRecipeToTabSetData(r);
    }
}
