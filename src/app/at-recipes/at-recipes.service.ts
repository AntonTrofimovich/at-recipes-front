import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AtRecipe, AtResponse } from "../model/at-backend";

@Injectable()
export class AtRecipesService {
    constructor(private readonly _http: HttpClient) {}

    public getRecipes(): Observable<AtRecipe[]> {
        return this.getRecipesResponse().pipe(map((r) => r.data));
    }

    private getRecipesResponse(): Observable<AtResponse<AtRecipe[]>> {
        return this._http.get<AtResponse<AtRecipe[]>>(
            "http://localhost:3000/recipes/all"
        );
    }
}
