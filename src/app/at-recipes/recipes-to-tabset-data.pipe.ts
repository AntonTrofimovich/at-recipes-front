import { Pipe, PipeTransform } from "@angular/core";
import { AtTabsetData } from "../components/at-tabset/at-tabset.model";

import { AtRecipe } from "../model/at-backend";
import { AtRecipesService } from "./at-recipes.service";

@Pipe({
    name: "recipesToTabsetData",
})
export class RecipesToTabsetDataPipe implements PipeTransform {
    constructor(private readonly _recipesService: AtRecipesService) {}

    public transform(recipes: AtRecipe[] | null): AtTabsetData[] | null {
        if (!recipes) {
            return null;
        }

        return recipes.map((r) => this.convertRecipeToTabSetData(r));
    }

    private convertRecipeToTabSetData(r: AtRecipe): AtTabsetData {
        return this._recipesService.convertRecipeToTabSetData(r);
    }
}
