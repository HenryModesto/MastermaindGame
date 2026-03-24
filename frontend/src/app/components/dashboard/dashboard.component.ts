import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-shell">

      <!-- NAVBAR -->
      <nav class="navbar">
        <div class="nav-inner">
          <div class="nav-brand">
            <span class="logo-box">itaú</span>
            <span class="nav-title">Mastermind</span>
          </div>
          <div class="nav-right">
            <div class="nav-user">
              <div class="avatar">{{ username.charAt(0).toUpperCase() }}</div>
              <div class="user-info">
                <span class="user-name">{{ username }}</span>
                <span class="user-role">Jogador</span>
              </div>
            </div>
            <button class="btn-logout" (click)="logout()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <!-- HERO -->
      <div class="hero">
        <div class="hero-inner">
          <div class="hero-text">
            <h1>Pronto para<br>o próximo desafio?</h1>
            <p>Desvende o código secreto antes que suas tentativas acabem.</p>
          </div>
          <button class="btn-play" (click)="startNewGame()" [disabled]="isStarting">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>{{ isStarting ? 'Criando...' : 'Nova Partida' }}</span>
          </button>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="main-content">

        <!-- Ações -->
        <section class="section">
          <h2 class="section-title">O que deseja fazer?</h2>
          <div class="action-grid">

            <div class="action-card primary" (click)="startNewGame()">
              <div class="action-icon orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div class="action-text">
                <h3>Nova Partida</h3>
                <p>Inicie um novo desafio de código secreto. Você tem 10 tentativas!</p>
              </div>
              <div class="action-arrow">→</div>
            </div>

            <div class="action-card" (click)="goToRanking()">
              <div class="action-icon gold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div class="action-text">
                <h3>Ranking Global</h3>
                <p>Veja os melhores jogadores e descubra onde você está no placar.</p>
              </div>
              <div class="action-arrow orange-arrow">→</div>
            </div>

          </div>
        </section>

        <!-- Como jogar -->
        <section class="section">
          <h2 class="section-title">Como jogar?</h2>
          <div class="how-card">
            <div class="how-step" *ngFor="let step of steps; let last = last">
              <div class="step-num">{{ step.num }}</div>
              <div class="step-body">
                <h4>{{ step.title }}</h4>
                <p>{{ step.desc }}</p>
              </div>
              <span class="step-arrow" *ngIf="!last">→</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .app-shell { min-height: 100vh; background: #FFF0E4; font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; }

    /* NAVBAR */
    .navbar { background: #fff; border-bottom: 2px solid #EDCFBD; position: sticky; top: 0; z-index: 100; }
    .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 28px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-brand { display: flex; align-items: center; gap: 12px; }
    .logo-box { background: #E03D00; color: #fff; font-family: 'Sora', sans-serif; font-weight: 800; font-size: 15px; padding: 5px 12px; border-radius: 7px; }
    .logo-box.small { font-size: 12px; padding: 4px 10px; }
    .nav-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #1C0800; }

    .nav-right { display: flex; align-items: center; gap: 16px; }
    .nav-user { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: #E03D00; color: #fff;
      font-family: 'Sora', sans-serif; font-weight: 800; font-size: 15px;
      display: flex; align-items: center; justify-content: center;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 14px; font-weight: 600; color: #1C0800; line-height: 1.2; }
    .user-role { font-size: 11px; color: #9B6040; }

    .btn-logout {
      display: flex; align-items: center; gap: 6px;
      background: none; border: 1.5px solid #EDCFBD; border-radius: 8px;
      padding: 7px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px;
      font-weight: 600; color: #6B4030; cursor: pointer; transition: all .15s;
    }
    .btn-logout:hover { border-color: #E03D00; color: #E03D00; }

    /* HERO */
    .hero { background: #E03D00; padding: 52px 28px; }
    .hero-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 32px; }
    .hero-text h1 { font-family: 'Sora', sans-serif; font-size: 44px; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 12px; }
    .hero-text p { font-size: 15px; color: rgba(255,255,255,0.8); font-weight: 500; }

    .btn-play {
      flex-shrink: 0; display: flex; align-items: center; gap: 10px;
      background: #fff; color: #E03D00; border: none; border-radius: 12px;
      padding: 16px 32px; font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 800;
      cursor: pointer; white-space: nowrap; transition: background .15s, opacity .15s;
    }
    .btn-play:hover:not(:disabled) { background: #FFF5F0; }
    .btn-play:disabled { opacity: 0.7; cursor: not-allowed; }

    /* MAIN */
    .main-content { max-width: 1100px; margin: 0 auto; padding: 36px 28px; flex: 1; width: 100%; }

    .section { margin-bottom: 36px; }
    .section-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 800; color: #1C0800; margin-bottom: 16px; }

    /* ACTION CARDS */
    .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    .action-card {
      position: relative;
      background: #fff; border-radius: 14px; border: 1.5px solid #EDCFBD;
      padding: 22px 20px; display: flex; align-items: center; gap: 16px;
      cursor: pointer; transition: border-color .15s, box-shadow .15s;
    }
    .action-card:hover { border-color: #E03D00; box-shadow: 0 4px 16px rgba(224,61,0,0.1); }
    .action-card.primary { background: #E03D00; border-color: #E03D00; }
    .action-card.primary:hover { box-shadow: 0 4px 20px rgba(224,61,0,0.35); }

    .action-icon {
      width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .action-icon.orange { background: rgba(255,255,255,0.2); color: #fff; }
    .action-icon.gold { background: #FFF3CD; color: #E09000; }

    .action-text { flex: 1; }
    .action-text h3 { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 4px; }
    .action-card.primary .action-text h3 { color: #fff; }
    .action-card:not(.primary) .action-text h3 { color: #1C0800; }
    .action-text p { font-size: 13px; line-height: 1.5; }
    .action-card.primary .action-text p { color: rgba(255,255,255,0.8); }
    .action-card:not(.primary) .action-text p { color: #6B4030; }

    .action-tag {
      position: absolute; top: 12px; right: 12px;
      background: rgba(255,255,255,0.2); color: #fff;
      font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px;
      letter-spacing: 0.5px;
    }
    .action-arrow { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.6); flex-shrink: 0; }
    .action-arrow.orange-arrow { color: #E03D00; }

    /* HOW TO PLAY */
    .how-card {
      background: #fff; border-radius: 14px; border: 1.5px solid #EDCFBD;
      padding: 24px 28px; display: flex; align-items: flex-start; gap: 0;
    }
    .how-step { flex: 1; display: flex; gap: 12px; align-items: flex-start; }
    .step-num {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      background: #E03D00; color: #fff;
      font-family: 'Sora', sans-serif; font-weight: 800; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .step-body h4 { font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700; color: #1C0800; margin-bottom: 4px; }
    .step-body p { font-size: 12px; color: #6B4030; line-height: 1.5; }
    .step-arrow { color: #E03D00; font-size: 18px; font-weight: 700; padding: 4px 12px; opacity: 0.4; align-self: center; flex-shrink: 0; }

    @media (max-width: 768px) {
      .hero-inner { flex-direction: column; }
      .hero-text h1 { font-size: 32px; }
      .action-grid { grid-template-columns: 1fr; }
      .how-card { flex-direction: column; gap: 16px; }
      .step-arrow { display: none; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private gameService = inject(GameService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  username = this.authService.currentUserValue?.username || '';
  isStarting = false;
  year = new Date().getFullYear();

  steps = [
    { num: 1, title: 'Código Secreto', desc: 'O sistema gera uma sequência de 4 números aleatórios e secreto.' },
    { num: 2, title: 'Tente Adivinhar', desc: 'Você tem até 10 tentativas para descobrir a combinação certa.' },
    { num: 3, title: 'Dicas do Jogo', desc: 'Pinos pretos = cor e posição certa. Pinos brancos = cor certa, posição errada.' },
    { num: 4, title: 'Vença!', desc: 'Quanto menos tentativas usar, maior sua pontuação no ranking.' }
  ];

  ngOnInit() {}

  logout() { this.authService.logout(); }

  startNewGame() {
    if (this.isStarting) return;
    this.isStarting = true;
    this.gameService.createGame().subscribe({
      next: (res) => { this.router.navigate(['/game', res.game_id]); },
      error: () => { this.isStarting = false; this.toastr.error('Erro ao criar nova partida. Tente novamente.', 'Erro'); }
    });
  }

  goToRanking() { this.router.navigate(['/ranking']); }
}