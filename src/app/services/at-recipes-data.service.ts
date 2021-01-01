import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import {
    AtResponse,
    AtRecipe,
    AtAddRecipeRequestBody,
} from "../model/at-backend";

@Injectable()
export class AtRecipesDataService {
    constructor(private readonly _http: HttpClient) {}

    public getRecipesResponse(): Observable<AtResponse<AtRecipe[]>> {
        return this._http.get<AtResponse<AtRecipe[]>>(
            "http://localhost:3000/recipes/all"
        );
    }

    public addRecipeResponse(
        body: AtAddRecipeRequestBody
    ): Observable<AtResponse<AtRecipe>> {
        return this._http.post<AtResponse<AtRecipe>>(
            "http://localhost:3000/recipes/add",
            body
        );
    }
}
