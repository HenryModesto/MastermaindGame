import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-wrapper">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>

      <div class="split-layout">
        <div class="brand-side">
          <div class="brand-content">
            <div class="itau-logo"><span class="logo-box">itaú</span></div>
            <h1 class="brand-title">Mastermind<br><span>Desafie sua mente</span></h1>
            <p class="brand-desc">O jogo de lógica e estratégia do Itaú. Teste suas habilidades e dispute com outros jogadores.</p>
            <div class="brand-dots">
              <span class="dot active"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        </div>

        <div class="form-side">
          <div class="form-card">
            <div class="form-header">
              <h2>Acesso à Conta</h2>
              <p>Insira suas credenciais do Mastermind</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" autocomplete="off">
              <div class="field-group">
                <label class="field-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Usuário
                </label>
                <input class="field-input" [class.field-error]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                  type="text" formControlName="username" placeholder="Seu nome de usuário" />
                <span class="error-msg" *ngIf="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched">Usuário é obrigatório</span>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Senha
                </label>
                <div class="input-pw-wrap">
                  <input class="field-input" [class.field-error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    [type]="showPw ? 'text' : 'password'" formControlName="password" placeholder="Sua senha" />
                  <button type="button" class="toggle-pw" (click)="showPw = !showPw" tabindex="-1">
                    <svg *ngIf="!showPw" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg *ngIf="showPw" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
                <span class="error-msg" *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched">Senha é obrigatória</span>
              </div>

              <div class="forgot-row">
                <a href="#" class="link-forgot">Esqueceu a senha?</a>
              </div>

              <button class="btn-submit" type="submit" [disabled]="loginForm.invalid || isLoading">
                <span *ngIf="!isLoading">Entrar</span>
                <span *ngIf="isLoading" class="spinner-text"><span class="spinner"></span> Entrando...</span>
              </button>
            </form>

            <div class="form-footer">
              <span>Não tem uma conta?</span>
              <a routerLink="/register" class="link-alt">Criar conta →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .page-wrapper {
      position: relative; min-height: 100vh;
      background: #FFF0E4; overflow: hidden;
      font-family: 'DM Sans', sans-serif;
    }

    .blob { position: absolute; z-index: 0; }
    .blob-1 {
      width: 800px; height: 800px;
      background: radial-gradient(circle at 38% 38%, #E03D00 0%, #FF4500 35%, #FF6200 70%, #FF8C00 100%);
      top: -340px; left: -280px;
      border-radius: 55% 45% 65% 35% / 45% 55% 45% 55%;
      animation: morph1 11s ease-in-out infinite;
      filter: drop-shadow(0 40px 80px rgba(224,61,0,0.5));
    }
    .blob-2 {
      width: 480px; height: 480px;
      background: radial-gradient(circle at 40% 60%, #FFB347 0%, #FF5500 80%);
      bottom: -150px; left: 40px;
      border-radius: 40% 60% 35% 65% / 60% 40% 65% 35%;
      animation: morph2 13s ease-in-out infinite;
      filter: drop-shadow(0 20px 50px rgba(255,85,0,0.4));
    }
    .blob-3 {
      width: 220px; height: 220px;
      background: #FF4500; top: 60%; right: 2%;
      border-radius: 60% 40% 50% 50%;
      opacity: 0.14; animation: morph1 9s ease-in-out infinite reverse;
    }
    @keyframes morph1 { 0%,100%{border-radius:55% 45% 65% 35%/45% 55% 45% 55%} 50%{border-radius:35% 65% 45% 55%/65% 35% 55% 45%} }
    @keyframes morph2 { 0%,100%{border-radius:40% 60% 35% 65%/60% 40% 65% 35%} 50%{border-radius:65% 35% 60% 40%/35% 65% 40% 60%} }

    .split-layout { position: relative; z-index: 1; display: flex; min-height: 100vh; }

    .brand-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px 56px; }
    .brand-content { max-width: 380px; }
    .itau-logo { margin-bottom: 44px; }
    .logo-box {
      background: #fff; color: #E03D00;
      font-family: 'Sora', sans-serif; font-weight: 800; font-size: 22px;
      padding: 9px 20px; border-radius: 10px; letter-spacing: -0.5px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    .brand-title {
      font-family: 'Sora', sans-serif; font-size: 52px; font-weight: 800;
      line-height: 1.08; color: #1C0800; margin-bottom: 20px;
    }
    .brand-title span { display: block; font-size: 22px; font-weight: 600; color: #6B2800; margin-top: 6px; }
    .brand-desc { font-size: 15px; line-height: 1.75; color: #4A1E00; margin-bottom: 44px; font-weight: 500; }
    .brand-dots { display: flex; gap: 8px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(74,30,0,0.3); transition: all .3s; }
    .dot.active { width: 28px; border-radius: 4px; background: #E03D00; }

    .form-side {
      width: 460px; display: flex; align-items: center; justify-content: center;
      padding: 48px 44px; background: #fff;
      box-shadow: -24px 0 80px rgba(224,61,0,0.12);
    }
    .form-card { width: 100%; max-width: 360px; }

    .form-header { margin-bottom: 36px; }
    .form-header h2 { font-family: 'Sora', sans-serif; font-size: 28px; font-weight: 800; color: #1C0800; margin-bottom: 6px; }
    .form-header p { font-size: 14px; color: #6B4030; font-weight: 500; }

    .field-group { margin-bottom: 20px; }
    .field-label {
      display: flex; align-items: center; gap: 7px;
      font-size: 11px; font-weight: 800; color: #2E0E00;
      margin-bottom: 8px; letter-spacing: 0.8px; text-transform: uppercase;
    }
    .field-label svg { color: #E03D00; flex-shrink: 0; }

    .field-input {
      width: 100%; padding: 14px 16px;
      border: 2px solid #EDCFBD; border-radius: 12px;
      font-size: 15px; font-family: 'DM Sans', sans-serif;
      color: #1C0800; background: #FFF8F2;
      transition: border-color .2s, box-shadow .2s, background .2s; outline: none;
    }
    .field-input:focus { border-color: #E03D00; background: #fff; box-shadow: 0 0 0 4px rgba(224,61,0,0.12); }
    .field-input.field-error { border-color: #b71c1c; box-shadow: 0 0 0 4px rgba(183,28,28,0.08); }
    .field-input::placeholder { color: #C09880; }

    .input-pw-wrap { position: relative; }
    .input-pw-wrap .field-input { padding-right: 48px; }
    .toggle-pw { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #C09880; padding: 4px; transition: color .2s; }
    .toggle-pw:hover { color: #E03D00; }

    .error-msg { display: block; font-size: 12px; color: #b71c1c; margin-top: 5px; font-weight: 600; }

    .forgot-row { display: flex; justify-content: flex-end; margin-bottom: 24px; margin-top: -8px; }
    .link-forgot { font-size: 13px; color: #E03D00; text-decoration: none; font-weight: 700; }
    .link-forgot:hover { text-decoration: underline; }

    .btn-submit {
      width: 100%; padding: 16px;
      background: linear-gradient(135deg, #E03D00 0%, #FF4500 40%, #FF6200 70%, #FF8C00 100%);
      color: #fff; border: none; border-radius: 12px;
      font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700;
      cursor: pointer; letter-spacing: 0.5px;
      transition: transform .15s, box-shadow .15s, opacity .15s;
      box-shadow: 0 8px 28px rgba(224,61,0,0.5);
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(224,61,0,0.6); }
    .btn-submit:active:not(:disabled) { transform: translateY(0); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner-text { display: flex; align-items: center; justify-content: center; gap: 10px; }
    .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .form-footer { display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 28px; font-size: 14px; color: #6B4030; font-weight: 500; }
    .link-alt { color: #E03D00; text-decoration: none; font-weight: 700; font-family: 'Sora', sans-serif; }
    .link-alt:hover { text-decoration: underline; }

    @media (max-width: 768px) {
      .brand-side { display: none; }
      .form-side { width: 100%; box-shadow: none; padding: 40px 24px; }
      .blob-1 { width: 380px; height: 380px; top: -130px; left: -130px; }
      .blob-2 { width: 220px; height: 220px; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  showPw = false;
  isLoading = false;

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.toastr.success('Login realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err?.message || 'Credenciais inválidas', 'Erro de autenticação');
        }
      });
    }
  }
}