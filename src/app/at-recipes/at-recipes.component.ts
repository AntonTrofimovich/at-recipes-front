import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AtRecipesDataService } from "../services/at-recipes-data.service";

@Component({
    selector: "at-recipes",
    templateUrl: "./at-recipes.component.html",
    styleUrls: ["./at-recipes.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesComponent {
    constructor(private readonly _recipesService: AtRecipesDataService) { }

    ngOnInit(): void {
        // this._recipesService.addRecipeResponse({ title: "Anton", description: "Asdfaadf" }).toPromise();
    }
}
