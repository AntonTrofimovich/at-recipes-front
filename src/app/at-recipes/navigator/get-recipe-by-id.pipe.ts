import { Pipe, PipeTransform } from '@angular/core';
import { AtRecipe } from 'src/app/model/at-backend';

@Pipe({
    name: 'getRecipeById'
})
export class GetRecipeByIdPipe implements PipeTransform {
    transform(id: string, recipes: AtRecipe[] | null): AtRecipe | undefined {
        if (!recipes) {
            return undefined;
        }

        return recipes.find(r => r.id === id);
    }
}
