import { Injectable } from "@angular/core";
import { merge, Observable, Subject } from "rxjs";
import {
    first,
    map,
    mapTo,
    share,
    shareReplay,
    startWith,
    switchMap,
} from "rxjs/operators";

import { AtRecipe } from "../model/at-backend";
import { AtRecipesDataService } from "src/app/services/at-recipes-data.service";

@Injectable()
export class AtRecipesService {
    private readonly _recipes$: Subject<AtRecipe[]> = new Subject();
    public readonly recipes$: Observable<AtRecipe[]> = this.getRecipes().pipe(
        switchMap((recipes) => this._recipes$.pipe(startWith(recipes))),
        switchMap((recipes) =>
            this.getAddRecipeHasBeenTriggeredObservable(recipes)
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
        share()
    );

    private readonly _editRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly editRecipeHasBeenTriggered$: Observable<void> = this._editRecipeHasBeenTriggered$.asObservable();

    private readonly _deleteRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly deleteRecipeHasBeenTriggered$: Observable<void> = this._deleteRecipeHasBeenTriggered$.asObservable();

    private readonly _saveRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly saveRecipeHasBeenTriggered$: Observable<void> = this._saveRecipeHasBeenTriggered$.asObservable();

    private readonly _cancelRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly cancelRecipeHasBeenTriggered$: Observable<void> = this._cancelRecipeHasBeenTriggered$.asObservable();

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

    public triggerSaveRecipe(title: string, description: string): void {
        this._saveRecipeHasBeenTriggered$.next();
    }

    private getAddRecipeHasBeenTriggeredObservable(
        recipes: AtRecipe[]
    ): Observable<AtRecipe[]> {
        return this.addRecipeHasBeenTriggered$.pipe(
            first(),
            mapTo([...recipes, this.getEmptyRecipe()])
        );
    }

    private getEmptyRecipe(): AtRecipe {
        return {
            id: "",
            title: "New Recipe",
            description: "",
        };
    }
}
