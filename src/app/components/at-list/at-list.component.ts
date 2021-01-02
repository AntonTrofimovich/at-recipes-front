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
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { distinctUntilChanged, tap } from "rxjs/operators";

type AtListData = {
    id: string;
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
    public readonly selected$: Observable<T | null> = this._selected$.pipe(
        tap((v) => console.log(v))
    );

    private _subscriptions: Subscription[] = [];

    constructor() {
        this._subscriptions = [
            this._selected$.subscribe((v) =>
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
        this.setSelected(item);
    }

    private setSelected(v: T | null): void {
        this._selected$.next(v);
    }

    private emitSelectedListItemHasBeenChanged(v: T | null): void {
        this.selectedItemHasBeenChanged.emit(v);
    }
}
