/**
 * HC IV - Biblioteca de Ícones Visuais Acessíveis
 * Sistema de pictogramas para pacientes com dificuldade de leitura
 */

export const ICONS = {
  // HORÁRIOS DO DIA
  horarios: {
    '06:00': { icone: '🌅', label: 'CAFÉ DA MANHÃ', cor: '#fbbf24', imagem: 'sunrise' },
    '08:00': { icone: '☀️', label: 'MANHÃ', cor: '#f59e0b', imagem: 'morning' },
    '10:00': { icone: '🍎', label: 'LANCHE DA MANHÃ', cor: '#fcd34d', imagem: 'snack' },
    '12:00': { icone: '🍽️', label: 'ALMOÇO', cor: '#f97316', imagem: 'lunch' },
    '14:00': { icone: '☕', label: 'TARDE', cor: '#fb923c', imagem: 'afternoon' },
    '16:00': { icone: '🍪', label: 'LANCHE DA TARDE', cor: '#fdba74', imagem: 'snack' },
    '18:00': { icone: '🌆', label: 'JANTAR', cor: '#ea580c', imagem: 'dinner' },
    '20:00': { icone: '🌙', label: 'NOITE', cor: '#6366f1', imagem: 'evening' },
    '22:00': { icone: '😴', label: 'ANTES DE DORMIR', cor: '#4f46e5', imagem: 'bedtime' },
    '00:00': { icone: '🌃', label: 'MADRUGADA', cor: '#3730a3', imagem: 'midnight' }
  },

  // APRESENTAÇÕES DE MEDICAMENTOS
  apresentacoes: {
    'comprimido': { 
      icone: '💊', 
      label: 'COMPRIMIDO INTEIRO', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>',
      cor: '#3b82f6'
    },
    'meio_comprimido': { 
      icone: '✂️💊', 
      label: 'MEIO COMPRIMIDO', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M7 8v8M17 8v8M3 8h6v8H3zM15 8h6v8h-6z"/></svg>',
      cor: '#8b5cf6'
    },
    'capsula': { 
      icone: '💊', 
      label: 'CÁPSULA', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8 2 4 6 4 10v4c0 4 4 8 8 8s8-4 8-8v-4c0-4-4-8-8-8z"/><line x1="12" y1="2" x2="12" y2="22"/></svg>',
      cor: '#10b981'
    },
    'gotas': { 
      icone: '💧', 
      label: 'GOTAS', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      cor: '#06b6d4'
    },
    'liquido': { 
      icone: '🥄', 
      label: 'LÍQUIDO (ML)', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2h8v20H8zM4 6h16M4 10h16M4 14h16"/></svg>',
      cor: '#14b8a6'
    },
    'pomada': { 
      icone: '🧴', 
      label: 'POMADA/CREME', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2h12v20H6zM8 6h8M8 10h8"/></svg>',
      cor: '#f472b6'
    }
  },

  // SINTOMAS/POSOLOGIAS
  sintomas: {
    'dor': { 
      icone: '🤕', 
      label: 'DOR', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
      cor: '#ef4444'
    },
    'febre': { 
      icone: '🌡️', 
      label: 'FEBRE', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>',
      cor: '#f97316'
    },
    'nausea': { 
      icone: '🤢', 
      label: 'NÁUSEA', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
      cor: '#eab308'
    },
    'vomito': { 
      icone: '🤮', 
      label: 'VÔMITO', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>',
      cor: '#dc2626'
    },
    'colica': { 
      icone: '😖', 
      label: 'CÓLICA', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/><path d="M7 17s2-2 5-2 5 2 5 2"/></svg>',
      cor: '#f59e0b'
    },
    'cainbra': { 
      icone: '🦵', 
      label: 'CAIMBRA', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4"/></svg>',
      cor: '#8b5cf6'
    },
    'infeccao': { 
      icone: '🦠', 
      label: 'INFECÇÃO', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
      cor: '#10b981'
    },
    'alergia': { 
      icone: '🤧', 
      label: 'ALERGIA', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
      cor: '#ec4899'
    },
    'pressao': { 
      icone: '❤️', 
      label: 'PRESSÃO ALTA', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      cor: '#ef4444'
    },
    'diabetes': { 
      icone: '🩸', 
      label: 'DIABETES', 
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><path d="M12 8v8M8 12h8"/></svg>',
      cor: '#3b82f6'
    }
  },

  // AÇÕES/HÁBITOS
  acoes: {
    'antes_refeicao': { icone: '⏰', label: 'ANTES DA REFEIÇÃO', cor: '#6366f1' },
    'durante_refeicao': { icone: '🍴', label: 'DURANTE A REFEIÇÃO', cor: '#8b5cf6' },
    'apos_refeicao': { icone: '✅', label: 'APÓS A REFEIÇÃO', cor: '#10b981' },
    'jejum': { icone: '🌙', label: 'EM JEJUM', cor: '#f59e0b' },
    'deitar': { icone: '🛏️', label: 'AO DEITAR', cor: '#6366f1' },
    'acordar': { icone: '⏰', label: 'AO ACORDAR', cor: '#fbbf24' }
  }
};

// Função para gerar SVG inline
export function getIconSVG(categoria, chave) {
  const item = ICONS[categoria]?.[chave];
  if (!item) return '';
  return item.svg || `<span style="font-size: 1.5em;">${item.icone}</span>`;
}

// Função para obter cor
export function getIconColor(categoria, chave) {
  return ICONS[categoria]?.[chave]?.cor || '#6b7280';
}

// Função para obter label
export function getIconLabel(categoria, chave) {
  return ICONS[categoria]?.[chave]?.label || chave;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.ICONS = ICONS;
  window.getIconSVG = getIconSVG;
  window.getIconColor = getIconColor;
  window.getIconLabel = getIconLabel;
}
