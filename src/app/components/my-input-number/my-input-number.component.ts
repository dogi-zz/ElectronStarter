// tslint:disable:no-any
import {Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * This components wraps InputText into a number with custom parse behavior;
 */

const toString = (num: number) => {
  if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
    return '';
  }
  return `${num}`;
};
const fromString = (numString: string) => {
  return parseFloat(numString);
};

const COLOR_FINE = '#495057';
const COLOR_DIRTY = '#87a1ba';


@Component({
  selector: 'my-input-number',
  templateUrl: './my-input-number.component.html',
  styleUrls: ['./my-input-number.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyInputNumberComponent),
      multi: true,
    },
  ],
})
export class MyInputNumberComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input()
  public width: number | string = 100;

  public inputString: string;
  public widthString: string;
  public colorString: string = COLOR_FINE;


  public onChange: any = () => {
  }
  public onTouch: any = () => {
  }

  constructor() {
  }

  public ngOnInit(): void {
    this.updateWidth();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.width) {
      this.updateWidth();
    }
  }

  private updateWidth() {
    this.widthString = typeof this.width === 'number' ? `${this.width}px` : this.widthString;
  }


  public writeValue(value: any) {
    this.inputString = toString(value);
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  public parseValue() {
    const value = fromString(this.inputString);
    this.inputString = toString(value);
    this.onChange(value);
    this.colorString = COLOR_FINE;
  }

  public touch() {
    this.onTouch();
    this.colorString = COLOR_DIRTY;
  }
}
