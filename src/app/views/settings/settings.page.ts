import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      cells: [, [Validators.required, Validators.min(5), Validators.max(10)]],
      wells: [, [Validators.required, Validators.min(1), Validators.max(5)]],
      arrows: [, [Validators.required, Validators.min(1), Validators.min(5)]],
    });
  }

  next() {
    const { cells, wells, arrows } = this.setUpForm.value;
    this.gameService.setGameSettings(cells, wells, arrows);
    this.router.navigate(['/game']);
  }
}
