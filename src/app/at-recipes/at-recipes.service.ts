import { Injectable } from "@angular/core";
import { merge, Observable, Subject, Subscription } from "rxjs";
import {
    filter,
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
        share()
    );

    private readonly _addRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly addRecipeHasBeenTriggered$: Observable<void> = this._addRecipeHasBeenTriggered$.asObservable();

    private readonly _manuallySelectedRecipe$: Subject<AtRecipe> = new Subject();
    private readonly _selectedRecipe$: Observable<AtRecipe> = merge(
        this._manuallySelectedRecipe$
    );
    public readonly selectedRecipe$: Observable<AtRecipe> = this.recipes$.pipe(
        first(),
        map((r) => r && r[0]),
        switchMap((initial) => this._selectedRecipe$.pipe(startWith(initial))),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    private readonly _editRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly editRecipeHasBeenTriggered$: Observable<void> = this._editRecipeHasBeenTriggered$.pipe(
        share()
    );

    private readonly _deleteRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly deleteRecipeHasBeenTriggered$: Observable<void> = this._deleteRecipeHasBeenTriggered$.pipe(
        share()
    );

    private readonly _saveRecipeHasBeenTriggered$: Subject<AtRecipe> = new Subject();
    public readonly saveRecipeHasBeenTriggered$: Observable<AtRecipe> = this._saveRecipeHasBeenTriggered$.pipe(
        share()
    );

    private readonly _cancelEditHasBeenTriggered$: Subject<void> = new Subject();
    public readonly cancelEditHasBeenTriggered$: Observable<void> = this._cancelEditHasBeenTriggered$.pipe(
        share()
    );

    private readonly _subscriptions: Subscription[] = [];

    constructor(private readonly _recipesDataService: AtRecipesDataService) {
        this._subscriptions = [
            this.recipes$
                .pipe(
                    filter((recipes) => !this.hasEmptyRecipe(recipes)),
                    switchMap((recipes) =>
                        this.addRecipeHasBeenTriggered$.pipe(
                            first(),
                            mapTo(recipes)
                        )
                    )
                )
                .subscribe((recipes) =>
                    this.onAddRecipeHasBeenTriggered(recipes)
                ),

            this._saveRecipeHasBeenTriggered$
                .pipe(
                    switchMap((r) => this.saveRecipe(r)),
                    withLatestFrom(this.recipes$)
                )
                .subscribe(([result, recipes]) =>
                    this.onRecipeHasBeenSaved(result, recipes)
                ),

            this.cancelEditHasBeenTriggered$
                .pipe(
                    switchMap(() => this.selectedRecipe$.pipe(first())),
                    withLatestFrom(this.recipes$)
                )
                .subscribe(([recipe, recipes]) =>
                    this.onRecipeEditHasBeenCancelled(recipe, recipes)
                ),
        ];
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach((s) => s.unsubscribe());
    }

    private getRecipes(): Observable<AtRecipe[]> {
        return this._recipesDataService
            .getRecipesResponse()
            .pipe(map((r) => r.data));
    }

    private saveRecipe(r: AtRecipe): Observable<AtRecipe> {
        return this._recipesDataService
            .saveRecipeResponse(r)
            .pipe(map((v) => v.data));
    }

    private hasEmptyRecipe(recipes: AtRecipe[]): boolean {
        return recipes.some((r) => this.isEmptyRecipe(r));
    }

    private isEmptyRecipe(r: AtRecipe): boolean {
        return r.id === "";
    }

    private onRecipeHasBeenSaved(recipe: AtRecipe, recipes: AtRecipe[]): void {
        this.setRecipes(this.getUpdatedRecipesCollection(recipe, recipes));

        this.setSelectedRecipe(recipe);
    }

    private onAddRecipeHasBeenTriggered(recipes: AtRecipe[]): void {
        const empty = this.getEmptyRecipe();

        this.setRecipes([...recipes, empty]);
        this.setSelectedRecipe(empty);
    }

    private onRecipeEditHasBeenCancelled(
        recipe: AtRecipe,
        recipes: AtRecipe[]
    ): void {
        const isEmpty = this.isEmptyRecipe(recipe);

        if (!isEmpty) {
            return;
        }

        const updatedRecipes = this.getRecipesWithoutTemporary(recipes);
        this.setRecipes(updatedRecipes);
        this.setSelectedRecipe(updatedRecipes[updatedRecipes.length - 1]);
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

    public triggerCancelEdit(): void {
        this._cancelEditHasBeenTriggered$.next();
    }

    private getUpdatedRecipesCollection(
        updatedRecipe: AtRecipe,
        recipes: AtRecipe[]
    ): AtRecipe[] {
        const prevRecipe = recipes.find((r) => r.id === updatedRecipe.id);

        if (!prevRecipe) {
            return [...this.getRecipesWithoutTemporary(recipes), updatedRecipe];
        }

        return recipes;
    }

    private setRecipes(v: AtRecipe[]): void {
        this._recipes$.next(v);
    }

    private getRecipesWithoutTemporary(recipes: AtRecipe[]): AtRecipe[] {
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
