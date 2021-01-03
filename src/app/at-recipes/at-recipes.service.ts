import { Injectable } from "@angular/core";
import { merge, Observable, of, Subject, Subscription } from "rxjs";
import {
    distinctUntilChanged,
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

    private readonly _selectedRecipe$: Subject<AtRecipe> = new Subject();

    public readonly selectedRecipe$: Observable<AtRecipe> = this.recipes$.pipe(
        first(),
        map((r) => r && r[0]),
        switchMap((initial) =>
            this._selectedRecipe$.pipe(
                distinctUntilChanged((prev, next) =>
                    this.areRecipesSame(prev, next)
                ),
                startWith(initial)
            )
        ),
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

            this._deleteRecipeHasBeenTriggered$
                .pipe(
                    switchMap(() => this.selectedRecipe$.pipe(first())),
                    filter((r) => !!r),
                    switchMap((r) => this.deleteRecipe(r)),
                    withLatestFrom(this.recipes$)
                )
                .subscribe(([result, recipes]) =>
                    this.onRecipeHasBeenDeleted(result, recipes)
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

    public isRecipeEmpty(r: AtRecipe): boolean {
        return r.id === this.getEmptyRecipe().id;
    }

    private hasEmptyRecipe(recipes: AtRecipe[]): boolean {
        return recipes.some((r) => this.isRecipeEmpty(r));
    }

    private areRecipesSame(first: AtRecipe, second: AtRecipe): boolean {
        if (!first && !second) {
            return true;
        }

        if (!first || !second) {
            return false;
        }

        return (
            first.id === second.id &&
            first.description === second.description &&
            first.title === second.title
        );
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

    private deleteRecipe(r: AtRecipe): Observable<number> {
        const isEmpty = this.isEmptyRecipe(r);

        if (isEmpty) {
            return of(r.id);
        }

        return this._recipesDataService
            .deleteRecipeResponse(r.id)
            .pipe(map((v) => +v.data));
    }

    private isEmptyRecipe(r: AtRecipe): boolean {
        return r.id === Infinity;
    }

    private onRecipeHasBeenSaved(recipe: AtRecipe, recipes: AtRecipe[]): void {
        this.setRecipes(this.getUpdatedRecipesCollection(recipe, recipes));

        this.setSelectedRecipe(recipe);
    }

    private onAddRecipeHasBeenTriggered(recipes: AtRecipe[]): void {
        const empty = this.getEmptyRecipe();

        this.setRecipes([...(recipes || []), empty]);
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

    private onRecipeHasBeenDeleted(
        recipeId: number,
        recipes: AtRecipe[]
    ): void {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (!recipe) {
            return;
        }

        const isEmpty = this.isEmptyRecipe(recipe);

        if (!isEmpty) {
            const i = recipes.findIndex((r) => r.id === recipeId);
            const updatedRecipes = [
                ...recipes.slice(0, i),
                ...recipes.slice(i + 1),
            ];
            this.setRecipes(updatedRecipes);
            const nextIndex = i - 1 >= 0 ? i - 1 : 0;
            this.setSelectedRecipe(updatedRecipes[nextIndex]);

            return;
        }

        const updatedRecipes = this.getRecipesWithoutTemporary(recipes);
        this.setRecipes(updatedRecipes);
        this.setSelectedRecipe(updatedRecipes[updatedRecipes.length - 1]);
    }

    public setSelectedRecipe(v: AtRecipe): void {
        this._selectedRecipe$.next(v);
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
        const updatedRecipeIndex = recipes.findIndex(
            (r) => r.id === updatedRecipe.id
        );

        if (updatedRecipeIndex === -1) {
            return [...this.getRecipesWithoutTemporary(recipes), updatedRecipe];
        }

        return [
            ...recipes.slice(0, updatedRecipeIndex),
            updatedRecipe,
            ...recipes.slice(updatedRecipeIndex + 1),
        ];
    }

    private setRecipes(v: AtRecipe[]): void {
        this._recipes$.next(v);
    }

    private getRecipesWithoutTemporary(recipes: AtRecipe[]): AtRecipe[] {
        return recipes.slice(0, recipes.length - 1);
    }

    private getEmptyRecipe(): AtRecipe {
        return {
            id: Infinity,
            title: "New Recipe",
            description: "",
        };
    }
}
