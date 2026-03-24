import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { RankingEntry } from '../../models/game.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-shell">

      <nav class="navbar">
        <div class="nav-inner">
          <div class="nav-brand">
            <button class="btn-back" (click)="goBack()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <span class="logo-box">itaú</span>
            <span class="nav-title">Ranking Global</span>
          </div>
          <div class="nav-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Melhores jogadores
          </div>
        </div>
      </nav>

      <div class="loading-wrap" *ngIf="isLoading">
        <div class="spinner-lg"></div>
        <p>Carregando ranking...</p>
      </div>

      <div class="main-content" *ngIf="!isLoading">

        <div class="table-card">
          <div class="table-card-header">
            <div>
              <h2>Classificação completa</h2>
              <p>Menos tentativas primeiro, depois menor tempo</p>
            </div>
          </div>

          <div class="table-wrap" *ngIf="rankingData.length > 0">
            <div class="t-head">
              <div class="c-pos">Pos.</div>
              <div class="c-player">Jogador</div>
              <div class="c-att">Tentativas</div>
              <div class="c-time">Tempo</div>
              <div class="c-date">Data</div>
            </div>

            <div
              *ngFor="let entry of rankingData"
              class="t-row"
              [class.row-you]="entry.username === currentUsername"
            >
              <div class="c-pos">
                <span class="pos-badge"
                  [class.gold]="entry.position === 1"
                  [class.silver]="entry.position === 2"
                  [class.bronze]="entry.position === 3">
                  {{ entry.position }}º
                </span>
              </div>

              <div class="c-player">
                <div class="player-av" [class.av-you]="entry.username === currentUsername">
                  {{ entry.username.charAt(0).toUpperCase() }}
                </div>
                <span class="player-name">{{ entry.username }}</span>
                <span class="you-chip" *ngIf="entry.username === currentUsername">Você</span>
              </div>

              <div class="c-att">
                <span class="att-num">{{ entry.attempts }}</span>
                <span class="att-label">tentativas</span>
              </div>

              <div class="c-time">
                <span class="time-val">{{ entry.duration_seconds }}s</span>
              </div>

              <div class="c-date">{{ entry.finished_at | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
          </div>

          <div class="no-data" *ngIf="rankingData.length === 0">
            <span>🎮</span>
            <p>Nenhum jogador venceu ainda.</p>
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
    .nav-inner { max-width: 900px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-brand { display: flex; align-items: center; gap: 12px; }
    .btn-back { background: none; border: 1.5px solid #EDCFBD; border-radius: 8px; padding: 7px 10px; cursor: pointer; color: #6B4030; display: flex; align-items: center; transition: all .15s; }
    .btn-back:hover { border-color: #E03D00; color: #E03D00; }
    .logo-box { background: #E03D00; color: #fff; font-family: 'Sora', sans-serif; font-weight: 800; font-size: 15px; padding: 5px 12px; border-radius: 7px; }
    .nav-title { font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 700; color: #1C0800; }
    .nav-badge { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #E03D00; border: 1.5px solid #EDCFBD; border-radius: 8px; padding: 6px 14px; }

    /* LOADING */
    .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; gap: 14px; color: #6B4030; font-weight: 600; }
    .spinner-lg { width: 36px; height: 36px; border: 3px solid #EDCFBD; border-top-color: #E03D00; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* MAIN */
    .main-content { max-width: 900px; margin: 0 auto; padding: 32px 24px; }

    /* TABLE CARD */
    .table-card { background: #fff; border-radius: 16px; border: 1.5px solid #EDCFBD; overflow: hidden; }

    .table-card-header { padding: 22px 28px 0; }
    .table-card-header h2 { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 800; color: #1C0800; margin-bottom: 4px; }
    .table-card-header p { font-size: 13px; color: #9B6040; margin-bottom: 20px; }

    /* TABLE */
    .t-head {
      display: flex; align-items: center;
      padding: 11px 28px; background: #E03D00;
    }
    .t-head > div { font-family: 'Sora', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 0.9px; text-transform: uppercase; color: rgba(255,255,255,0.8); }

    .t-row {
      display: flex; align-items: center;
      padding: 14px 28px; border-bottom: 1px solid #FFF0E4;
      transition: background .12s;
    }
    .t-row:last-child { border-bottom: none; }
    .t-row:hover { background: #FFF8F4; }
    .t-row.row-you { background: #FFF5EE; }

    .c-pos  { width: 64px; }
    .c-player { flex: 1; display: flex; align-items: center; gap: 10px; }
    .c-att  { width: 140px; }
    .c-time { width: 90px; }
    .c-date { width: 160px; font-size: 13px; color: #9B6040; }

    .pos-badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 38px; padding: 4px 10px; border-radius: 20px;
      font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 800;
      background: #F0D8C8; color: #6B4030;
    }
    .pos-badge.gold   { background: #FFC107; color: #fff; }
    .pos-badge.silver { background: #90A4AE; color: #fff; }
    .pos-badge.bronze { background: #A1887F; color: #fff; }

    .player-av {
      width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
      background: #EDCFBD; color: #4A1E00;
      font-family: 'Sora', sans-serif; font-weight: 800; font-size: 13px;
      display: flex; align-items: center; justify-content: center;
    }
    .player-av.av-you { background: #E03D00; color: #fff; }

    .player-name { font-size: 14px; font-weight: 600; color: #1C0800; }
    .you-chip { background: #FFF0E4; color: #E03D00; border: 1px solid #EDCFBD; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }

    .att-num { font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 800; color: #E03D00; }
    .att-label { font-size: 12px; color: #9B6040; margin-left: 4px; }
    .time-val { font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #1C0800; }

    .no-data { padding: 56px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .no-data span { font-size: 40px; }
    .no-data p { font-size: 15px; color: #6B4030; font-weight: 600; }

    @media (max-width: 640px) {
      .c-date { display: none; }
      .main-content { padding: 20px 12px; }
    }
  `]
})
export class RankingComponent implements OnInit {
  private gameService = inject(GameService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  rankingData: RankingEntry[] = [];
  currentUsername = this.authService.currentUserValue?.username;
  isLoading = true;

  ngOnInit() {
    this.gameService.getRanking().subscribe({
      next: (data) => { this.rankingData = data; this.isLoading = false; },
      error: () => { this.toastr.error('Erro ao carregar ranking', 'Erro'); this.isLoading = false; }
    });
  }

  goBack() { this.router.navigate(['/dashboard']); }
}