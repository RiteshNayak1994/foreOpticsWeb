import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyComponent } from './privacy-policy.component';

@NgModule({
    declarations: [
        PrivacyPolicyComponent
    ],
    imports: [        
        TranslateModule
    ],
    exports: [
    ],
    entryComponents: [
        PrivacyPolicyComponent
    ]
})

export class PrivacyPolicyModule {
}
