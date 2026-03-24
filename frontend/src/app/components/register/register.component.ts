import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
  } else { confirm?.setErrors(null); }
  return null;
}

@Component({
  selector: 'app-register',
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
            <h1 class="brand-title">Bem-vindo<br><span>ao Mastermind</span></h1>
            <p class="brand-desc">Crie sua conta e comece a desafiar sua lógica e estratégia contra outros jogadores do Itaú.</p>
          </div>
        </div>

        <div class="form-side">
          <div class="form-card">
            <div class="form-header">
              <h2>Criar Conta</h2>
              <p>Cadastre-se para jogar Mastermind</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" autocomplete="off">
              <div class="fields-row">
                <div class="field-group">
                  <label class="field-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Usuário
                  </label>
                  <input class="field-input" [class.field-error]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                    [class.field-valid]="registerForm.get('username')?.valid && registerForm.get('username')?.touched"
                    type="text" formControlName="username" placeholder="Seu usuário" />
                  <span class="error-msg" *ngIf="registerForm.get('username')?.hasError('required') && registerForm.get('username')?.touched">Obrigatório</span>
                  <span class="error-msg" *ngIf="registerForm.get('username')?.hasError('minlength') && registerForm.get('username')?.touched">Mín. 3 caracteres</span>
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    E-mail
                  </label>
                  <input class="field-input" [class.field-error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                    [class.field-valid]="registerForm.get('email')?.valid && registerForm.get('email')?.touched"
                    type="email" formControlName="email" placeholder="seu@email.com" />
                  <span class="error-msg" *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched">Obrigatório</span>
                  <span class="error-msg" *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched">E-mail inválido</span>
                </div>
              </div>

              <div class="fields-row">
                <div class="field-group">
                  <label class="field-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Senha
                  </label>
                  <div class="input-pw-wrap">
                    <input class="field-input" [class.field-error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                      [class.field-valid]="registerForm.get('password')?.valid && registerForm.get('password')?.touched"
                      [type]="showPw ? 'text' : 'password'" formControlName="password" placeholder="Mín. 6 dígitos" />
                    <button type="button" class="toggle-pw" (click)="showPw = !showPw" tabindex="-1">
                      <svg *ngIf="!showPw" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      <svg *ngIf="showPw" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  </div>
                  <span class="error-msg" *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched">Obrigatório</span>
                  <span class="error-msg" *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched">Mín. 6 caracteres</span>
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    Confirmar
                  </label>
                  <div class="input-pw-wrap">
                    <input class="field-input" [class.field-error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                      [class.field-valid]="registerForm.get('confirmPassword')?.valid && registerForm.get('confirmPassword')?.touched"
                      [type]="showConfirm ? 'text' : 'password'" formControlName="confirmPassword" placeholder="Repita a senha" />
                    <button type="button" class="toggle-pw" (click)="showConfirm = !showConfirm" tabindex="-1">
                      <svg *ngIf="!showConfirm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      <svg *ngIf="showConfirm" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  </div>
                  <span class="error-msg" *ngIf="registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched">Obrigatório</span>
                  <span class="error-msg" *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">Senhas diferentes</span>
                </div>
              </div>

              <div class="strength-wrapper" *ngIf="registerForm.get('password')?.value">
                <div class="strength-bar"><div class="strength-fill" [style.width]="passwordStrength + '%'" [class]="'s-' + strengthLabel"></div></div>
                <span class="strength-text" [class]="'s-' + strengthLabel">{{ strengthLabel | titlecase }}</span>
              </div>

              <button class="btn-submit" type="submit" [disabled]="registerForm.invalid || isLoading">
                <span *ngIf="!isLoading">Criar Conta</span>
                <span *ngIf="isLoading" class="spinner-text"><span class="spinner"></span> Cadastrando...</span>
              </button>
            </form>

            <div class="form-footer">
              <span>Já tem uma conta?</span>
              <a routerLink="/login" class="link-alt">Entrar →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .page-wrapper { position: relative; min-height: 100vh; background: #FFF0E4; overflow: hidden; font-family: 'DM Sans', sans-serif; }

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
    .blob-3 { width: 220px; height: 220px; background: #FF4500; top: 60%; right: 2%; border-radius: 60% 40% 50% 50%; opacity: 0.14; animation: morph1 9s ease-in-out infinite reverse; }
    @keyframes morph1 { 0%,100%{border-radius:55% 45% 65% 35%/45% 55% 45% 55%} 50%{border-radius:35% 65% 45% 55%/65% 35% 55% 45%} }
    @keyframes morph2 { 0%,100%{border-radius:40% 60% 35% 65%/60% 40% 65% 35%} 50%{border-radius:65% 35% 60% 40%/35% 65% 40% 60%} }

    .split-layout { position: relative; z-index: 1; display: flex; min-height: 100vh; }

    .brand-side { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px 56px; }
    .brand-content { max-width: 380px; }
    .itau-logo { margin-bottom: 40px; }
    .logo-box { background: #fff; color: #E03D00; font-family: 'Sora', sans-serif; font-weight: 800; font-size: 22px; padding: 9px 20px; border-radius: 10px; letter-spacing: -0.5px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
    .brand-title { font-family: 'Sora', sans-serif; font-size: 48px; font-weight: 800; line-height: 1.08; color: #1C0800; margin-bottom: 20px; }
    .brand-title span { display: block; font-size: 22px; font-weight: 600; color: #6B2800; margin-top: 6px; }
    .brand-desc { font-size: 15px; line-height: 1.75; color: #4A1E00; margin-bottom: 36px; font-weight: 500; }

    .feature-list { display: flex; flex-direction: column; gap: 12px; }
    .feature-item {
      display: flex; align-items: center; gap: 12px;
      background: rgba(224,61,0,0.12);
      border: 1px solid rgba(224,61,0,0.2);
      border-radius: 12px; padding: 12px 16px;
      font-size: 14px; color: #2E0800; font-weight: 600;
    }
    .feat-icon { font-size: 18px; }

    .form-side { width: 520px; display: flex; align-items: center; justify-content: center; padding: 48px 44px; background: #fff; box-shadow: -24px 0 80px rgba(224,61,0,0.12); }
    .form-card { width: 100%; max-width: 420px; }
    .form-header { margin-bottom: 28px; }
    .form-header h2 { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800; color: #1C0800; margin-bottom: 4px; }
    .form-header p { font-size: 14px; color: #6B4030; font-weight: 500; }

    .fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 4px; }
    .field-group { margin-bottom: 4px; }
    .field-label { display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 800; color: #2E0E00; margin-bottom: 7px; letter-spacing: 0.8px; text-transform: uppercase; }
    .field-label svg { color: #E03D00; flex-shrink: 0; }

    .field-input { width: 100%; padding: 12px 14px; border: 2px solid #EDCFBD; border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #1C0800; background: #FFF8F2; transition: border-color .2s, box-shadow .2s; outline: none; }
    .field-input:focus { border-color: #E03D00; background: #fff; box-shadow: 0 0 0 4px rgba(224,61,0,0.1); }
    .field-input.field-error { border-color: #b71c1c; box-shadow: 0 0 0 3px rgba(183,28,28,0.08); }
    .field-input.field-valid { border-color: #2e7d32; box-shadow: 0 0 0 3px rgba(46,125,50,0.08); }
    .field-input::placeholder { color: #C09880; font-size: 13px; }

    .input-pw-wrap { position: relative; }
    .input-pw-wrap .field-input { padding-right: 38px; }
    .toggle-pw { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #C09880; padding: 2px; transition: color .2s; }
    .toggle-pw:hover { color: #E03D00; }

    .error-msg { display: block; font-size: 11px; color: #b71c1c; margin-top: 4px; font-weight: 600; }

    .strength-wrapper { display: flex; align-items: center; gap: 10px; margin: 10px 0 16px; }
    .strength-bar { flex: 1; height: 4px; background: #EDCFBD; border-radius: 2px; overflow: hidden; }
    .strength-fill { height: 100%; border-radius: 2px; transition: width .3s, background .3s; }
    .s-fraca { background: #b71c1c; color: #b71c1c; }
    .s-média { background: #FF6200; color: #FF6200; }
    .s-forte { background: #2e7d32; color: #2e7d32; }
    .strength-text { font-size: 11px; font-weight: 800; min-width: 40px; text-align: right; }

    .btn-submit { width: 100%; padding: 15px; margin-top: 18px; background: linear-gradient(135deg, #E03D00 0%, #FF4500 40%, #FF6200 70%, #FF8C00 100%); color: #fff; border: none; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: 0.5px; transition: transform .15s, box-shadow .15s, opacity .15s; box-shadow: 0 8px 28px rgba(224,61,0,0.5); }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(224,61,0,0.6); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner-text { display: flex; align-items: center; justify-content: center; gap: 10px; }
    .spinner { display: inline-block; width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .form-footer { display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 22px; font-size: 14px; color: #6B4030; font-weight: 500; }
    .link-alt { color: #E03D00; text-decoration: none; font-weight: 700; font-family: 'Sora', sans-serif; }
    .link-alt:hover { text-decoration: underline; }

    @media (max-width: 900px) { .brand-side { display: none; } .form-side { width: 100%; box-shadow: none; padding: 40px 20px; } }
    @media (max-width: 480px) { .fields-row { grid-template-columns: 1fr; } }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isLoading = false;
  showPw = false;
  showConfirm = false;

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  get passwordStrength(): number {
    const pw = this.registerForm.get('password')?.value || '';
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score += 33;
    if (pw.length >= 10) score += 34;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score += 33;
    return Math.min(score, 100);
  }

  get strengthLabel(): string {
    const s = this.passwordStrength;
    if (s < 40) return 'fraca';
    if (s < 70) return 'média';
    return 'forte';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { username, email, password } = this.registerForm.value;
      this.authService.register(username, email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Conta criada com sucesso! Faça login para continuar.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err?.error?.error || 'Erro ao criar conta', 'Erro');
        }
      });
    }
  }
}