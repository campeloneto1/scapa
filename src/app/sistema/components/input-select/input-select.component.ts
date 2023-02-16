import { Component, forwardRef, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputSelectComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: InputSelectComponent,
    },
  ],
})
export class InputSelectComponent {
  
  inputvalor = 0;
  control!: AbstractControl;

  @Input() id!: string;
  @Input() label!: string;
  @Input() data$!: Observable<any>;
  @Input() disabled: boolean = false;

  @Input() optionid: string = 'id';
  @Input() optionname: any = 'nome';
  @Input() allowclear: boolean = true;
  @Input() config: any;

  onChange = (inputvalor: number) => {};

  onTouched = () => {};

  touched = false;

  change() {
    this.markAsTouched();
    if (!this.disabled) {
      this.onChange(this.inputvalor);
    }
  }

  writeValue(inputvalor: number) {
    this.inputvalor = inputvalor;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | void {
    this.control = control;
    //console.log(control)
  }
}
