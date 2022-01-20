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

    public navigate(extras?: NavigationExtras): Promise<boolean> {
        let navigationExtras: NavigationExtras = {
            queryParams: this.queryParams,
            queryParamsHandling: "merge"
        };
        if (extras) 
            navigationExtras = {...navigationExtras, ...extras };
        return this.router.navigate([...this.baseCommands, this.commands], navigationExtras);
    }
}