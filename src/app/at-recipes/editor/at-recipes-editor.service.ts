import { Injectable } from "@angular/core";
import { timeStamp } from "console";
import { BehaviorSubject, Observable, merge, Subscription } from "rxjs";
import {
    first,
    map,
    mapTo,
    share,
    shareReplay,
    startWith,
    switchMap,
    takeUntil,
} from "rxjs/operators";

import { AtRecipe } from "../../model/at-backend";
import { AtRecipesService } from "../at-recipes.service";

export enum AtRecipesEditorMode {
    View,
    Edit,
}

@Injectable()
export class AtRecipesEditorService {
    // private readonly _anyActionHasHappened$: Observable<void> = merge(
    //     this._recipesService.addRecipeHasBeenTriggered$,
    //     this._recipesService.editRecipeHasBeenTriggered$,
    //     this._recipesService.deleteRecipeHasBeenTriggered$,
    //     this._recipesService.cancelRecipeHasBeenTriggered$
    // );

    public readonly viewMode$: Observable<AtRecipesEditorMode> = merge(
        merge(
            this._recipesService.addRecipeHasBeenTriggered$,
            this._recipesService.editRecipeHasBeenTriggered$
        ).pipe(mapTo(AtRecipesEditorMode.Edit)),

        merge(
            this._recipesService.deleteRecipeHasBeenTriggered$,
            this._recipesService.saveRecipeHasBeenTriggered$
        ).pipe(mapTo(AtRecipesEditorMode.View))
    ).pipe(
        startWith(AtRecipesEditorMode.View),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    public readonly selectedRecipe$: Observable<AtRecipe> = this._recipesService.selectedRecipe$.pipe(
        shareReplay({ bufferSize: 1, refCount: true })
    );

    private readonly _subscriptions: Subscription[] = [];

    constructor(private readonly _recipesService: AtRecipesService) {
        this._subscriptions = [this.viewMode$.subscribe()];
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach((s) => s.unsubscribe());
    }

    public triggerSave(v: AtRecipe): void {
        this._recipesService.triggerSaveRecipe(v);
    }
}
