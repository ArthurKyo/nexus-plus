import { newState } from "./defaults";
import type { AppState } from "../types";
export function createDemo(): AppState {
  const s = newState();
  s.demo = true;
  s.consent = {
    accepted: true,
    date: new Date().toISOString(),
    version: "1.0",
  };
  Object.assign(s.business, {
    name: "Barbearia Central",
    owner: "Alex",
    category: "Barbearia",
    description:
      "Cortes modernos e atendimento de qualidade. Um espaço para renovar o visual e se sentir em casa.",
    slogan: "Seu estilo, nossa especialidade.",
    whatsapp: "85999990000",
    phone: "8533330000",
    instagram: "https://www.instagram.com/",
    address: "Rua Exemplo, 100 · Endereço fictício",
    city: "Fortaleza",
    state: "CE",
    cep: "60000000",
    hours: "Segunda a sábado, das 9h às 18h",
    openDays: [1, 2, 3, 4, 5, 6],
    goals: ["Ser encontrado", "Organizar meu catálogo"],
  });
  s.products = [
    {
      id: "demo-p1",
      name: "Pomada modeladora",
      description: "Fixação média, acabamento natural. 80 g.",
      price: 35,
      promoPrice: 29.9,
      category: "Finalização",
      photo: "",
      available: true,
    },
    {
      id: "demo-p2",
      name: "Óleo para barba",
      description: "Cuidado diário para uma barba macia. 30 ml.",
      price: 42,
      promoPrice: null,
      category: "Barba",
      photo: "",
      available: true,
    },
    {
      id: "demo-p3",
      name: "Shampoo refrescante",
      description: "Limpeza e frescor para todos os dias. 250 ml.",
      price: 28,
      promoPrice: null,
      category: "Cabelo",
      photo: "",
      available: true,
    },
  ];
  s.services = [
    {
      id: "demo-s1",
      name: "Corte masculino",
      description: "Corte personalizado com acabamento.",
      price: 35,
      startingPrice: false,
      duration: 30,
      category: "Cabelo",
      available: true,
    },
    {
      id: "demo-s2",
      name: "Barba completa",
      description: "Modelagem e finalização com toalha quente.",
      price: 25,
      startingPrice: false,
      duration: 25,
      category: "Barba",
      available: true,
    },
    {
      id: "demo-s3",
      name: "Corte + barba",
      description: "O cuidado completo em um só atendimento.",
      price: 55,
      startingPrice: false,
      duration: 50,
      category: "Combos",
      available: true,
    },
    {
      id: "demo-s4",
      name: "Corte infantil",
      description: "Atendimento cuidadoso para os pequenos.",
      price: 30,
      startingPrice: true,
      duration: 30,
      category: "Cabelo",
      available: true,
    },
  ];
  s.diagnostics = [
    {
      id: "demo-d1",
      date: new Date().toISOString(),
      answers: {
        instagram: 1,
        whatsapp: 1,
        site: 0,
        location: 0.5,
        catalog: 0,
        maps: 0.5,
        passwords: 0.5,
        twofactor: 0,
        messages: 0.5,
        links: 0,
        backup: 0,
      },
      score: 34,
      level: "Em desenvolvimento",
    },
  ];
  s.baseline = {
    site: false,
    catalog: false,
    social: true,
    security: false,
    qr: false,
  };
  s.diagnosticStep = 0;
  s.onboardingStep = 4;
  s.securityCompleted = ["whatsapp", "passwords"];
  s.published = true;
  return s;
}
