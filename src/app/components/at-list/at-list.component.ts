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
import { merge, Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { distinctUntilChanged, share, shareReplay, tap } from "rxjs/operators";

type AtListData = {
    id: number;
};

@Component({
    selector: "at-list",
    templateUrl: "at-list.component.html",
    styleUrls: ["at-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtListComponent<T extends AtListData> implements OnInit {
    @Input() public data!: T[] | null;

    @Input() public itemTemplate!: TemplateRef<HTMLElement>;

    @Input() public listAdjacentTemplate!: TemplateRef<HTMLElement>;

    @Input() public selected!: T | null;

    @Output()
    public selectedItemHasBeenChanged: EventEmitter<T | null> = new EventEmitter();

    private readonly _selected$: ReplaySubject<T | null> = new ReplaySubject(1);

    private readonly _manuallySelected$: Subject<T> = new Subject();
    public readonly selected$: Observable<T | null> = merge(
        this._selected$,
        this._manuallySelected$
    ).pipe(distinctUntilChanged((prev, next) => prev?.id === next?.id));

    private _subscriptions: Subscription[] = [];

    constructor() {
        this._subscriptions = [
            this._manuallySelected$.subscribe((v) =>
                this.emitSelectedListItemHasBeenChanged(v)
            ),
        ];
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.selected && !changes.selected.isFirstChange()) {
            this.setSelected(this.selected);
        }
    }

    public ngOnInit(): void {
        this.setSelected(this.selected);
    }

    public ngOnDestroy(): void {
        this._subscriptions.forEach((s) => s.unsubscribe());
    }

    public onListItemClick(_: Event, item: T): void {
        this.setManuallySelected(item);
    }

    private setManuallySelected(v: T): void {
        this._manuallySelected$.next(v);
    }

    private setSelected(v: T | null): void {
        this._selected$.next(v);
    }

    private emitSelectedListItemHasBeenChanged(v: T | null): void {
        this.selectedItemHasBeenChanged.emit(v);
    }
}
