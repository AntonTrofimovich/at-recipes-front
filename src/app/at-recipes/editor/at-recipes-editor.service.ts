import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AtRecipe } from "../../model/at-backend";

enum AtRecipesEditorMode {
    View,
    Edit,
}

@Injectable()
export class AtRecipesEditorService {}
