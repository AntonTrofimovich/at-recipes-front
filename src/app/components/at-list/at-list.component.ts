import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    TemplateRef,
    Input,
    SimpleChanges,
    Output,
    EventEmitter,
} from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

import { AtTabsetData } from "./at-tabset.model";

@Component({
    selector: "at-tabset",
    templateUrl: "at-tabset.component.html",
    styleUrls: ["at-tabset.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtTabsetComponent implements OnInit {
    @Input() public data!: AtTabsetData[] | null;

    @Input() public linkTemplate!: TemplateRef<HTMLElement>;

    @Input() public contentTemplate!: TemplateRef<HTMLElement>;

    @Input() public tabsListAdjacent!: TemplateRef<HTMLElement>;

    @Input() public active!: AtTabsetData | null;

    @Output()
    public activeTabHasBeenChanged: EventEmitter<AtTabsetData | null> = new EventEmitter();

    private readonly _active$: Subject<AtTabsetData | null> = new Subject();
    public readonly active$: Observable<AtTabsetData | null> = this._active$.pipe(
        distinctUntilChanged((prev, next) => prev?.id === next?.id)
    );

    private _subscriptions: Subscription[] = [];

    constructor() {
        this._subscriptions = [
            this._active$.subscribe((v) => this.emitActiveTabHasBeenChanged(v)),
        ];
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.active && !changes.active.isFirstChange()) {
            this.setActive(this.active);
        }
    }

    public ngOnInit(): void {
        this.setInitialActive();
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach((s) => s.unsubscribe());
    }

    public onTabClick(_: Event, item: AtTabsetData): void {
        this.setActive(item);
    }

    private setActive(v: AtTabsetData | null): void {
        this._active$.next(v);
    }

    private setInitialActive(): void {
        let active = this.data && this.data[0];

        if (this.active) {
            active = this.active;
        }

        this.setActive(active);
    }

    private emitActiveTabHasBeenChanged(v: AtTabsetData): void {
        this.activeTabHasBeenChanged.emit(v);
    }
}
