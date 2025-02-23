import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePage } from './game.page';
import { GameService } from '../../services/game.service';

describe('GamePage', () => {
  let component: GamePage;
  let fixture: ComponentFixture<GamePage>;
  let gameServiceMock: jasmine.SpyObj<GameService>;

  beforeEach(async () => {
    gameServiceMock = jasmine.createSpyObj('GameService', [
      'getBoardSize',
      'getWells',
      'getArrows',
    ]);
    gameServiceMock.getBoardSize.and.returnValue(5);
    gameServiceMock.getWells.and.returnValue(1);
    gameServiceMock.getArrows.and.returnValue(3);
    await TestBed.configureTestingModule({
      imports: [GamePage],
      providers: [{ provide: GameService, useValue: gameServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize boardSize correctly', () => {
    expect(component.boardSize).toBe(5);
  });

  it('should call gameService methods during initialization', () => {
    expect(gameServiceMock.getBoardSize).toHaveBeenCalled();
  });
});
