import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { TextEditorComponent } from './text-editor.component';
import {asSpy} from '../../../test/utilities';
import {FormsModule} from '@angular/forms';

describe('TextEditorComponent', () => {
  let component: TextEditorComponent
  let fixture: ComponentFixture<TextEditorComponent>
  let element: HTMLElement

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextEditorComponent],
      imports: [FormsModule]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditorComponent)
    component = fixture.componentInstance
    component.title = 'a'
    component.body = 'x'
    component.meta = new Map([
      ['i', 'j'],
      ['k', 'l']
    ])
    element = fixture.nativeElement
  })

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should display the title', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    const titleElement: HTMLInputElement = element.querySelector('.title-editor')
    expect(titleElement.value).toBe('a')
  })

  it('should request title edit on value change with debounce time', fakeAsync(async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    const titleElement: HTMLInputElement = element.querySelector('.title-editor')
    expect(titleElement.value).toBe('a')
    const editEmitterSpy = spyOn(component.titleEditRequest, 'emit')

    titleElement.value = 'bc'
    titleElement.dispatchEvent(new Event('input'))
    tick(499)

    titleElement.value = 'bcd'
    titleElement.dispatchEvent(new Event('input'))
    tick(500)

    expect(asSpy(editEmitterSpy)).toHaveBeenCalledTimes(1)
    expect(asSpy(component.titleEditRequest.emit).calls.first().args).toEqual(['bcd'])
  }))

  it('should display the body', async () => {
    fixture.detectChanges()
    await fixture.whenStable()

    const bodyElement: HTMLTextAreaElement = element.querySelector('.body-editor')
    expect(bodyElement.value).toBe('x')
  })

  it('should request body edit on value change with debounce time', fakeAsync(async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    const titleElement: HTMLTextAreaElement = element.querySelector('.body-editor')
    expect(titleElement.value).toBe('x')
    const editEmitterSpy = spyOn(component.bodyEditRequest, 'emit')

    titleElement.value = 'y'
    titleElement.dispatchEvent(new Event('input'))
    tick(499)

    titleElement.value = 'yz'
    titleElement.dispatchEvent(new Event('input'))
    tick(500)

    expect(asSpy(editEmitterSpy)).toHaveBeenCalledTimes(1)
    expect(asSpy(component.bodyEditRequest.emit).calls.first().args).toEqual(['yz'])
  }))

  it('should display meta as key-value pairs', () => {
    fixture.detectChanges()

    const metaPairElements: NodeListOf<Element> = element.querySelectorAll('.meta-pair')
    expect(metaPairElements.length).toBe(2)
    expect(metaPairElements[0].querySelector('.meta-key').textContent).toBe('i')
    expect(metaPairElements[0].querySelector('.meta-value').textContent).toBe('j')
    expect(metaPairElements[1].querySelector('.meta-key').textContent).toBe('k')
    expect(metaPairElements[1].querySelector('.meta-value').textContent).toBe('l')
  })
})
