import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataSet} from '../models';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataService} from '../services/data.service';

@Injectable({ providedIn: 'root' })
export class DataResolver implements Resolve<DataSet> {
  constructor(private service: DataService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<DataSet> {
    return this.service.loadCSV();
  }
}
