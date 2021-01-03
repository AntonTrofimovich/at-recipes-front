import { Component, ChangeDetectionStrategy } from "@angular/core";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

import { AtRecipesService } from "../at-recipes.service";
import { merge, Observable } from "rxjs";
import { map, share } from "rxjs/operators";
import { AtRecipe } from "src/app/model/at-backend";

@Component({
    selector: "at-recipes-toolbar",
    templateUrl: "./at-recipes-toolbar.component.html",
    styleUrls: ["./at-recipes-toolbar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesToolbarComponent {
    public readonly faPen: IconDefinition = faPen;
    public readonly faTrash: IconDefinition = faTrash;
    public readonly faPlus: IconDefinition = faPlus;

    private readonly isAnyRecipeSelected$: Observable<boolean> = this._recipesService.selectedRecipe$.pipe(
        map((v) => !!v),
        share()
    );

    public readonly isEditDisabled$: Observable<boolean> = merge(
        this.isAnyRecipeSelected$.pipe(map((v) => !v))
    );
    public readonly isDeleteDisabled$: Observable<boolean> = merge(
        this.isAnyRecipeSelected$.pipe(map((v) => !v))
    );
    public readonly isAddDisabled$: Observable<boolean> = merge(
        this._recipesService.recipes$.pipe(
            map((recipes) => this.hasEmptyRecipe(recipes))
        )
    );

    constructor(private readonly _recipesService: AtRecipesService) {}

    public onAddClick(): void {
        this.triggerAddRecipe();
    }

    public onEditClick(): void {
        this.triggerEditRecipe();
    }

    public onDeleteClick(): void {
        this.triggerDeleteRecipe();
    }

    private triggerAddRecipe(): void {
        this._recipesService.triggerAddRecipe();
    }

    private triggerEditRecipe(): void {
        this._recipesService.triggerEditRecipe();
    }

    private triggerDeleteRecipe(): void {
        this._recipesService.triggerDeleteRecipe();
    }

    private hasEmptyRecipe(recipes: AtRecipe[]): boolean {
        return this._recipesService.hasEmptyRecipe(recipes);
    }
}
