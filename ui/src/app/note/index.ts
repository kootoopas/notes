import {Note} from './note';

export function createEmptyNote(): Note {
  return {
    id: null,
    title: '',
    body: '',
    creationDate: null,
    modificationDate: null
  }
}
