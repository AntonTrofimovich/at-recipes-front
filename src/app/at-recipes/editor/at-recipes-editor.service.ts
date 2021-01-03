import { Injectable } from "@angular/core";
import { Observable, merge, Subscription, of } from "rxjs";
import {
    filter,
    first,
    map,
    mapTo,
    shareReplay,
    skip,
    startWith,
    switchMap,
    switchMapTo,
} from "rxjs/operators";

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
            this.getEmptyRecipeHasBeenSelectedObservable(),
            this._recipesService.editRecipeHasBeenTriggered$
        ).pipe(mapTo(AtRecipesEditorMode.Edit)),

        this._recipesService.cancelEditHasBeenTriggered$.pipe(
            mapTo(AtRecipesEditorMode.View)
        )
    ).pipe(
        switchMap((mode) =>
            mode === AtRecipesEditorMode.Edit
                ? this.getRecipeHasBeenChangedObservable().pipe(
                      mapTo(AtRecipesEditorMode.View),
                      startWith(mode)
                  )
                : of(mode)
        ),
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

    public triggerCancel(): void {
        this._recipesService.triggerCancelEdit();
    }

    private getRecipeHasBeenChangedObservable(): Observable<void> {
        return this._recipesService.selectedRecipe$.pipe(
            skip(1),
            first(),
            mapTo(undefined)
        );
    }

    private getEmptyRecipeHasBeenSelectedObservable(): Observable<void> {
        return this._recipesService.selectedRecipe$.pipe(
            filter((r) => !!r),
            filter((r) => this.isRecipeEmpty(r)),
            mapTo(undefined)
        );
    }

    private isRecipeEmpty(r: AtRecipe): boolean {
        return this._recipesService.isRecipeEmpty(r);
    }
}
