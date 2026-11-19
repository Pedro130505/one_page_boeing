/**
 * BOEING NA UFMG • SCRIPT PRINCIPAL
 * Encontro de Engenharia & Inovação Aeroespacial na Escola de Engenharia da UFMG
 * Contagem regressiva, Tabs, Credenciamento com QR Code, Agenda e Exportação
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initTabs();
  initForms();
  initHeaderAndFloatingCta();
  initTicketModal();
  initAdminExporter();
});

/* ==========================================================================
   1. COUNTDOWN TIMER (24 DE NOVEMBRO ÀS 10:00)
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  if (!daysEl) return;

  const currentYear = new Date().getFullYear();
  // Mês 10 = Novembro no JavaScript Date (janeiro=0 ... novembro=10)
  let targetDate = new Date(currentYear, 10, 24, 10, 0, 0);

  // Se a data já passou no ano atual, projeta para o próximo
  if (targetDate.getTime() - new Date().getTime() < 0) {
    targetDate = new Date(currentYear + 1, 10, 24, 10, 0, 0);
  }

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      const badge = document.querySelector('.countdown-header-tag');
      if (badge) badge.textContent = '🔴 Evento Iniciado / Em Andamento';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. TABS DE SELEÇÃO: ALUNO VS DOCENTE VS COMUNIDADE
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const formPanels = document.querySelectorAll('.form-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      formPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. GESTÃO DO FORMULÁRIO DE ALUNO & GERAÇÃO DE CREDENCIAL
   ========================================================================== */
function initForms() {
  const formAluno = document.getElementById('form-aluno');

  if (formAluno) {
    formAluno.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('aluno-nome').value.trim();
      const curso = document.getElementById('aluno-curso').value.trim();
      const periodo = document.getElementById('aluno-periodo').value;
      const email = document.getElementById('aluno-email').value.trim();

      const regData = {
        tipo: 'Aluno(a) UFMG',
        nome,
        curso: `${curso} • ${periodo}`,
        periodo,
        email,
        id: generateTicketId('ALU'),
        dataRegistro: new Date().toISOString()
      };

      saveRegistration(regData);
      showTicketModal(regData);
    });
  }
}

function generateTicketId(prefix) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `BOEING-UFMG-${prefix}-${randomNum}`;
}

function saveRegistration(data) {
  try {
    const list = JSON.parse(localStorage.getItem('ufmg_hub_boeing_inscricoes') || '[]');
    list.push(data);
    localStorage.setItem('ufmg_hub_boeing_inscricoes', JSON.stringify(list));
  } catch (err) {
    console.error('Erro ao salvar localmente:', err);
  }
}

/* ==========================================================================
   4. MODAL DE CONFIRMAÇÃO & QR CODE
   ========================================================================== */
