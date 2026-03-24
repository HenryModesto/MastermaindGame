import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameState, Attempt } from '../../models/game.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="app-shell">

      <!-- NAVBAR -->
      <nav class="navbar">
        <div class="nav-inner">
          <div class="nav-brand">
            <button class="btn-back" (click)="goBack()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <span class="logo-box">itaú</span>
            <span class="nav-title">Mastermind</span>
          </div>
          <div class="nav-meta" *ngIf="gameState">
            <span class="attempts-counter" [class.danger]="gameState.attempts_left <= 3">
              {{ gameState.attempts_left }} tentativas restantes
            </span>

          </div>
        </div>
      </nav>

      <!-- LOADING -->
      <div class="loading-wrap" *ngIf="!gameState">
        <div class="spinner-lg"></div>
        <p>Carregando tabuleiro...</p>
      </div>

      <div class="main-content" *ngIf="gameState">
        <div class="board-wrap">

          <!-- Cabeçalho -->
          <div class="board-head">
            <span class="board-head-id">Partida #{{ gameId }}</span>
            <span class="board-head-hint">Digite números de <strong>1 a 6</strong></span>
          </div>

          <!-- Col headers -->
          <div class="col-header">
            <div class="col-num">#</div>
            <div class="col-pins">Tentativa</div>
            <div class="col-fb">Resultado</div>
          </div>

          <!-- Linhas do histórico -->
          <div class="attempt-rows">
            <div *ngFor="let attempt of gameState.attempts" class="attempt-row past">
              <div class="row-num">{{ attempt.attempt_number }}</div>
              <div class="row-pins">
                <div *ngFor="let digit of attempt.digits" class="pin filled">{{ digit }}</div>
              </div>
              <div class="row-fb">
                <div class="fb-grid">
                  <div *ngFor="let _ of getArray(attempt.correct_positions)" class="fb-dot black"></div>
                  <div *ngFor="let _ of getArray(attempt.wrong_positions)" class="fb-dot white"></div>
                  <div *ngFor="let _ of getArray(4 - attempt.correct_positions - attempt.wrong_positions)" class="fb-dot empty"></div>
                </div>
              </div>
            </div>

            <!-- Linhas vazias -->
            <div *ngFor="let _ of getEmptyRows()" class="attempt-row empty-row">
              <div class="row-num">—</div>
              <div class="row-pins">
                <div class="pin empty" *ngFor="let i of [0,1,2,3]"></div>
              </div>
              <div class="row-fb">
                <div class="fb-grid">
                  <div class="fb-dot empty" *ngFor="let i of [0,1,2,3]"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Linha ativa -->
          <div class="active-row-wrap" *ngIf="gameState.status === 'ongoing'">
            <form [formGroup]="attemptForm" (ngSubmit)="submitAttempt()">
              <div class="active-row">
                <div class="row-num active-arrow">▶</div>
                <div class="row-pins" formArrayName="digits">
                  <input
                    *ngFor="let control of digits.controls; let i=index"
                    type="text" inputmode="numeric" maxlength="1"
                    [formControlName]="i"
                    class="pin-input"
                    [class.pin-filled]="control.value"
                    (keydown)="onKeyDown($event, i)"
                    (input)="onInput($event, i)"
                    id="pin-input-{{i}}"
                    placeholder="·"
                  />
                </div>
                <div class="row-action">
                  <button class="btn-confirm" type="submit" [disabled]="attemptForm.invalid || isSubmitting">
                    <span *ngIf="!isSubmitting">Confirmar</span>
                    <span *ngIf="isSubmitting"><span class="spinner-sm"></span></span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Resultado final -->
          <div class="result-card" *ngIf="gameState.status !== 'ongoing'">
            <div class="result-icon">{{ gameState.status === 'won' ? '🏆' : '💀' }}</div>
            <h2>{{ gameState.status === 'won' ? 'Você venceu!' : 'Fim de jogo!' }}</h2>
            <p *ngIf="gameState.status === 'won'">Código descoberto em <strong>{{ gameState.attempts.length }}</strong> tentativas.</p>
            <p *ngIf="gameState.status === 'lost'">O código secreto era:</p>
            <div class="secret-pins" *ngIf="gameState.secret_code">
              <div *ngFor="let digit of gameState.secret_code" class="pin secret">{{ digit }}</div>
            </div>
            <button class="btn-back-dash" (click)="goBack()">← Voltar ao Dashboard</button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .app-shell { min-height: 100vh; background: #FFF0E4; font-family: 'DM Sans', sans-serif; }

    /* NAVBAR */
    .navbar { background: #fff; border-bottom: 2px solid #EDCFBD; position: sticky; top: 0; z-index: 100; }
    .nav-inner { max-width: 860px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-brand { display: flex; align-items: center; gap: 12px; }
    .btn-back { background: none; border: 1.5px solid #EDCFBD; border-radius: 8px; padding: 7px 10px; cursor: pointer; color: #6B4030; display: flex; align-items: center; transition: all .15s; }
    .btn-back:hover { border-color: #E03D00; color: #E03D00; }
    .logo-box { background: #E03D00; color: #fff; font-family: 'Sora', sans-serif; font-weight: 800; font-size: 15px; padding: 5px 12px; border-radius: 7px; }
    .nav-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #1C0800; }

    .nav-meta { display: flex; align-items: center; gap: 12px; }
    .attempts-counter { font-size: 13px; font-weight: 600; color: #4A1E00; background: #FFF0E4; border: 1.5px solid #EDCFBD; border-radius: 8px; padding: 6px 12px; }
    .attempts-counter.danger { border-color: #E03D00; color: #E03D00; background: #FFF0EE; }
    .status-pill { font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; font-family: 'Sora', sans-serif; }
    .pill-ongoing { background: #E8F4FF; color: #1565C0; }
    .pill-won { background: #E8F5E9; color: #2E7D32; }
    .pill-lost { background: #FFEBEE; color: #C62828; }

    /* LOADING */
    .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; gap: 14px; color: #6B4030; font-weight: 600; }
    .spinner-lg { width: 36px; height: 36px; border: 3px solid #EDCFBD; border-top-color: #E03D00; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* MAIN */
    .main-content { max-width: 860px; margin: 0 auto; padding: 32px 24px; }

    /* BOARD */
    .board-wrap { background: #fff; border-radius: 16px; border: 1.5px solid #EDCFBD; overflow: hidden; }

    .board-head { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1.5px solid #EDCFBD; }
    .board-head-id { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; color: #1C0800; }
    .board-head-hint { font-size: 13px; color: #9B6040; }
    .board-head-hint strong { color: #E03D00; }

    .col-header { display: flex; align-items: center; padding: 10px 24px; background: #E03D00; }
    .col-num { width: 48px; font-family: 'Sora', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.75); }
    .col-pins { flex: 1; font-family: 'Sora', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.75); }
    .col-fb { width: 80px; font-family: 'Sora', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.75); text-align: center; }

    .attempt-rows {}

    .attempt-row { display: flex; align-items: center; padding: 10px 24px; border-bottom: 1px solid #FFF0E4; }
    .attempt-row.past:hover { background: #FFF8F4; }
    .attempt-row.empty-row { opacity: 0.3; }

    .row-num { width: 48px; font-size: 13px; font-weight: 700; color: #C09880; text-align: center; font-family: 'Sora', sans-serif; }
    .active-arrow { color: #E03D00; }

    .row-pins { flex: 1; display: flex; gap: 10px; align-items: center; }

    .pin {
      width: 42px; height: 42px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 800;
    }
    .pin.filled { background: #E03D00; color: #fff; }
    .pin.empty { background: #FFF0E4; border: 1.5px dashed #EDCFBD; }
    .pin.secret { background: #1C0800; color: #fff; }

    .row-fb { width: 80px; display: flex; justify-content: center; }
    .fb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
    .fb-dot { width: 13px; height: 13px; border-radius: 50%; }
    .fb-dot.black { background: #1C0800; }
    .fb-dot.white { background: #fff; border: 1.5px solid #9B6040; }
    .fb-dot.empty { background: #EDCFBD; }

    /* ACTIVE ROW */
    .active-row-wrap { border-top: 1.5px solid #EDCFBD; background: #FFF8F4; padding: 14px 24px; }
    .active-row { display: flex; align-items: center; }

    .pin-input {
      width: 42px; height: 42px; border-radius: 50%;
      border: 1.5px solid #EDCFBD;
      text-align: center; font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 800;
      color: #1C0800; background: #fff; outline: none;
      transition: border-color .15s, background .15s, color .15s;
    }
    .pin-input::placeholder { color: #EDCFBD; font-size: 20px; }
    .pin-input:focus { border-color: #E03D00; box-shadow: 0 0 0 3px rgba(224,61,0,0.1); }
    .pin-input.pin-filled { background: #E03D00; border-color: #E03D00; color: #fff; }

    .row-action { margin-left: 16px; }
    .btn-confirm {
      background: #E03D00; color: #fff; border: none; border-radius: 10px;
      padding: 11px 22px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
      cursor: pointer; transition: background .15s, opacity .15s; white-space: nowrap;
    }
    .btn-confirm:hover:not(:disabled) { background: #C43200; }
    .btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; }

    .spinner-sm { display: inline-block; width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }

    /* RESULT */
    .result-card { border-top: 1.5px solid #EDCFBD; padding: 40px 24px; text-align: center; background: #FFF8F4; }
    .result-icon { font-size: 44px; margin-bottom: 12px; }
    .result-card h2 { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: #1C0800; margin-bottom: 8px; }
    .result-card p { font-size: 14px; color: #6B4030; margin-bottom: 20px; }
    .result-card strong { color: #E03D00; }
    .secret-pins { display: flex; gap: 10px; justify-content: center; margin-bottom: 24px; }
    .btn-back-dash {
      background: #E03D00; color: #fff; border: none; border-radius: 10px;
      padding: 13px 26px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700;
      cursor: pointer; transition: background .15s;
    }
    .btn-back-dash:hover { background: #C43200; }

    @media (max-width: 600px) {
      .main-content { padding: 20px 12px; }
      .nav-inner { padding: 0 16px; }
      .pin, .pin-input { width: 36px; height: 36px; font-size: 15px; }
    }
  `]
})
export class GameComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameService = inject(GameService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  gameId!: number;
  gameState: GameState | null = null;
  isSubmitting = false;

  attemptForm: FormGroup = this.fb.group({
    digits: this.fb.array([
      this.fb.control(null, [Validators.required, Validators.pattern(/^[1-6]$/)]),
      this.fb.control(null, [Validators.required, Validators.pattern(/^[1-6]$/)]),
      this.fb.control(null, [Validators.required, Validators.pattern(/^[1-6]$/)]),
      this.fb.control(null, [Validators.required, Validators.pattern(/^[1-6]$/)])
    ])
  });

  get digits(): FormArray { return this.attemptForm.get('digits') as FormArray; }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) { this.gameId = +id; this.loadGame(); }
    });
  }

  loadGame() {
    this.gameService.getGame(this.gameId).subscribe({
      next: (state) => { this.gameState = state; },
      error: () => { this.router.navigate(['/dashboard']); }
    });
  }

  getArray(length: number): any[] { return new Array(Math.max(0, length)); }

  getEmptyRows(): any[] {
    if (!this.gameState) return [];
    const filled = this.gameState.attempts.length;
    const remaining = Math.max(0, 10 - filled - (this.gameState.status === 'ongoing' ? 1 : 0));
    return new Array(Math.min(remaining, 5));
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
    if (allowed.includes(event.key)) {
      if (event.key === 'Backspace' && !this.digits.at(index).value && index > 0)
        document.getElementById(`pin-input-${index - 1}`)?.focus();
      return;
    }
    if (!/^[1-6]$/.test(event.key)) { event.preventDefault(); return; }
    const input = event.target as HTMLInputElement;
    if (input.value) {
      event.preventDefault();
      this.digits.at(index).setValue(event.key);
      if (index < 3) document.getElementById(`pin-input-${index + 1}`)?.focus();
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.length > 1 ? input.value.slice(-1) : input.value;
    if (value && !/^[1-6]$/.test(value)) { input.value = ''; this.digits.at(index).setValue(null); return; }
    input.value = value;
    this.digits.at(index).setValue(value || null);
    if (value && index < 3) document.getElementById(`pin-input-${index + 1}`)?.focus();
  }

  submitAttempt() {
    if (this.attemptForm.valid && this.gameState) {
      this.isSubmitting = true;
      const values = (this.attemptForm.value.digits as string[]).map(d => parseInt(d, 10));
      this.gameService.makeAttempt(this.gameId, values).subscribe({
        next: (result) => {
          this.isSubmitting = false;
          if (result.status === 'won') this.toastr.success(`Você venceu em ${result.attempt_number} tentativas!`);
          else if (result.status === 'lost') this.toastr.error('Fim de jogo! Você usou todas as tentativas.');
          this.loadGame();
          this.attemptForm.reset();
          document.getElementById('pin-input-0')?.focus();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error(err?.message || 'Erro ao enviar tentativa', 'Erro');
        }
      });
    }
  }

  goBack() { this.router.navigate(['/dashboard']); }
}