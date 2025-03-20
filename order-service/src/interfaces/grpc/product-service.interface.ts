import { Observable } from "rxjs";

export interface ProductService {
  FindOne(data: { id: string }): Observable<any>;
  FindMany(data: { ids: string[] }): Observable<any>;
}
