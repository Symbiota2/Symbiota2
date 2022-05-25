import {
    Component,
    ElementRef,
    Input,
    Output,
    ViewChild,
    EventEmitter,
    forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type onChangeListener = (file: File) => void;
type onTouchedListener = () => void;

@Component({
    selector: 'symbiota2-file-upload-field',
    templateUrl: './file-upload-field.component.html',
    styleUrls: ['./file-upload-field.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FileUploadFieldComponent),
        multi: true
    }]
})
export class FileUploadFieldComponent implements ControlValueAccessor {
    @Input() file: File = null;
    @Input() disabled: Boolean = false;
    @Output() fileChanged = new EventEmitter<File>();
    @ViewChild('fileInput') fileInput: ElementRef = null;

    private onChangeListener: onChangeListener = null;
    private onTouchedListener: onTouchedListener = null;

    constructor() { }

    onBrowseClicked() {
        if (this.fileInput !== null) {
            this.fileInput.nativeElement.click();
            this.onTouchedListener();
        }
    }

    onFileChanged(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files.length > 0 && this.onChangeListener !== null) {
            const file = target.files[0];

            this.file = file;
            this.onChangeListener(file);
            this.fileChanged.emit(file);
        }
    }

    registerOnChange(fn: onChangeListener) {
        this.onChangeListener = fn;
    }

    registerOnTouched(fn: onTouchedListener) {
        this.onTouchedListener = fn;
    }

    writeValue(obj: File) {
        this.file = obj;
    }
}
