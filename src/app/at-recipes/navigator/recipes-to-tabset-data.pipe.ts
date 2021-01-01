import { Pipe, PipeTransform } from '@angular/core';
import { AtTabsetData } from 'src/app/components/at-tabset/at-tabset.component';
import { AtRecipe } from 'src/app/model/at-backend';

@Pipe({
    name: 'recipesToTabsetData'
})
export class RecipesToTabsetDataPipe implements PipeTransform {
    transform(recipes: AtRecipe[] | null): AtTabsetData[] | null {
        if (!recipes) {
            return null;
        }

        return recipes.map(r => ({ id: r.id }));
    }
}
