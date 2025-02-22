import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
})
export class SettingsPage implements OnInit {
  setUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.setUpForm = this.fb.group({
      cells: [, [Validators.required]],
      wells: [, [Validators.required]],
      arrows: [, [Validators.required]],
    });
  }

  next() {
    const { cells, wells, arrows } = this.setUpForm.value;
    this.gameService.setGameSettings(cells, wells, arrows);
    this.router.navigate(['/game']);
  }
}
