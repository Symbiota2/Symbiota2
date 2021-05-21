import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

export function formToQueryParams(form: FormGroup): Record<string, unknown> {
    const params = {};
    const formObj = form.value as Record<string, unknown>;
    const formKeys = Object.keys(formObj);

    for (const k of formKeys) {
        const v = formObj[k];
        const arrayOK = Array.isArray(v) && v.length > 0;
        const scalarOK = !Array.isArray(v) && !(isNull(v) || isNan(v));

        if (arrayOK || scalarOK) {
            params[k] = v;
        }
    }

    return params;
}

function isNull(val: any): boolean {
    return ['', null, undefined].includes(val);
}

function isNan(val: any): boolean {
    return typeof val === 'number' && isNaN(val);
}
