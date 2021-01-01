import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: "at-recipes",
    templateUrl: "./at-recipes.component.html",
    styleUrls: ["./at-recipes.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtRecipesComponent {
    constructor() {}

    // ngOnInit(): void {
    //     this._recipesService.addRecipe("Anton", "Asdfaadf");
    // }
}
