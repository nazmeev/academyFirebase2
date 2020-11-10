import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
	selector: '[passwordInput]',
})
export class PasswordInputDirective implements OnInit, OnDestroy {
	@Input() passwordInput: HTMLElement | any;

	private sub: Subscription;

	constructor(private elementRef: ElementRef) {}

	get host() {
		return this.elementRef.nativeElement;
	}

	ngOnInit() {
		if (this.passwordInput) {
			this.sub = fromEvent(this.passwordInput, 'click').subscribe(() => {
				this.passwordInput.textContent =
					this.passwordInput.textContent === 'visibility' ? 'visibility_off' : 'visibility';
				this.host.type = this.host.type === 'password' ? 'text' : 'password';
			});
		}
	}

	ngOnDestroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
}
