/**
 * HC IV - Configuração Centralizada do Firebase e Lógica de Negócio
 * Arquivo: config.js
 * Compatível com Vercel + GitHub + Firebase
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
  getFirestore, collection, getDocs, doc, setDoc, addDoc, 
  deleteDoc, getDoc, query, where, orderBy, updateDoc, 
  writeBatch, Timestamp, limit 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// CONFIGURAÇÃO DO FIREBASE
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

// NOMES DAS COLEÇÕES
export const COLS = {
  PACIENTES: 'pacientes',
  PROFISSIONAIS: 'profissionais',
  MEDICAMENTOS: 'medicamentos_padrao',
  RECEITAS: 'receitas',
  SETORES: 'setores_hospitais', // Nova coleção para Setores/Hospitais
  POSOLOGIAS: 'posologias_padrao', // Nova coleção para Posologias Personalizadas
  ICONES: 'icones_personalizados' // Coleção para ícones/imagem customizados se precisar
};

// ========== UTILITÁRIOS GERAIS ==========

// Converte qualquer texto para MAIÚSCULAS e sanitiza
export function toUpperSafe(text) {
  if (!text) return '';
  return text.toString().toUpperCase().trim();
}

// Formata data para exibição: DD/MM/YYYY
export function formatDate(dateVal) {
  if (!dateVal) return '-';
  const d = dateVal instanceof Timestamp ? dateVal.toDate() : new Date(dateVal);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Calcula idade baseada na data de nascimento
export function calcularIdade(nascString) {
  if (!nascString) return '';
  const nasc = new Date(nascString);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade > 0 ? `${idade} ANOS` : '';
}

// Notificação visual (Toast)
export function notificar(msg, tipo = 'info') {
  const existing = document.querySelectorAll('.toast');
  existing.forEach(e => e.remove());

  const div = document.createElement('div');
  div.className = `toast toast-${tipo}`;
  div.innerHTML = `
    <span class="toast-msg">${msg}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

// ========== FUNÇÕES DE BANCO DE DADOS (GENÉRICAS) ==========

// Busca documentos com debounce implícito na chamada
export async function fetchAll(colName, sortField = 'nome', sortOrder = 'asc') {
  try {
    const q = query(collection(db, colName), orderBy(sortField, sortOrder));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(`Erro ao buscar ${colName}:`, err);
    notificar(`Erro ao carregar ${colName}`, 'error');
    return [];
  }
}

// Busca paciente por nome ou prontuário (Otimizado para busca parcial)
export async function buscarPacientes(termo) {
  if (!termo || termo.length < 2) return [];
  try {
    // Como Firestore não tem LIKE nativo, trazemos um conjunto e filtramos no cliente
    // Para produção com muitos dados, usar Algolia ou ElasticSearch
    const snap = await getDocs(collection(db, COLS.PACIENTES));
    const t = toUpperSafe(termo);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => 
        toUpperSafe(p.nome)?.includes(t) || 
        p.prontuario?.toString().includes(t)
      )
      .slice(0, 15);
  } catch (e) { return []; }
}

// Salvar ou Atualizar Documento Genérico
export async function salvarDoc(colName, id, data) {
  try {
    // Garante que campos de texto fiquem maiúsculos
    const cleanData = {};
    for (const [key, value] of Object.entries(data)) {
      cleanData[key] = typeof value === 'string' ? toUpperSafe(value) : value;
      if (key === 'atualizado_em') cleanData[key] = new Date().toISOString();
    }
    
    if (id && id !== 'NOVO') {
      await updateDoc(doc(db, colName, id), cleanData);
      return { id, success: true, mode: 'update' };
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

// Excluir Documento (Soft Delete ou Hard Delete)
export async function excluirDoc(colName, id) {
  try {
    await deleteDoc(doc(db, colName, id));
    return true;
  } catch (e) {
    notificar('Erro ao excluir', 'error');
    return false;
  }
}

// Função específica para carregar dados iniciais do Admin sem travar o Dashboard
export async function carregarDadosAdmin() {
  const [meds, profs, pacs, receitas, setores] = await Promise.all([
    fetchAll(COLS.MEDICAMENTOS, 'nome'),
    fetchAll(COLS.PROFISSIONAIS, 'nome'),
    fetchAll(COLS.PACIENTES, 'nome'),
    fetchAll(COLS.RECEITAS, 'data_criacao', 'desc'), // Ordenado do mais recente
    fetchAll(COLS.SETORES, 'nome')
  ]);
  return { meds, profs, pacs, receitas, setores };
}

// Recupera uma receita específica para edição ou visualização
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

// Exportar para escopo global para facilitar uso nos HTMLs
if (typeof window !== 'undefined') {
  window.DB_UTILS = {
    db, COLS, fetchAll, buscarPacientes, salvarDoc, excluirDoc,
    carregarDadosAdmin, getReceita, formatDate, calcularIdade, notificar, toUpperSafe
  };
}
