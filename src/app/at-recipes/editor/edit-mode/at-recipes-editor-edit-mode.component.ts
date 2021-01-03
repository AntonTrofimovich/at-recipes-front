import { Component, ChangeDetectionStrategy } from "@angular/core";
import { merge, Observable, Subject, Subscription } from "rxjs";
import {
    first,
    map,
    scan,
    shareReplay,
    startWith,
    switchMap,
    switchMapTo,
} from "rxjs/operators";

import { AtRecipe } from "../../../model/at-backend";
import { AtRecipesEditorService } from "../at-recipes-editor.service";

@Component({
    selector: "at-recipes-editor-edit-mode",
    templateUrl: "./at-recipes-editor-edit-mode.component.html",
    styleUrls: ["./at-recipes-editor-edit-mode.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesEditorEditModeComponent {
    public readonly selectedRecipe$: Observable<AtRecipe> = this._recipesEditorService.selectedRecipe$.pipe(
        shareReplay({ bufferSize: 1, refCount: true })
    );

    private readonly _saveHasBeenTriggered$: Subject<void> = new Subject();

    private readonly _title$: Subject<string> = new Subject();
    private readonly _description$: Subject<string> = new Subject();

    private readonly _editedRecipe$: Observable<AtRecipe> = this.selectedRecipe$.pipe(
        switchMap((recipe) => this.getModifyRecipeObservable(recipe)),
        shareReplay({ bufferSize: 1, refCount: true })
    );

    private _subscriptions: Subscription[] = [];

    constructor(
        private readonly _recipesEditorService: AtRecipesEditorService
    ) {
        this._subscriptions = [
            this._editedRecipe$.subscribe(),
            this._saveHasBeenTriggered$
                .pipe(switchMapTo(this._editedRecipe$.pipe(first())))
                .subscribe((r) => this.save(r)),
        ];
    }

    public ngOnDestroy() {
        this._subscriptions.forEach((s) => s.unsubscribe());
    }

    public onSaveClick(): void {
        this.triggerSave();
    }

    public onCancelClick(): void {
        this.triggerCancel();
    }

    public onTitleChange(v: string): void {
        this.setTitle(v);
    }

    public onDescriptionChange(v: string): void {
        this.setDescription(v);
    }

    private setTitle(v: string) {
        this._title$.next(v);
    }

    private setDescription(v: string) {
        this._description$.next(v);
    }

    private triggerSave(): void {
        this._saveHasBeenTriggered$.next();
    }

    private triggerCancel(): void {
        this._recipesEditorService.triggerCancel();
    }

    private save(v: AtRecipe): void {
        this._recipesEditorService.triggerSave(v);
    }

    private getModifyRecipeObservable(recipe: AtRecipe): Observable<AtRecipe> {
        return merge(
            this._title$.pipe(map((title) => ({ title }))),
            this._description$.pipe(map((description) => ({ description })))
        ).pipe(
            scan((result, value) => ({ ...result, ...value }), recipe),
            startWith(recipe)
        );
    }
}