function initTicketModal() {
  const modal = document.getElementById('ticket-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const btnPrint = document.getElementById('btn-ticket-print');
  const btnCalendar = document.getElementById('btn-ticket-calendar');
  const btnAnother = document.getElementById('btn-another-reg');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => window.print());
  }

  if (btnCalendar) {
    btnCalendar.addEventListener('click', () => openGoogleCalendar());
  }

  if (btnAnother && modal) {
    btnAnother.addEventListener('click', () => {
      modal.classList.remove('active');
      document.querySelectorAll('form').forEach(f => f.reset());
      const inscricaoSec = document.getElementById('inscricao');
      if (inscricaoSec) {
        inscricaoSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

function showTicketModal(data) {
  const modal = document.getElementById('ticket-modal');
  const nameEl = document.getElementById('ticket-display-name');
  const courseEl = document.getElementById('ticket-display-course');
  const typeEl = document.getElementById('ticket-display-type');
  const codeEl = document.getElementById('ticket-display-code');
  const qrContainer = document.getElementById('ticket-qr-area');

  if (!modal) return;

  nameEl.textContent = data.nome;
  courseEl.textContent = data.curso || 'Escola de Engenharia UFMG';
  typeEl.textContent = data.tipo;
  codeEl.textContent = data.id;

  // Limpa área do QR code
  qrContainer.innerHTML = '';

  const qrText = `EVENTO: BOEING NA UFMG | LOCAL: Seminario Bloco de Ligacao | PARTICIPANTE: ${data.nome} | TIPO: ${data.tipo} | ID: ${data.id}`;

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrContainer, {
      text: qrText,
      width: 100,
      height: 100,
      colorDark: '#011a2f',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    // Fallback caso script de QRCode não carregue
    qrContainer.innerHTML = `
      <div style="font-family: monospace; font-size: 10px; color: #011a2f; text-align: center; word-break: break-all; padding: 4px;">
        [QR CODE OFICIAL]<br><strong>${data.id}</strong>
      </div>
    `;
  }

  modal.classList.add('active');
}

/* ==========================================================================
   5. INTEGRAÇÃO COM GOOGLE CALENDAR & .ICS
   ========================================================================== */
function openGoogleCalendar() {
  const title = encodeURIComponent("Boeing na UFMG: Encontro de Engenharia & Inovação Aeroespacial");
  const details = encodeURIComponent(
    "Palestra técnica com engenheiros da Boeing na Escola de Engenharia da UFMG.\n\n" +
    "Palestra 1: Roberto Gonçalves — 'Do Projeto à Aeronave: Desenvolvimento de Estruturas Aeronáuticas na Boeing'\n" +
    "Palestra 2: Paulo Lourenção — 'Engenharia Aeronáutica na Prática: Desafios e Oportunidades de uma Carreira na Indústria'\n\n" +
    "Realização: CEA UFMG, UFMG Hub, Escola de Engenharia e DAEE."
  );
  const location = encodeURIComponent("Seminário do Bloco de Ligação - Escola de Engenharia da UFMG, Av. Pres. Antônio Carlos, 6627, Belo Horizonte - MG");
  
  // 24 de Novembro de 2026, das 10h00 às 12h00 BRT (13h00 às 15h00 UTC)
  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261124T130000Z/20261124T150000Z&details=${details}&location=${location}`;
  window.open(gCalUrl, '_blank');
}

function downloadIcsCalendar() {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UFMG Hub//Boeing na UFMG//PT',
    'BEGIN:VEVENT',
    'UID:boeing-ufmg-2026@ufmghub.com.br',
    'DTSTAMP:20261119T160000Z',
    'DTSTART:20261124T130000Z',
    'DTEND:20261124T150000Z',
    'SUMMARY:Boeing na UFMG: Encontro de Engenharia & Inovação Aeroespacial',
    'DESCRIPTION:Palestras exclusivas com Roberto Gonçalves e Paulo Lourenção sobre desenvolvimento de estruturas aeronáuticas na Boeing e carreira na indústria.',
    'LOCATION:Seminário do Bloco de Ligação, Escola de Engenharia da UFMG, Av. Pres. Antônio Carlos 6627, Belo Horizonte - MG',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'boeing_na_ufmg.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==========================================================================
   6. SCROLL DO HEADER & BOTÃO FLUTUANTE MOBILE
   ========================================================================== */
function initHeaderAndFloatingCta() {
  const header = document.querySelector('.site-header');
  const floatingCta = document.querySelector('.floating-cta-mobile');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (floatingCta) {
      const inscricaoSec = document.getElementById('inscricao');
      const rect = inscricaoSec ? inscricaoSec.getBoundingClientRect() : null;
      const isFormVisible = rect && rect.top < window.innerHeight && rect.bottom > 0;

      if (scrollY > 450 && !isFormVisible) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }
  });

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '76px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = '#ffffff';
      navLinks.style.padding = '20px';
      navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
    });
  }
}

/* ==========================================================================
   7. ADMIN EXPORTER (ATALHO CTRL+SHIFT+H OU CLIQUE NO RODAPÉ)
   ========================================================================== */
function initAdminExporter() {
  const trigger = document.getElementById('admin-export-trigger');

  function exportData() {
    const data = JSON.parse(localStorage.getItem('ufmg_hub_boeing_inscricoes') || '[]');
    if (data.length === 0) {
      alert('Nenhuma inscrição salva localmente neste dispositivo até o momento.');
      return;
    }

    const format = confirm(`Há ${data.length} inscrições salvas no evento Boeing na UFMG.\n\nClique em [OK] para baixar em CSV (Excel) ou [Cancelar] para baixar em JSON.`);
    
    if (format) {
      const headers = ['Tipo', 'ID', 'Nome', 'Email', 'Curso_Depto_Empresa', 'Periodo', 'Data'];
      const rows = data.map(d => [
        `"${d.tipo || ''}"`,
        `"${d.id || ''}"`,
        `"${d.nome || ''}"`,
        `"${d.email || ''}"`,
        `"${(d.curso || '').replace(/"/g, '""')}"`,
        `"${d.periodo || ''}"`,
        `"${d.dataRegistro || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `inscricoes_boeing_ufmg_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', jsonStr);
      link.setAttribute('download', `inscricoes_boeing_ufmg_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      exportData();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
      e.preventDefault();
      exportData();
    }
  });
}
