import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';
import { GameService } from '../../services/game.service';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let gameServiceMock: jasmine.SpyObj<GameService>;

  beforeEach(async () => {
    gameServiceMock = jasmine.createSpyObj('GameService', [
      'getWells',
      'getArrows',
    ]);
    gameServiceMock.getWells.and.returnValue(3);
    gameServiceMock.getArrows.and.returnValue(5);
    await TestBed.configureTestingModule({
      imports: [BoardComponent],
      providers: [{ provide: GameService, useValue: gameServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    component.boardSize = 4;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameService methods', () => {
    expect(gameServiceMock.getWells).toHaveBeenCalled();
    expect(gameServiceMock.getArrows).toHaveBeenCalled();
  });

  it('should initialize the board with the correct size', () => {
    expect(component.board.length).toBe(component.boardSize);
    expect(component.board[0].length).toBe(component.boardSize);
  });

  it('should place the hunter in the starting position', () => {
    expect(component.hunterPosition).toEqual({
      row: component.boardSize - 1,
      col: 0,
    });
  });
});
