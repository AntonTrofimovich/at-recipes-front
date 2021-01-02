import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AtResponse, AtRecipe } from "../model/at-backend";

@Injectable({
    providedIn: "root",
})
export class AtRecipesDataService {
    constructor(private readonly _http: HttpClient) {}

    public getRecipesResponse(): Observable<AtResponse<AtRecipe[]>> {
        return this._http.get<AtResponse<AtRecipe[]>>(
            "http://localhost:3000/recipes/all"
        );
    }

    public saveRecipeResponse(
        body: AtRecipe
    ): Observable<AtResponse<AtRecipe>> {
        return this._http.post<AtResponse<AtRecipe>>(
            "http://localhost:3000/recipes/save",
            body
        );
    }

    public deleteRecipeResponse(id: number): Observable<AtResponse<string>> {
        return this._http.delete<AtResponse<string>>(
            `http://localhost:3000/recipes/delete/${id}`
        );
    }
}
