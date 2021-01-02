import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AtRecipe } from "../model/at-backend";
import { AtTabsetData } from "../components/at-tabset/at-tabset.model";
import { AtRecipesDataService } from "src/app/services/at-recipes-data.service";

@Injectable()
export class AtRecipesService {
    constructor(private readonly _recipesDataService: AtRecipesDataService) {}

    public convertRecipeToTabSetData(r: AtRecipe): AtTabsetData {
        return {
            id: r.id,
        };
    }

    public getRecipes(): Observable<AtRecipe[]> {
        return this._recipesDataService
            .getRecipesResponse()
            .pipe(map((r) => r.data));
    }

    public addRecipe(title: string, description: string): Promise<AtRecipe> {
        return this._recipesDataService
            .addRecipeResponse({ title, description })
            .pipe(map((v) => v.data))
            .toPromise();
    }
}
