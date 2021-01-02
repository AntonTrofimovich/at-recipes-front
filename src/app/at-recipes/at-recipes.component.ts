import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { share, map, filter } from "rxjs/operators";

import { AtRecipe } from "../model/at-backend";
import { AtTabsetData } from "../components/at-list/at-tabset.model";
import { AtRecipesService } from "./at-recipes.service";

@Component({
    selector: "at-recipes",
    templateUrl: "./at-recipes.component.html",
    styleUrls: ["./at-recipes.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AtRecipesService],
})
export class AtRecipesComponent {
    public readonly recipes$: Observable<AtRecipe[]> = this._recipesService
        .recipes$;

    public readonly activeTab$: Observable<AtTabsetData> = this._recipesService.selectedRecipe$.pipe(
        filter((r) => !!r),
        map((r) => this.convertRecipeToTabSetData(r))
    );

    constructor(private readonly _recipesService: AtRecipesService) {}

    private convertRecipeToTabSetData(r: AtRecipe): AtTabsetData {
        return this._recipesService.convertRecipeToTabSetData(r);
    }
}
