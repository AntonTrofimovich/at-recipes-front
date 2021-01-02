import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, share, startWith, switchMap } from "rxjs/operators";

import { AtRecipe } from "../model/at-backend";
import { AtTabsetData } from "../components/at-list/at-tabset.model";
import { AtRecipesDataService } from "src/app/services/at-recipes-data.service";

@Injectable()
export class AtRecipesService {
    public readonly recipes$: Observable<AtRecipe[]> = this.getRecipes().pipe(
        share()
    );

    private readonly _selectedRecipe$: Subject<AtRecipe> = new Subject();
    public readonly selectedRecipe$: Observable<AtRecipe> = this.recipes$.pipe(
        map((r) => r && r[0]),
        switchMap((initial) => this._selectedRecipe$.pipe(startWith(initial)))
    );

    private readonly _addRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly addRecipeHasBeenTriggered$: Observable<void> = this._addRecipeHasBeenTriggered$.asObservable();

    private readonly _editRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly editRecipeHasBeenTriggered$: Observable<void> = this._editRecipeHasBeenTriggered$.asObservable();

    private readonly _deleteRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly deleteRecipeHasBeenTriggered$: Observable<void> = this._deleteRecipeHasBeenTriggered$.asObservable();

    private readonly _saveRecipeHasBeenTriggered$: Subject<void> = new Subject();
    public readonly saveRecipeHasBeenTriggered$: Observable<void> = this._saveRecipeHasBeenTriggered$.asObservable();

    constructor(private readonly _recipesDataService: AtRecipesDataService) {}

    public convertRecipeToTabSetData(r: AtRecipe): AtTabsetData {
        return {
            id: r.id,
        };
    }

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

    public triggerSaveRecipe(title: string, description: string): void {
        this._saveRecipeHasBeenTriggered$.next();
    }
}
