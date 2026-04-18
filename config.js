/**
 * HC IV - Configuração Centralizada do Firebase
 * Arquivo: config.js
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
  getFirestore, collection, getDocs, doc, setDoc, addDoc, 
  deleteDoc, getDoc, query, where, orderBy, updateDoc, 
  writeBatch, Timestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqyKxM4idfyKhRssyq-M7Yzb5lCSWS1sU",
  authDomain: "receita-facilitada.firebaseapp.com",
  projectId: "receita-facilitada",
  storageBucket: "receita-facilitada.firebasestorage.app",
  messagingSenderId: "1029880325250",
  appId: "1:1029880325250:web:c24445dfc3a21ed1bf809b"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const COLS = {
  PACIENTES: 'pacientes',
  PROFISSIONAIS: 'profissionais',
  MEDICAMENTOS: 'medicamentos_padrao',
  RECEITAS: 'receitas',
  SETORES: 'setores_hospitais',
  POSOLOGIAS: 'posologias_padrao'
};

// ========== UTILITÁRIOS ==========
export function toUpperSafe(text) {
  if (!text) return '';
  return text.toString().toUpperCase().trim();
}

export function formatDate(dateVal) {
  if (!dateVal) return '-';
  const d = dateVal instanceof Timestamp ? dateVal.toDate() : new Date(dateVal);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function calcularIdade(nascString) {
  if (!nascString) return '';
  const nasc = new Date(nascString);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade > 0 ? `${idade} ANOS` : '';
}

export function notificar(msg, tipo = 'info') {
  const existing = document.querySelectorAll('.toast');
  existing.forEach(e => e.remove());
  const div = document.createElement('div');
  div.className = `toast toast-${tipo}`;
  div.innerHTML = `<span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

// ========== BANCO DE DADOS SEGURO ==========

export async function fetchAll(colName, sortField = null, sortOrder = 'asc') {
  try {
    const snap = await getDocs(collection(db, colName));
    let docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    if (sortField) {
      docs.sort((a, b) => {
        const valA = a[sortField] || '';
        const valB = b[sortField] || '';
        return sortOrder === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
    }
    return docs;
  } catch (err) {
    console.error(`Erro ao buscar ${colName}:`, err);
    return [];
  }
}

export async function buscarPacientes(termo) {
  if (!termo || termo.length < 2) return [];
  try {
    const snap = await getDocs(collection(db, COLS.PACIENTES));
    const t = toUpperSafe(termo);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => toUpperSafe(p.nome)?.includes(t) || String(p.prontuario || '').includes(termo))
      .slice(0, 15);
  } catch (e) { return []; }
}

// CORREÇÃO: Usa setDoc com merge para criar ou atualizar sem erro
export async function salvarDoc(colName, id, data) {
  try {
    const cleanData = {};
    for (const [key, value] of Object.entries(data)) {
      cleanData[key] = typeof value === 'string' ? toUpperSafe(value) : value;
      if (key === 'atualizado_em') cleanData[key] = new Date().toISOString();
    }
    
    if (id && id !== 'NOVO') {
      // Cria o documento se não existir, ou atualiza se existir
      await setDoc(doc(db, colName, id), cleanData, { merge: true });
      return { id, success: true, mode: 'upsert' };
    } else {
      cleanData.criado_em = new Date().toISOString();
      const ref = await addDoc(collection(db, colName), cleanData);
      return { id: ref.id, success: true, mode: 'create' };
    }
  } catch (e) {
    console.error(e);
    notificar('Erro ao salvar: ' + e.message, 'error');
    return { success: false, error: e.message };
  }
}

export async function excluirDoc(colName, id) {
  try {
    await deleteDoc(doc(db, colName, id));
    return true;
  } catch (e) {
    notificar('Erro ao excluir', 'error');
    return false;
  }
}

export async function getReceita(id) {
  try {
    const ref = doc(db, COLS.RECEITAS, id);
    const snap = await getDoc(ref);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  } catch (e) {
    notificar('Erro ao carregar receita', 'error');
    return null;
  }
}

if (typeof window !== 'undefined') {
  window.DB_UTILS = { db, COLS, fetchAll, buscarPacientes, salvarDoc, excluirDoc, getReceita, formatDate, calcularIdade, notificar, toUpperSafe };
}
