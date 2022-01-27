import { NavigationExtras, Router } from "@angular/router";

export class Navigator {
    private commands: { [key: string]: any } = { outlets: {} };
    private queryParams = {};
    
    constructor(
        private router: Router,
        private baseCommands: any[]
    ) {
    }

    public setActivePrimaryOutlet(val: string): Navigator {
        this.commands.outlets['primary'] = val;
        return this;
    }
    
    public setAuxiliaryOutlet(outletName: string, val: string): Navigator {
        this.commands.outlets[outletName] = val;
        return this;
    }

    public getAuxiliaryOutletValue(outletName: string): string {
        const matches = new RegExp(`^.*(${outletName}\\:.*\)\\).*$`).exec(this.router.url);
        if (matches && matches[1]) {
            return matches[1].split(':')[1];
        } 
        return '';
    }

    public getAuxiliaryOutlet(): string {
        // TODO: adjust regex to match all auxiliary outlets from url
        // example: (todo//sidenav:menu//modal:create)
        const matches = new RegExp(/^.*(?:\(|\/\/)(.*\:.*)\).*$/).exec(this.router.url);
        if (matches && matches.length > 0) {
            return matches[1].split(':')[0];
        }
        return '';
    }

    public removeAuxiliaryOutlet(): void {
        const outlet = this.getAuxiliaryOutlet();
        if (!this.commands.outlets[outlet]){
            this.commands.outlets[outlet] = null;
        }
    }

    public navigate(extras?: NavigationExtras, removeAuxiliaryOutlet?: boolean): Promise<boolean> {
        if (removeAuxiliaryOutlet)
            this.removeAuxiliaryOutlet();

        let navigationExtras: NavigationExtras = {
            queryParams: this.queryParams,
            queryParamsHandling: "merge"
        };
        if (extras) 
            navigationExtras = {...navigationExtras, ...extras };
        return this.router.navigate([...this.baseCommands, this.commands], navigationExtras);
    }
}