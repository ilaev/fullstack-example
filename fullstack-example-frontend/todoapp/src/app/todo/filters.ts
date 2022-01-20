import { getToday } from 'src/app/common/date-utility';
import { TodoItem } from 'src/app/common/models';
import { MATRIX_KIND } from './matrix-kind';

export function filterItemsByMatrixKind(matrixKindId: string, items: TodoItem[]): TodoItem[] {
    const today = getToday();
    switch (matrixKindId) {
      case MATRIX_KIND.ALL: 
        return items;
      case MATRIX_KIND.TODAY:
        return items.filter(i => {
          if (i.dueDate == null) {
            // for now show items without a duedate in today
            return true;
          } else {
            return i.dueDate?.equals(today);
          }
        });
      case MATRIX_KIND.UPCOMING:
        return items.filter(i => {
          if (i.dueDate == null) {
            // show withouts without duedate in upcoming
            return true;
          } else {
            return i.dueDate > today;
          }
        });
      default:
        // should only end up here if the user manually edits the url matrix param
        // I could add a validation so that I always have valid matrixKindId, but at the moment it's only used here
        // and if I don't use the matrixKindId anywhere else, it's not worth the time commitment
        return [];
    }
}