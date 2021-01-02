import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AtListComponent } from "./components/at-list/at-list.component";
import { AtRecipesComponent } from "./at-recipes/at-recipes.component";
import { AtRecipesToolbarComponent } from "./at-recipes/toolbar/at-recipes-toolbar.component";
import { AtRecipesEditorComponent } from "./at-recipes/editor/at-recipes-editor.component";
import { AtRecipesEditorViewModeComponent } from "./at-recipes/editor/view-mode/at-recipes-editor-view-mode.component";
import { AtRecipesEditorEditModeComponent } from "./at-recipes/editor/edit-mode/at-recipes-editor-edit-mode.component";

@NgModule({
    declarations: [
        AppComponent,
        AtRecipesComponent,
        AtListComponent,
        AtRecipesToolbarComponent,
        AtRecipesEditorComponent,
        AtRecipesEditorViewModeComponent,
        AtRecipesEditorEditModeComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
