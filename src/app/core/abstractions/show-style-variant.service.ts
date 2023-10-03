import {Observable} from 'rxjs';
import {ShowStyleVariant} from "../models/show-style-variant";

export abstract class ShowStyleVariantService {
    public abstract getShowStyleVariant(rundownId: string): Observable<ShowStyleVariant>
}
