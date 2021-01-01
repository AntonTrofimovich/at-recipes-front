import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ContentChild,
    TemplateRef,
    ElementRef,
    ViewChild,
    Input,
    SimpleChanges,
} from "@angular/core";
import { Observable, Subject } from "rxjs";

export type AtTabsetData = {
    id: string;
};

@Component({
    selector: "at-tabset",
    templateUrl: "at-tabset.component.html",
    styleUrls: ["at-tabset.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtTabsetComponent implements OnInit {
    @Input() public data!: AtTabsetData[];

    @Input() public linkTemplate!: TemplateRef<HTMLElement>;

    @Input() public contentTemplate!: TemplateRef<HTMLElement>;

    @Input() public active!: AtTabsetData;

    private readonly _active$: Subject<AtTabsetData> = new Subject();
    public readonly active$: Observable<AtTabsetData> = this._active$.asObservable();

    constructor() {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.active && !changes.active.isFirstChange()) {
            this.setActive(this.active);
        }
    }

    public ngOnInit(): void {
        this.setActive(this.active || this.data[0].id);
    }

    public onActiveIdChange(id: string): void {
        this.setActive({
            id,
        });
    }

    private setActive(v: AtTabsetData): void {
        this._active$.next(v);
    }
}
