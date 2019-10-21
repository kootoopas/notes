import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSnippetComponent } from './text-snippet.component';
import {provideMockStore} from '@ngrx/store/testing';
import {asSpy} from '../../../test/utilities';

describe('TextSnippetComponent', () => {
  let component: TextSnippetComponent;
  let fixture: ComponentFixture<TextSnippetComponent>;
  let element: HTMLElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextSnippetComponent ],
      providers: [ provideMockStore() ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextSnippetComponent);
    component = fixture.componentInstance;
    component.id = '1'
    component.header = 'a'
    component.body = 'x'
    component.bodyLimit = 100
    component.footer = 'i'
    element = fixture.nativeElement
  });

  it('should create', () => {
    fixture.detectChanges()

    expect(component).toBeTruthy();
  });

  it('should display a text piece composed of a title, brief elaboration and footer', () => {
    fixture.detectChanges()

    expect(element.querySelector('.header').textContent).toBe('a')
    expect(element.querySelector('.body').textContent).toBe('x')
    expect(element.querySelector('.footer').textContent).toBe('i')
  })

  it('should cut display of the body per configurable limit and append an ellipsis', () => {
    component.body = 'abc'
    component.bodyLimit = 2

    fixture.detectChanges()

    expect(element.querySelector('.body').textContent).toBe('ab…')
  })

  it('should only allow a positive integer as body limit', () => {
    for (const invalidBodyLimit of [1.02, -1, Infinity]) {
      expect(() => component.bodyLimit = invalidBodyLimit).toThrow()
    }
  })

  it('should display empty header if not provided', () => {
    component.header = undefined

    fixture.detectChanges()

    expect(element.querySelector('.header').textContent).toBe('')
  })

  it('should display empty body if not provided', () => {
    component.body = undefined

    fixture.detectChanges()

    expect(element.querySelector('.body').textContent).toBe('')
  })

  it('should display empty footer if not provided', () => {
    component.footer = undefined

    fixture.detectChanges()

    expect(element.querySelector('.footer').textContent).toBe('')
  })

  it('should visually represent active state when specified', () => {
    fixture.detectChanges()
    const snippetElement = element.querySelector('.note-snippet')
    expect(snippetElement).not.toHaveClass('active')

    component.active = true
    fixture.detectChanges()

    expect(snippetElement).toHaveClass('active')
  })

  it('should request snippet activation on double click', () => {
    fixture.detectChanges()

    element.querySelector('.note-snippet').dispatchEvent(new Event('dblclick'))
    fixture.detectChanges()

    expect(asSpy(component.activationRequest.emit)).toHaveBeenCalledTimes(1)
    expect(asSpy(component.activationRequest.emit)).toHaveBeenCalledWith('1')
  })
});
