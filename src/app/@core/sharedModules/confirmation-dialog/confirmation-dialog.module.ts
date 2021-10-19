import { NgModule } from '@angular/core';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        ConfirmationDialogComponent
    ],
    imports: [
        TranslateModule
    ],
    exports: [

    ],
    providers: [ConfirmationDialogService],
    entryComponents: [
        ConfirmationDialogComponent
    ]
})
export class ConfirmationDialogModule {
}
