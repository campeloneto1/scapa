import { Component, forwardRef, Input } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from "@angular/forms";

@Component({
    selector: 'app-input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['./input-text.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => InputTextComponent)
    },
    {
        provide: NG_VALIDATORS,
        multi: true,
        useExisting: InputTextComponent
      },
    ]   
})

export class InputTextComponent implements ControlValueAccessor{
  
  @Input() id!: string;
  @Input() label!: string;
  @Input() tipo!: string;
  @Input() mascara!: string;

  inputvalor!: any;
  control!: AbstractControl;

  onChange = (inputvalor:any) => {};

  onTouched = () => {};

  touched = false;

  disabled = true;

  change() {
    this.markAsTouched();
    if (!this.disabled) {     
      //console.log(this.inputvalor)
      this.onChange(this.inputvalor);
    }
  }

  writeValue(inputvalor: any) {
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

  validate(control: AbstractControl): ValidationErrors | void  {
    this.control = control;
    //console.log(control)
  }

}