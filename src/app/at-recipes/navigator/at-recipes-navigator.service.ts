import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AtRecipe } from "../../model/at-backend";
import { AtRecipesDataService } from "src/app/services/at-recipes-data.service";

@Injectable()
export class AtRecipesNavigatorService {
    constructor(private readonly _recipesDataService: AtRecipesDataService) {}

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
