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
    // || pipe.transform(client.field).includes(term);
}

@Injectable({ providedIn: 'root' })
export class ClientService {
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _clients$ = new BehaviorSubject<IClient[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 20,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    constructor(private pipe: DecimalPipe,
        private cornetService: CornetService) {
        //   this._search$.pipe(
        //     tap(() => this._loading$.next(true)),
        //     debounceTime(200),
        //     switchMap(() => this._search()),
        //     delay(200),
        //     tap(() => this._loading$.next(false))
        //   ).subscribe(result => {
        //     this._clients$.next(result.clients);
        //     this._total$.next(result.total);
        //   });

        // this._search$.next();
    }

    get clients$() { return this._clients$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    search(clients: IClient[]): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        // 1. sort
        clients = sort(clients, sortColumn, sortDirection);

        // 2. filter
        clients = clients.filter(client => matches(client, searchTerm, this.pipe));
        const total = clients.length;

        // 3. paginate
        clients = clients.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({ clients, total });
    }

    updateClients(parameters: IClientParameters) {
        this.cornetService.getClients(parameters).subscribe((res) => {
            this.search(res.clients).subscribe((result) => {
                this._clients$.next(result.clients);
                this._total$.next(result.total);
            }, (err) => {

            });

            this._search$.next();
        }, (err) => {

        });
    }
}