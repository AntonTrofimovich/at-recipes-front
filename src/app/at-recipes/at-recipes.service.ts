import { Injectable } from "@angular/core";
import { merge, Observable, Subject, Subscription } from "rxjs";
import {
    first,
    map,
    mapTo,
    share,
    shareReplay,
    startWith,
    switchMap,
    withLatestFrom,
} from "rxjs/operators";

import { AtRecipe } from "../model/at-backend";
import { AtRecipesDataService } from "src/app/services/at-recipes-data.service";

@Injectable()
export class AtRecipesService {
    private readonly _recipes$: Subject<AtRecipe[]> = new Subject();
    public readonly recipes$: Observable<AtRecipe[]> = this.getRecipes().pipe(
        switchMap((recipes) => this._recipes$.pipe(startWith(recipes))),
        switchMap((recipes) =>
            this.getAddRecipeHasBeenTriggeredObservable(recipes).pipe(
                startWith(recipes)
            )
        ),
        share()
    );

    private readonly _addRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly addRecipeHasBeenTriggered$: Observable<void> = this._addRecipeHasBeenTriggered$.asObservable();

    private readonly _manuallySelectedRecipe$: Subject<AtRecipe> = new Subject();

    private readonly _selectedRecipe$: Observable<AtRecipe> = merge(
        this._manuallySelectedRecipe$,
        this._addRecipeHasBeenTriggered$.pipe(
            switchMap(() => this.recipes$),
            map((recipes) => recipes[recipes.length - 1])
        )
    );
    public readonly selectedRecipe$: Observable<AtRecipe> = this.recipes$.pipe(
        first(),
        map((r) => r && r[0]),
        switchMap((initial) => this._selectedRecipe$.pipe(startWith(initial))),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    private readonly _editRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly editRecipeHasBeenTriggered$: Observable<void> = this._editRecipeHasBeenTriggered$.asObservable();

    private readonly _deleteRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly deleteRecipeHasBeenTriggered$: Observable<void> = this._deleteRecipeHasBeenTriggered$.asObservable();

    private readonly _saveRecipeHasBeenTriggered$: Subject<AtRecipe> = new Subject();
    public readonly saveRecipeHasBeenTriggered$: Observable<AtRecipe> = this._saveRecipeHasBeenTriggered$.asObservable();

    private readonly _cancelRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly cancelRecipeHasBeenTriggered$: Observable<void> = this._cancelRecipeHasBeenTriggered$.asObservable();

    private readonly _subscriptions: Subscription[] = [];

    constructor(private readonly _recipesDataService: AtRecipesDataService) {
        this._subscriptions = [
            this._saveRecipeHasBeenTriggered$
                .pipe(
                    switchMap((r) => this.saveRecipe(r)),
                    withLatestFrom(this.recipes$)
                )
                .subscribe(([result, recipes]) =>
                    this.onRecipeHasBeenSaved(result, recipes)
                ),
        ];
    }

    private getRecipes(): Observable<AtRecipe[]> {
        return this._recipesDataService
            .getRecipesResponse()
            .pipe(map((r) => r.data));
    }

    private saveRecipe(r: AtRecipe): Promise<AtRecipe> {
        return this._recipesDataService
            .saveRecipeResponse(r)
            .pipe(map((v) => v.data))
            .toPromise();
    }

    private onRecipeHasBeenSaved(recipe: AtRecipe, recipes: AtRecipe[]): void {
        this.setRecipes(this.getUpdatedRecipesCollection(recipe, recipes));

        this.setSelectedRecipe(recipe);
    }

    public setSelectedRecipe(v: AtRecipe): void {
        this._manuallySelectedRecipe$.next(v);
    }

    public triggerAddRecipe(): void {
        this._addRecipeHasBeenTriggered$.next();
    }

    public triggerEditRecipe(): void {
        this._editRecipeHasBeenTriggered$.next();
    }

    public triggerDeleteRecipe(): void {
        this._deleteRecipeHasBeenTriggered$.next();
    }

    public triggerSaveRecipe(v: AtRecipe): void {
        this._saveRecipeHasBeenTriggered$.next(v);
    }

    private getAddRecipeHasBeenTriggeredObservable(
        recipes: AtRecipe[]
    ): Observable<AtRecipe[]> {
        return this.addRecipeHasBeenTriggered$.pipe(
            first(),
            mapTo([...recipes, this.getEmptyRecipe()])
        );
    }

    private getUpdatedRecipesCollection(
        updatedRecipe: AtRecipe,
        recipes: AtRecipe[]
    ): AtRecipe[] {
        const prevRecipe = recipes.find((r) => r.id === updatedRecipe.id);

        if (!prevRecipe) {
            return [...this.getRecipesWithoutRemporary(recipes), updatedRecipe];
        }

        return recipes;
    }

    private setRecipes(v: AtRecipe[]): void {
        this._recipes$.next(v);
    }

    private getRecipesWithoutRemporary(recipes: AtRecipe[]): AtRecipe[] {
        return recipes.slice(0, recipes.length - 1);
    }

    private getEmptyRecipe(): AtRecipe {
        return {
            id: "",
            title: "New Recipe",
            description: "",
        };
    }
}
