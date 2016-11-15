/*
 * Angular bootstraping
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './environment';

/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app.module';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch(err => console.error(err));
}


// in prod this is replace for document ready
document.addEventListener('DOMContentLoaded', main, false);
