import { SortColumn, SortDirection } from "../shared/directives/sortable.directive";
import { IClient, IClientParameters } from "../shared/interfaces/client-search.interface";
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { CornetService } from "./cornet.service";

interface SearchResult {
    clients: IClient[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
    currentName: boolean;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(clients: IClient[], column: SortColumn, direction: string): IClient[] {
    if (direction === '' || column === '') {
        return clients;
    } else {
        return [...clients].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

function matches(client: IClient, term: string, pipe: PipeTransform) {
    return client.personName.toLowerCase().includes(term.toLowerCase());
    // || pipe.transform(client.field).includes(term)   //if we want to filter on additional fields
    // && pipe.transform(client.isCurrentName).includes(term);
}

@Injectable({ providedIn: 'root' })
export class ClientService {
    loaded_clients: IClient[] = [];

    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _clients$ = new BehaviorSubject<IClient[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 5,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
        currentName: false,
    };

    constructor(private pipe: DecimalPipe,
        private cornetService: CornetService) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            // debounceTime(200),
            switchMap(() => this.search()),
            // delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._clients$.next(result.clients);
            this._total$.next(result.total);
        });

        this._search$.next();
    }

    get clients$() { return this._clients$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }
    get currentName() { return this._state.currentName; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    set currentName(currentName: boolean) { this._set({ currentName }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm, currentName } = this._state;

        let clients = this.loaded_clients;
        // 1. sort
        clients = sort(clients, sortColumn, sortDirection);

        // 2. filter
        clients = clients.filter(client => matches(client, searchTerm, this.pipe));
        if (currentName) {
            clients = clients.filter(client => client.isCurrentName === "Y");
        }
        const total = clients.length;

        // 3. paginate
        clients = clients.slice((page - 1) * pageSize, ((page - 1) * pageSize) + pageSize);

        return of({ clients, total });
    }

    updateClients(parameters: IClientParameters) {
        this.page = 1;
        this._loading$.next(true);
        this.cornetService.getClients(parameters).subscribe((res) => {
            if (res && res.clients) {
                this.loaded_clients = res.clients;
                this._search$.next();
                console.log(this.loaded_clients);
            }
            else {
                this._loading$.next(false);
                this.loaded_clients = [];
            }
        }, (err) => {
            // console.log("error getting clients info");
            this._loading$.next(false);
        });
    }
}