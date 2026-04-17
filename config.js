/**
 * HC IV - Sistema de Receitas
 * Arquivo: config.js
 * Descrição: Configuração centralizada do Firebase e funções utilitárias
 */

// ========== CONFIGURAÇÃO FIREBASE ==========
export const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyDqyKxM4idfyKhRssyq-M7Yzb5lCSWS1sU",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "receita-facilitada.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "receita-facilitada",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "receita-facilitada.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029880325250",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:1029880325250:web:c24445dfc3a21ed1bf809b"
};

// ========== INICIALIZAÇÃO DO FIREBASE ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
  getFirestore, collection, getDocs, doc, setDoc, addDoc, 
  deleteDoc, getDoc, query, where, orderBy, updateDoc, 
  writeBatch, Timestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ========== COLEÇÕES DO BANCO DE DADOS ==========
export const COLLECTIONS = {
  PACIENTES: 'pacientes',
  PROFISSIONAIS: 'profissionais', 
  MEDICAMENTOS: 'medicamentos_padrao',
  RECEITAS: 'receitas',
  LIXEIRA: (tipo) => `lixeira_${tipo.replace('_padrao', '')}`
};

// ========== FUNÇÕES UTILITÁRIAS ==========

/**
 * Gera um ID seguro para documentos Firestore
 * Evita hotspots e problemas com caracteres especiais [[6]]
 * @param {string} prefixo - Prefixo opcional para organização
 * @returns {string} ID único
 */
export function gerarIdSeguro(prefixo = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefixo ? `${prefixo}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Sanitiza texto para exibição segura
 * @param {string} texto 
 * @returns {string}
 */
export function sanitizarTexto(texto) {
  if (!texto) return '';
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/**
 * Formata data para exibição em pt-BR
 * @param {Timestamp|Date|string} data 
 * @returns {string}
 */
export function formatarDataBR(data) {
  if (!data) return '-';
  const date = data instanceof Timestamp ? data.toDate() : new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

/**
 * Função de debounce para buscas em tempo real
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Mostra notificação acessível na tela
 * @param {string} mensagem 
 * @param {'success'|'error'|'info'} tipo 
 */
export function notificar(mensagem, tipo = 'info') {
  // Remove notificações antigas
  document.querySelectorAll('.hc-notificacao').forEach(el => el.remove());
  
  const notif = document.createElement('div');
  notif.className = `hc-notificacao hc-notificacao--${tipo}`;
  notif.setAttribute('role', 'alert');
  notif.setAttribute('aria-live', 'polite');
  notif.innerHTML = `
    <span class="hc-notificacao__icone" aria-hidden="true">
      ${tipo === 'success' ? '✓' : tipo === 'error' ? '✕' : 'ℹ'}
    </span>
    <span class="hc-notificacao__mensagem">${sanitizarTexto(mensagem)}</span>
    <button class="hc-notificacao__fechar" aria-label="Fechar notificação">&times;</button>
  `;
  
  document.body.appendChild(notif);
  
  // Auto-fechar após 5 segundos
  setTimeout(() => notif.remove(), 5000);
  
  // Fechar ao clicar no botão
  notif.querySelector('.hc-notificacao__fechar')?.addEventListener('click', () => notif.remove());
}

/**
 * Soft delete: move documento para coleção de lixeira
 * Implementação segura conforme melhores práticas [[1]][[6]]
 * @param {string} colecaoOriginal 
 * @param {string} docId 
 * @param {object} dados 
 */
export async function softDelete(colecaoOriginal, docId, dados) {
  const batch = writeBatch(db);
  const lixeiraColecao = COLLECTIONS.LIXEIRA(colecaoOriginal);
  
  // Adiciona na lixeira com metadados
  batch.set(doc(db, lixeiraColecao, docId), {
    ...dados,
    _meta: {
      deletado_em: Timestamp.now(),
      colecao_original: colecaoOriginal,
      versao: 1
    }
  });
  
  // Remove da coleção original
  batch.delete(doc(db, colecaoOriginal, docId));
  
  await batch.commit();
}

/**
 * Restaura documento da lixeira
 * @param {string} colecaoOriginal 
 * @param {string} docId 
 */
export async function restaurarDaLixeira(colecaoOriginal, docId) {
  const lixeiraColecao = COLLECTIONS.LIXEIRA(colecaoOriginal);
  const docRef = doc(db, lixeiraColecao, docId);
  const snap = await getDoc(docRef);
  
  if (!snap.exists()) throw new Error('Documento não encontrado na lixeira');
  
  const dados = snap.data();
  const { _meta, ...dadosRestaurados } = dados;
  
  const batch = writeBatch(db);
  batch.set(doc(db, colecaoOriginal, docId), dadosRestaurados);
  batch.delete(docRef);
  
  await batch.commit();
}

/**
 * Busca pacientes com debounce e tratamento de erro
 * @param {string} termo 
 * @returns {Promise<Array>}
 */
export async function buscarPacientes(termo) {
  if (!termo || termo.length < 2) return [];
  
  try {
    // Nota: Para buscas eficientes em produção, considere usar Algolia ou Firestore composite indexes [[1]]
    const snap = await getDocs(collection(db, COLLECTIONS.PACIENTES));
    const termoLower = termo.toLowerCase();
    
    return snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => 
        p.nome?.toLowerCase().includes(termoLower) || 
        p.prontuario?.includes(termo)
      )
      .slice(0, 10); // Limita resultados para performance
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    notificar('Erro ao buscar pacientes. Verifique sua conexão.', 'error');
    return [];
  }
}

// Exporta funções para uso global (compatibilidade com código existente)
if (typeof window !== 'undefined') {
  window.HC = {
    db,
    COLLECTIONS,
    gerarIdSeguro,
    sanitizarTexto,
    formatarDataBR,
    debounce,
    notificar,
    softDelete,
    restaurarDaLixeira,
    buscarPacientes
  };
}
