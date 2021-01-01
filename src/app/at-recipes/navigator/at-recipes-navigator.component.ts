import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";

import { AtRecipe } from "../../model/at-backend";

import { AtRecipesNavigatorService } from "./at-recipes-navigator.service";

@Component({
    selector: "at-recipes-navigator",
    templateUrl: "./at-recipes-navigator.component.html",
    styleUrls: ["at-recipes-navigator.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AtRecipesNavigatorService],
})
export class AtRecipesNavigatorComponent implements OnInit {
    public readonly recipes$: Observable<
        AtRecipe[]
    > = this._recipesNavigatorService.getRecipes().pipe(share());

    constructor(
        private readonly _recipesNavigatorService: AtRecipesNavigatorService
    ) { }

    ngOnInit(): void { }
}
