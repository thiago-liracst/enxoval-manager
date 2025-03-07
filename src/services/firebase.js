// src/services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

// Substitua com as suas configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBLf1odLX8b9fQEHYKQRT2E7d9B5yIauhk",
  authDomain: "enxoval-manager.firebaseapp.com",
  projectId: "enxoval-manager",
  storageBucket: "enxoval-manager.firebasestorage.app",
  messagingSenderId: "116142058711",
  appId: "1:116142058711:web:59a1dfa387fab29c055492",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funções para manipular áreas
export const getAreas = async () => {
  const areasCollection = collection(db, "areas");
  const areaSnapshot = await getDocs(areasCollection);
  return areaSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addArea = async (areaData) => {
  return await addDoc(collection(db, "areas"), {
    ...areaData,
    dataCriacao: new Date(),
  });
};

// Funções para manipular itens
export const getItemsByArea = async (areaId) => {
  const itemsQuery = query(
    collection(db, "items"),
    where("area", "==", areaId)
  );
  const itemsSnapshot = await getDocs(itemsQuery);
  return itemsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addItem = async (itemData) => {
  return await addDoc(collection(db, "items"), {
    ...itemData,
    opcoesCount: 0,
    dataCriacao: new Date(),
  });
};

// Funções para manipular opções de itens
export const getOptionsByItem = async (itemId) => {
  const optionsQuery = query(
    collection(db, "opcoes"),
    where("itemId", "==", itemId)
  );
  const optionsSnapshot = await getDocs(optionsQuery);
  return optionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addOption = async (optionData) => {
  const optionRef = await addDoc(collection(db, "opcoes"), {
    ...optionData,
    status: "pendente",
    dataCadastro: new Date(),
  });

  // Atualiza o contador de opções no item
  const itemRef = doc(db, "items", optionData.itemId);
  await updateDoc(itemRef, {
    opcoesCount: (optionData.opcoesCount || 0) + 1,
  });

  return optionRef;
};

export const updateOptionStatus = async (optionId, status) => {
  const optionRef = doc(db, "opcoes", optionId);
  await updateDoc(optionRef, {
    status: status,
    dataAtualizacao: new Date(),
  });
};

export const cleanDuplicateAreas = async () => {
  const areasCollection = collection(db, "areas");
  const areaSnapshot = await getDocs(areasCollection);

  const areasByName = {};

  // Agrupar áreas por nome
  areaSnapshot.docs.forEach((doc) => {
    const areaName = doc.data().nome;
    if (!areasByName[areaName]) {
      areasByName[areaName] = [];
    }
    areasByName[areaName].push({
      id: doc.id,
      ...doc.data(),
    });
  });

  // Para cada grupo de áreas com o mesmo nome, manter apenas a mais antiga
  const deletePromises = [];
  Object.values(areasByName).forEach((areas) => {
    if (areas.length > 1) {
      // Ordenar por data de criação (do mais antigo para o mais recente)
      areas.sort((a, b) => {
        if (!a.dataCriacao || !b.dataCriacao) return 0;
        return a.dataCriacao.toDate() - b.dataCriacao.toDate();
      });

      // Manter o primeiro (mais antigo) e excluir os demais
      for (let i = 1; i < areas.length; i++) {
        const docRef = doc(db, "areas", areas[i].id);
        deletePromises.push(deleteDoc(docRef));
      }
    }
  });

  // Executar todas as exclusões
  if (deletePromises.length > 0) {
    await Promise.all(deletePromises);
    return true; // Retorna true se houve limpeza
  }

  return false; // Retorna false se não havia duplicatas
};

export { db };
