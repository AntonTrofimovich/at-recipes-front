import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { AtRecipesComponent } from "./at-recipes/at-recipes.component";
import { AtRecipesNavigatorComponent } from "./at-recipes/navigator/at-recipes-navigator.component";
import { AtTabsetComponent } from "./components/at-tabset/at-tabset.component";

@NgModule({
    declarations: [
        AppComponent,
        AtRecipesComponent,
        AtRecipesNavigatorComponent,
        AtTabsetComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgbModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
