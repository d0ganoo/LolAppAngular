import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DdragonService {
    latestVersion$: Observable<string>;
    champions$: Observable<any[]>;
    items$: Observable<Record<string, any>>;

    constructor(private http: HttpClient) {
        this.latestVersion$ = this.http
            .get<string[]>('https://ddragon.leagueoflegends.com/api/versions.json')
            .pipe(
                map(v => v[0]),
                shareReplay(1)
            );

        this.champions$ = this.latestVersion$.pipe(
            switchMap(ver =>
                this.http.get<any>(
                    `https://ddragon.leagueoflegends.com/cdn/${ver}/data/fr_FR/champion.json`
                )
            ),
            map(res => Object.values(res.data))
        );

        this.items$ = this.latestVersion$.pipe(
            switchMap(ver =>
                this.http.get<any>(
                    `https://ddragon.leagueoflegends.com/cdn/${ver}/data/fr_FR/item.json`
                )
            ),
            map(res => res.data)
        );
    }

    championDetail$(championId: string) {
        return this.latestVersion$.pipe(
            switchMap(ver =>
                this.http.get<any>(
                    `https://ddragon.leagueoflegends.com/cdn/${ver}/data/fr_FR/champion/${championId}.json`
                )
            ),
            map(res => res.data[championId])
        );
    }

    championSquareUrl(version: string, championId: string) {
        return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championId}.png`;
    }

    itemIconUrl(version: string, itemId: string) {
        return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
    }
}
