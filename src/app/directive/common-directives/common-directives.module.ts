import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordInputDirective } from './password-input.directive';

@NgModule({
	declarations: [PasswordInputDirective],
	exports: [PasswordInputDirective],
	imports: [CommonModule],
})
export class CommonDirectivesModule {}
