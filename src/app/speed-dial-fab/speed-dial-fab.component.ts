import { Input, Component } from '@angular/core';
import { MenuLink } from '../@models/menu-link';
import { speedDialFabAnimations } from './speed-dial-fab.animations';


@Component({
    selector: 'app-speed-dial-fab',
    templateUrl: './speed-dial-fab.component.html',
    styleUrls: ['./speed-dial-fab.component.scss'],
    animations: speedDialFabAnimations
})
export class SpeedDialFabComponent {
    @Input('fabButtons') fabButtons: MenuLink[];
    buttons = [];
    fabTogglerState = 'inactive';

    constructor() { }
    showItems() {

        this.fabTogglerState = 'active';

        this.buttons = this.fabButtons;
    }
    hideItems() {

        this.fabTogglerState = 'inactive';

        this.buttons = [];
    }
    onToggleFab() {

        this.buttons.length ? this.hideItems() : this.showItems();
    }
}
