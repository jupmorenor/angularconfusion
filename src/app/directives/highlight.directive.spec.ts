import { HighlightDirective } from './highlight.directive';
import { ElementRef, HostListener } from '@angular/core';

describe('HighlightDirective', () => {
  it('should create an instance', () => {
    const directive = new HighlightDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
