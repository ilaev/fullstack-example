import { DateTime } from 'luxon';
import { TestBed } from '@angular/core/testing';
import { combineLatest, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { TodoApiService, TodoItemDto, TodoListDto, UserApiService } from '../../api';
import { v4 as uuidv4 } from 'uuid';
import { TodoDataService } from './todo-data.service';
import { MatrixX, MatrixY, TodoItem, TodoList } from '../../models';
import { transformToTodoItemDTO } from '../transform/transform-todo-item-dto';
import { transformToTodoListDTO } from '../transform/transform-todo-list-dto';

describe('TodoDataService', () => {
  let service: TodoDataService;
  let spyTodoApiService: jasmine.SpyObj<TodoApiService>;
  let spyUserApiService: jasmine.SpyObj<UserApiService>;

  beforeEach(() => {
    spyTodoApiService = jasmine.createSpyObj<TodoApiService>('TodoApiService',
    {
      createItems: of<any>(undefined),
      updateItems: of<any>(undefined),
      createLists: of<any>(undefined),
      updateLists: of<any>(undefined)
    });
    spyUserApiService = jasmine.createSpyObj<UserApiService>('UserApiService',
    {
      getItemsOfCurrentUser: of([]),
      getListsOfCurrentUser: of([]),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: TodoApiService, useValue: spyTodoApiService },
        { provide: UserApiService, useValue: spyUserApiService }
      ]
    });
    service = TestBed.inject(TodoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return todo items.', () => {
    const itemDto: TodoItemDto = {
      createdAt: DateTime.utc(2020, 1, 1).toJSON(),
      deletedAt: null,
      dueDate: null,
      id: uuidv4(),
      listId: uuidv4(),
      markedAsDone: false,
      matrixX: 0,
      matrixY: 0,
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test item',
      note: 'just a note'
    };
    spyUserApiService.getItemsOfCurrentUser.and.returnValue(of([itemDto]));
    service.getTodoItems().pipe(first()).subscribe({
      next: (items) => {
        expect(items.length).toEqual(1);
        expect(items[0].id).toEqual(itemDto.id);
        expect(items[0].listId).toEqual(itemDto.listId);
        expect(items[0].createdAt.equals(DateTime.utc(2020, 1, 1).toLocal())).toBeTrue();
        expect(items[0].modifiedAt.equals(DateTime.utc(2020, 1, 1).toLocal())).toBeTrue();
        expect(items[0].deletedAt).toBeNull();
        expect(items[0].dueDate).toBeNull();
        expect(items[0].markedAsDone).toBeFalse();
        expect(items[0].matrixX).toEqual(MatrixX.Urgent);
        expect(items[0].matrixY).toEqual(MatrixY.Important);
        expect(items[0].name).toEqual(itemDto.name);
        expect(items[0].note).toEqual(itemDto.note);
      }
    });
  });

  it('should return cached todo items after loading them once.', () => {
    combineLatest([service.getTodoItems(), service.getTodoItems()]).pipe(first()).subscribe({
      next: () => {
        expect(spyUserApiService.getItemsOfCurrentUser).toHaveBeenCalledOnceWith();
      }
    });
  });

  it('should return todo lists.', () => {
    // arrange
    const listDto: TodoListDto = {
      color : '',
      createdAt: DateTime.utc(2020, 1, 1,).toJSON(),
      deletedAt: null,
      description: 'test',
      id: uuidv4(),
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test list'
    };
    spyUserApiService.getListsOfCurrentUser.and.returnValue(of([listDto]));
    // act
    service.getLists().pipe(first()).subscribe({
      next: (lists) => {
        // assert
        expect(lists.length).toEqual(1);
        expect(lists[0].id).toEqual(listDto.id);
        expect(lists[0].color).toEqual(listDto.color);
        expect(lists[0].description).toEqual(listDto.description);
        expect(lists[0].name).toEqual(listDto.name);
        expect(lists[0].createdAt.equals(DateTime.utc(2020, 1, 1).toLocal())).toBeTrue();
        expect(lists[0].modifiedAt.equals(DateTime.utc(2020, 1, 1).toLocal())).toBeTrue();
        expect(lists[0].deletedAt).toBeNull();
      }
    });

  });

  it('should return cached todo lists after loading them once.', () => {
    combineLatest([service.getLists(), service.getLists()]).pipe(first()).subscribe({
      next: () => {
        expect(spyUserApiService.getListsOfCurrentUser).toHaveBeenCalledOnceWith();
      }
    });
  });

  it('should return items filtered by todo list id.', () => {
    // arrange
    const itemDto: TodoItemDto = {
      createdAt: DateTime.utc(2020, 1, 1).toJSON(),
      deletedAt: null,
      dueDate: null,
      id: uuidv4(),
      listId: uuidv4(),
      markedAsDone: false,
      matrixX: 0,
      matrixY: 0,
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test item',
      note: 'just a note'
    };
    const itemDto2: TodoItemDto = {
      createdAt: DateTime.utc(2020, 1, 1).toJSON(),
      deletedAt: null,
      dueDate: null,
      id: uuidv4(),
      listId: uuidv4(),
      markedAsDone: false,
      matrixX: 1,
      matrixY: 1,
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test item 2',
      note: 'just a note 2'
    };
    spyUserApiService.getItemsOfCurrentUser.and.returnValue(of([itemDto, itemDto2]));

    // act
    service.getTodoItemsByListId(itemDto.listId).pipe(first()).subscribe({
      next: (items) => {
        // assert
        expect(items.length).toEqual(1);
        expect(items[0].id).toEqual(itemDto.id);
        expect(items[0].listId).toEqual(itemDto.listId);
      }
    });
  });

  it('should return item for provided id.', () => {
    // arrange
    const itemDto: TodoItemDto = {
      createdAt: DateTime.utc(2020, 1, 1).toJSON(),
      deletedAt: null,
      dueDate: null,
      id: uuidv4(),
      listId: uuidv4(),
      markedAsDone: false,
      matrixX: 0,
      matrixY: 0,
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test item',
      note: 'just a note'
    };
    const itemDto2: TodoItemDto = {
      createdAt: DateTime.utc(2020, 1, 1).toJSON(),
      deletedAt: null,
      dueDate: null,
      id: uuidv4(),
      listId: uuidv4(),
      markedAsDone: false,
      matrixX: 1,
      matrixY: 1,
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test item 2',
      note: 'just a note 2'
    };
    spyUserApiService.getItemsOfCurrentUser.and.returnValue(of([itemDto, itemDto2]));

    // act
    service.getTodoItem(itemDto.id).pipe(first()).subscribe({
      next: (item) => {
        // assert
        expect(item?.id).toEqual(itemDto.id);
      }
    });
  });

  it('should return todo list for provided id.', () => {
    // arrange
    const listDto: TodoListDto = {
      color : '',
      createdAt: DateTime.utc(2020, 1, 1,).toJSON(),
      deletedAt: null,
      description: 'test',
      id: uuidv4(),
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test list'
    };
    const listDto2: TodoListDto = {
      color : '',
      createdAt: DateTime.utc(2020, 1, 1,).toJSON(),
      deletedAt: null,
      description: 'test 2',
      id: uuidv4(),
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test list 2'
    };
    spyUserApiService.getListsOfCurrentUser.and.returnValue(of([listDto, listDto2]));
    // act
    service.getList(listDto2.id).pipe(first()).subscribe({
      next: (list) => {
        // assert
        expect(list?.id).toEqual(listDto2.id);
      }
    });
  });

  it('should be able to change done status of todo items', () => {
    // arrange
    const itemDto: TodoItemDto = {
      createdAt: DateTime.utc(2020, 1, 1).toJSON(),
      deletedAt: null,
      dueDate: null,
      id: uuidv4(),
      listId: uuidv4(),
      markedAsDone: false,
      matrixX: 0,
      matrixY: 0,
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test item',
      note: 'just a note'
    };
    const itemDto2: TodoItemDto = {
      createdAt: DateTime.utc(2020, 1, 1).toJSON(),
      deletedAt: null,
      dueDate: null,
      id: uuidv4(),
      listId: uuidv4(),
      markedAsDone: false,
      matrixX: 1,
      matrixY: 1,
      modifiedAt: DateTime.utc(2020, 1, 1,).toJSON(),
      name: 'test item 2',
      note: 'just a note 2'
    };
    const secondCallItemDto = {... itemDto};
    secondCallItemDto.markedAsDone = true;
    const secondCallItemDto2 = {... itemDto2};
    secondCallItemDto2.markedAsDone = true;
    spyUserApiService.getItemsOfCurrentUser.and.returnValues(of([itemDto, itemDto2]), of([secondCallItemDto, secondCallItemDto2]));
    // act
    const dictOfChanges: { [key: string]: boolean } = {};
    dictOfChanges[itemDto.id] = true;
    dictOfChanges[itemDto2.id] = true;

    service.changeDoneStatusOfItems(dictOfChanges).pipe(first()).subscribe({
      next: (latestItems) => {
        // assert
        expect(latestItems[0].id).toEqual(secondCallItemDto.id);
        expect(latestItems[0].markedAsDone).toBeTrue();
        expect(latestItems[1].id).toEqual(secondCallItemDto2.id);
        expect(latestItems[1].markedAsDone).toBeTrue();
      }
    });
  });

  it('should be able to update todo items.', () => {
     // arrange
     const item = new TodoItem(
      uuidv4(),
      uuidv4(),
      'update item',
      MatrixX.Urgent,
      MatrixY.Important,
      'update a note',
      null,
      DateTime.utc(2020, 1, 1),
      DateTime.utc(2020, 1, 1,),
      null,
      false);
    // act
    service.setTodoItem(item).pipe(first()).subscribe({
      next: () => {
        // assert
        expect(spyTodoApiService.updateItems).toHaveBeenCalledWith([transformToTodoItemDTO(item)]);
      }
    });
  });

  it('should be able to create todo item', () => {
      // arrange
      const item = new TodoItem(
      '',
      uuidv4(),
      'update item',
      MatrixX.Urgent,
      MatrixY.Important,
      'update a note',
      null,
      DateTime.utc(2020, 1, 1),
      DateTime.utc(2020, 1, 1,),
      null,
      false);
    // act
    service.setTodoItem(item).pipe(first()).subscribe({
      next: () => {
        // assert
        expect(spyTodoApiService.createItems).toHaveBeenCalledWith([transformToTodoItemDTO(item)]);
      }
    });
  });

  it('should be able to update todo lists.', () => {
    // arrange
    const list = new TodoList(
      uuidv4(),
      'just a list name',
      "plain description",
      DateTime.utc(2020, 1, 1),
      DateTime.utc(2020, 1, 1,),
      null,
      '#ffffff'
    );
    // act
    service.setList(list).pipe(first()).subscribe({
      next: () => {
        // assert
        expect(spyTodoApiService.updateLists).toHaveBeenCalledWith([transformToTodoListDTO(list)]);
      }
    });
  });

  it('should be able to create todo list.', () => {
    // arrange
    const list = new TodoList(
      '',
      'just a list name',
      "plain description",
      DateTime.utc(2020, 1, 1),
      DateTime.utc(2020, 1, 1,),
      null,
      '#ffffff'
    );
    // act
    service.setList(list).pipe(first()).subscribe({
      next: () => {
        // assert
        expect(spyTodoApiService.createLists).toHaveBeenCalledWith([transformToTodoListDTO(list)]);
      }
    });
  });

});
