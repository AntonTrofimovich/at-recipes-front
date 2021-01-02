import { Injectable } from "@angular/core";
import { timeStamp } from "console";
import { BehaviorSubject, Observable, merge } from "rxjs";
import { map, mapTo, startWith } from "rxjs/operators";

import { AtRecipe } from "../../model/at-backend";
import { AtRecipesService } from "../at-recipes.service";

export enum AtRecipesEditorMode {
    View,
    Edit,
}

@Injectable()
export class AtRecipesEditorService {
    public readonly viewMode$: Observable<AtRecipesEditorMode> = merge(
        merge(
            this._recipesService.addRecipeHasBeenTriggered$,
            this._recipesService.editRecipeHasBeenTriggered$
        ).pipe(mapTo(AtRecipesEditorMode.Edit)),

        this._recipesService.deleteRecipeHasBeenTriggered$.pipe(
            mapTo(AtRecipesEditorMode.View)
        )
    ).pipe(startWith(AtRecipesEditorMode.View));

    public readonly selectedRecipe$: Observable<AtRecipe> = this._recipesService
        .selectedRecipe$;

    constructor(private readonly _recipesService: AtRecipesService) {}
}
