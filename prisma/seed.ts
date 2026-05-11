/// <reference types="node" />
import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Crear Super Admin (Rubén)
  const superAdminPassword = await hash("LuzAzul2026!", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "ruben@luzazul.com" },
    update: {},
    create: {
      email: "ruben@luzazul.com",
      name: "Rubén",
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Super Admin creado: ${superAdmin.name} (${superAdmin.email})`);

  // Crear estados de producto por defecto
  // const defaultStates = [
  //   "Vencido",
  //   "Roto",
  //   "Dañado",
  //   "Apto para donación",
  //   "Contaminado",
  //   "Defectuoso",
  // ];

  // for (const stateName of defaultStates) {
  //   await prisma.productState.upsert({
  //     where: { name_section: { name: stateName, section: null } },
  //     update: {},
  //     create: { name: stateName, isActive: true },
  //   });
  // }
  // console.log(`✅ ${defaultStates.length} estados de producto creados`);

  // Crear sucursales de ejemplo
  const branches = [
    { name: "Sucursal Central", address: "Av. Principal 123" },
    { name: "Sucursal Norte", address: "Calle Norte 456" },
  ];

  for (const branchData of branches) {
    await prisma.branch.upsert({
      where: { name: branchData.name },
      update: {},
      create: { ...branchData, isActive: true },
    });
  }
  console.log(`✅ ${branches.length} sucursales creadas`);

  // Crear productos de ejemplo (lácteos Luz Azul)
  const products = [
  {
    "code": "100",
    "name": "(001) Salamin Fino Cagnoli x Kg",
    "description": "(001) Salamin Fino Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "101",
    "name": "(002) Salamin Grueso Cagnoli x Kg",
    "description": "(002) Salamin Grueso Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "102",
    "name": "(003) Longaniza Calabresa Cagnoli x Kg",
    "description": "(003) Longaniza Calabresa Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "103",
    "name": "(005) Longaniza Española Cagnoli x Kg",
    "description": "(005) Longaniza Española Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "105",
    "name": "(008) Chorizo Seco Tipo Casero Cagnoli x Kg",
    "description": "(008) Chorizo Seco Tipo Casero Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "150",
    "name": "(010) Crudo Parma Fox x Kg",
    "description": "(010) Crudo Parma Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "163",
    "name": "(010) Salame Milan Cagnoli x Kg",
    "description": "(010) Salame Milan Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7797283006012",
    "name": "(012) Ac. Verdes en Rodajas Molanes x 1.7 Kg",
    "description": "(012) Ac. Verdes en Rodajas Molanes x 1.7 Kg",
    "label": "Molanes",
    "barcode": "BL"
  },
  {
    "code": "362",
    "name": "(012) Jamon Natural Puente De Ronda kg",
    "description": "(012) Jamon Natural Puente De Ronda kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "364",
    "name": "(014) Fiambre De Paleta Puentes De Ronda x kg",
    "description": "(014) Fiambre De Paleta Puentes De Ronda x kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "154",
    "name": "(014) Jamon Cocido Roggiano Tapalque x Kg",
    "description": "(014) Jamon Cocido Roggiano Tapalque x Kg",
    "label": "Fiambres Tapalque"
  },
  {
    "code": "7797283060014",
    "name": "(014) Pack Obsequio Molanes",
    "description": "(014) Pack Obsequio Molanes",
    "label": "Molanes",
    "barcode": "BJ"
  },
  {
    "code": "354",
    "name": "(017) Salame Milan Don jose x kg",
    "description": "(017) Salame Milan Don jose x kg",
    "label": "Fiambres Don Jose",
    "barcode": "354"
  },
  {
    "code": "7798142720018",
    "name": "(018) Mascarpone Festa x 250 gr",
    "description": "(018) Mascarpone Festa x 250 gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "365",
    "name": "(018) Panceta Ahumada Don Jose x kg",
    "description": "(018) Panceta Ahumada Don Jose x kg",
    "label": "Fiambres Don Jose",
    "barcode": "365"
  },
  {
    "code": "188",
    "name": "(020) Baston Calabreza Cagnoli x Kg",
    "description": "(020) Baston Calabreza Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "162",
    "name": "(021) Fiambre Paleta Cerdo Tapalque x Kg",
    "description": "(021) Fiambre Paleta Cerdo Tapalque x Kg",
    "label": "Fiambres Tapalque"
  },
  {
    "code": "366",
    "name": "(021) Panceta Ahumada Doble Don Jose x kg",
    "description": "(021) Panceta Ahumada Doble Don Jose x kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "367",
    "name": "(023) Panceta Salada Puentes De Ronda x kg",
    "description": "(023) Panceta Salada Puentes De Ronda x kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "127",
    "name": "(023) Salame Centinela Cagnoli x Kg",
    "description": "(023) Salame Centinela Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "145",
    "name": "(025) Jamon Crudo Fox x Kg",
    "description": "(025) Jamon Crudo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "190",
    "name": "(027) Baston Fino Cagnoli x Kg",
    "description": "(027) Baston Fino Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "111",
    "name": "(027) Crudo Et.Beige Listo Fox x Kg",
    "description": "(027) Crudo Et.Beige Listo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "189",
    "name": "(028) Baston Criollo P.Grueso Cagnoli x Kg",
    "description": "(028) Baston Criollo P.Grueso Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "187",
    "name": "(029) Baston Español Cagnoli x Kg",
    "description": "(029) Baston Español Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7797283007033",
    "name": "(033)Aceite de Oliva Extra Virgen Molanes x 500 ml",
    "description": "(033)Aceite de Oliva Extra Virgen Molanes x 500 ml",
    "label": "Molanes"
  },
  {
    "code": "112",
    "name": "(035) Jamon Cocido (P. grande) Cagnoli x Kg",
    "description": "(035) Jamon Cocido (P. grande) Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798134610037",
    "name": "(037) Queso Camembert x 100 gr",
    "description": "(037) Queso Camembert x 100 gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "113",
    "name": "(038)Pernil Cerdo Primera (P.G.) Cagnoli x Kg",
    "description": "(038)Pernil Cerdo Primera (P.G.) Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7797283003042",
    "name": "(042) Berenjenas en Aceite x 220 grs Molanes",
    "description": "(042) Berenjenas en Aceite x 220 grs Molanes",
    "label": "Molanes",
    "barcode": "BQ"
  },
  {
    "code": "221",
    "name": "(051) Lomo Suizo Tapalque x Kg",
    "description": "(051) Lomo Suizo Tapalque x Kg",
    "label": "Fiambres Tapalque"
  },
  {
    "code": "7798134610051",
    "name": "(051) Neufchatel 100 g Corazoncitos",
    "description": "(051) Neufchatel 100 g Corazoncitos",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "142",
    "name": "(054) Lomo Ahumado Roggiano Tapalque x Kg",
    "description": "(054) Lomo Ahumado Roggiano Tapalque x Kg",
    "label": "Fiambres Tapalque"
  },
  {
    "code": "115",
    "name": "(055) Cocido Natural Fox x Kg",
    "description": "(055) Cocido Natural Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7798142720056",
    "name": "(056) Queso Crema Festa Descremado x 3Kg.",
    "description": "(056) Queso Crema Festa Descremado x 3Kg.",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "147",
    "name": "(060) Cocido Et. Negra Oval Fox x Kg",
    "description": "(060) Cocido Et. Negra Oval Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "122",
    "name": "(061) Cocido Et. Negra Fox x Kg",
    "description": "(061) Cocido Et. Negra Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "118",
    "name": "(063) Jamon Crudo Cagnoli x Kg",
    "description": "(063) Jamon Crudo Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798142720063",
    "name": "(063) Queso Crema Festa x 3 Kg",
    "description": "(063) Queso Crema Festa x 3 Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "199",
    "name": "(067) Lomo F/Hierbas Cagnoli x Kg",
    "description": "(067) Lomo F/Hierbas Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798142720070",
    "name": "(070) Mascarpone Festa x 3 Kg",
    "description": "(070) Mascarpone Festa x 3 Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "244",
    "name": "(070) Panceta Ahumada C/Cuero Tapalque x Kg",
    "description": "(070) Panceta Ahumada C/Cuero Tapalque x Kg",
    "label": "Fiambres Tapalque"
  },
  {
    "code": "119",
    "name": "(070) Panceta Ahumada Cagnoli x Kg",
    "description": "(070) Panceta Ahumada Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "297",
    "name": "(071) Panceta Doble Tiernizada Tapalque x Kg",
    "description": "(071) Panceta Doble Tiernizada Tapalque x Kg",
    "label": "Fiambres Tapalque"
  },
  {
    "code": "7798411850040",
    "name": "(0718) Sal Marina F H y Limon Art. Gourmet x 120gr",
    "description": "(0718) Sal Marina F H y Limon Art. Gourmet x 120gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850033",
    "name": "(0719) Sal Marina Pim y ajo ahu Gourmet x 120 gr",
    "description": "(0719) Sal Marina Pim y ajo ahu Gourmet x 120 gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "120",
    "name": "(072) Spianatta Cagnoli x Kg",
    "description": "(072) Spianatta Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798411850064",
    "name": "(0720) Sal Marina Pastas yArroces  Gourmet x 120gr",
    "description": "(0720) Sal Marina Pastas yArroces  Gourmet x 120gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850309",
    "name": "(0730) Merken ahumado Art. Gourmet x 55gr",
    "description": "(0730) Merken ahumado Art. Gourmet x 55gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850293",
    "name": "(0731) Curry ahumado Art. Gourmet x 60gr",
    "description": "(0731) Curry ahumado Art. Gourmet x 60gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850286",
    "name": "(0732) Ajillo Ahumado Art. Gourmet x 60gr",
    "description": "(0732) Ajillo Ahumado Art. Gourmet x 60gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850262",
    "name": "(0733) Cebolla escama Ahum. Art. Gourmet x 50gr",
    "description": "(0733) Cebolla escama Ahum. Art. Gourmet x 50gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850026",
    "name": "(0734) Pimenton ahumado Art. Gourmet x 50gr",
    "description": "(0734) Pimenton ahumado Art. Gourmet x 50gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "371",
    "name": "(076) Jamon Bajo En Sodio Puente De Ronda x kg",
    "description": "(076) Jamon Bajo En Sodio Puente De Ronda x kg",
    "label": "Fiambres Don Jose",
    "barcode": "371"
  },
  {
    "code": "129",
    "name": "(076) Spianatta al Aji Molido Cagnoli x Kg",
    "description": "(076) Spianatta al Aji Molido Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "132",
    "name": "(077) Spianatta C/Hierbas Cagnoli x Kg",
    "description": "(077) Spianatta C/Hierbas Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "133",
    "name": "(078) Spianatta a la Pimienta Cagnoli x Kg",
    "description": "(078) Spianatta a la Pimienta Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798411851146",
    "name": "(0807) Sal Parrillera Gourmet x 65 gr",
    "description": "(0807) Sal Parrillera Gourmet x 65 gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411851184",
    "name": "(0808) Sal Patagonica x 65 gr",
    "description": "(0808) Sal Patagonica x 65 gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411851160",
    "name": "(0809) Sal pimienta, Limon y Ajo x 65 gr",
    "description": "(0809) Sal pimienta, Limon y Ajo x 65 gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411851153",
    "name": "(0810) Sal Con 5 Pimientas x 65 gr",
    "description": "(0810) Sal Con 5 Pimientas x 65 gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411851207",
    "name": "(0819) Condimento Para Pizzas x 25 gr",
    "description": "(0819) Condimento Para Pizzas x 25 gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798134610082",
    "name": "(082) Queso Brie x 100gr",
    "description": "(082) Queso Brie x 100gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798259430084",
    "name": "(084) Jugo Pura Frutta Manzana Verde x 1 L",
    "description": "(084) Jugo Pura Frutta Manzana Verde x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "7797283005084",
    "name": "(084) Tomate Triturado Molanes x 8 Kg",
    "description": "(084) Tomate Triturado Molanes x 8 Kg",
    "label": "Molanes"
  },
  {
    "code": "121",
    "name": "(085) Salame Fino al Aji Cagnoli x Kg",
    "description": "(085) Salame Fino al Aji Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "116",
    "name": "(087) Baston Finas Hierbas Cagnoli x Kg",
    "description": "(087) Baston Finas Hierbas Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798259439087",
    "name": "(087) Jugo Pura Frutta Naranja x 1 L",
    "description": "(087) Jugo Pura Frutta Naranja x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "110",
    "name": "(089) Mortadela Bocha Cagnoli x Kg",
    "description": "(089) Mortadela Bocha Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "117",
    "name": "(090) Grueso Pimienta Cagnoli x Kg",
    "description": "(090) Grueso Pimienta Cagnoli x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798411850354",
    "name": "(0907) Oregano hoja Art. Gourmet x 15gr",
    "description": "(0907) Oregano hoja Art. Gourmet x 15gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798353194592",
    "name": "(091) Aceite de Oliva Calamaro x 250ml",
    "description": "(091) Aceite de Oliva Calamaro x 250ml",
    "label": "Otros de terceros"
  },
  {
    "code": "7798353194608",
    "name": "(091) Aceto Clasico Calamaro x 250ml",
    "description": "(091) Aceto Clasico Calamaro x 250ml",
    "label": "Otros de terceros"
  },
  {
    "code": "160",
    "name": "(091) Bondiola Fox x Kg",
    "description": "(091) Bondiola Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7797283005091",
    "name": "(091) Tomate Triturado Molanes x 1 Kg",
    "description": "(091) Tomate Triturado Molanes x 1 Kg",
    "label": "Molanes"
  },
  {
    "code": "798411851092",
    "name": "(092) Sal Marina Ahu. 7 Esp.  Art. Gourmet x 120gr",
    "description": "(092) Sal Marina Ahu. 7 Esp.  Art. Gourmet x 120gr",
    "label": "Locos por el Asado",
    "barcode": "798411851092"
  },
  {
    "code": "7798411851214",
    "name": "(0932) Condimento Para Provoleta x 25 gr",
    "description": "(0932) Condimento Para Provoleta x 25 gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798259439094",
    "name": "(094) Jugo Pura Frutta Manzana/Frutilla x 1 L",
    "description": "(094) Jugo Pura Frutta Manzana/Frutilla x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "350",
    "name": "(094) Lomo Ahumado Don Jose x Kg",
    "description": "(094) Lomo Ahumado Don Jose x Kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "7798259439100",
    "name": "(100) Jugo Pura Frutta Manzana/Arandano x 1 L",
    "description": "(100) Jugo Pura Frutta Manzana/Arandano x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "128",
    "name": "(100) Lomo Ahumado Fox x Kg",
    "description": "(100) Lomo Ahumado Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7791218000021",
    "name": "(100) Tapas Empanadas Hojaldre Orali x 330g",
    "description": "(100) Tapas Empanadas Hojaldre Orali x 330g",
    "label": "Orali",
    "barcode": "7791218000021"
  },
  {
    "code": "361",
    "name": "(1002) Crudo Medio C/ Cuero Artesano x Kg",
    "description": "(1002) Crudo Medio C/ Cuero Artesano x Kg",
    "label": "Fiambres El artesano"
  },
  {
    "code": "360",
    "name": "(1003) Crudo Medio S/ Hueso  Artesano x Kg",
    "description": "(1003) Crudo Medio S/ Hueso  Artesano x Kg",
    "label": "Fiambres El artesano"
  },
  {
    "code": "299",
    "name": "(101) Lomo F/Hierbas Fox x Kg",
    "description": "(101) Lomo F/Hierbas Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "172",
    "name": "(101) Salamin Fino ATM Cagnoli (130 grs) x Unid",
    "description": "(101) Salamin Fino ATM Cagnoli (130 grs) x Unid",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7791218000014",
    "name": "(101) Tapas Empanadas Freir Orali x 330g",
    "description": "(101) Tapas Empanadas Freir Orali x 330g",
    "label": "Orali",
    "barcode": "7791218000014"
  },
  {
    "code": "173",
    "name": "(102) Salamin Grueso ATM Cagnoli (130 grs) x Unid",
    "description": "(102) Salamin Grueso ATM Cagnoli (130 grs) x Unid",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798158630103",
    "name": "(103) Boconccino  x 150 grs",
    "description": "(103) Boconccino  x 150 grs",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "363",
    "name": "(103) Jamon Cocido Puentes de ronda x kg",
    "description": "(103) Jamon Cocido Puentes de ronda x kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "7791218000052",
    "name": "(104) Tapas Pascualina Hojaldre Orali x 400g",
    "description": "(104) Tapas Pascualina Hojaldre Orali x 400g",
    "label": "Orali",
    "barcode": "7791218000052"
  },
  {
    "code": "7791218000274",
    "name": "(105) Tapas Empanadas TuboL Hojaldre Orali x 1.8Kg",
    "description": "(105) Tapas Empanadas TuboL Hojaldre Orali x 1.8Kg",
    "label": "Orali",
    "barcode": "7791218000274"
  },
  {
    "code": "7791218000656",
    "name": "(106) Tapas Empanadas TuboL Criolla Orali x 1.8Kg",
    "description": "(106) Tapas Empanadas TuboL Criolla Orali x 1.8Kg",
    "label": "Orali",
    "barcode": "7791218000656"
  },
  {
    "code": "7791218000205",
    "name": "(107) Tapas Empanadas Tubo XL Hojaldre Orali x 2Kg",
    "description": "(107) Tapas Empanadas Tubo XL Hojaldre Orali x 2Kg",
    "label": "Orali",
    "barcode": "7791218000205"
  },
  {
    "code": "7793913013658",
    "name": "(108) Queso Untable Cheddar Tregar x 180 gr",
    "description": "(108) Queso Untable Cheddar Tregar x 180 gr",
    "label": "Tregar",
    "barcode": "779391301358"
  },
  {
    "code": "7791218000403",
    "name": "(108) Tapas Empanadas Tubo XL Criolla Orali x 2 Kg",
    "description": "(108) Tapas Empanadas Tubo XL Criolla Orali x 2 Kg",
    "label": "Orali"
  },
  {
    "code": "7795165000110",
    "name": "(110) Salchicha Viena Copetin Friolim",
    "description": "(110) Salchicha Viena Copetin Friolim",
    "label": "Productos Propios",
    "barcode": "7795165000110"
  },
  {
    "code": "7791218123706",
    "name": "(1100) Levadura Prensada Orali x 500g",
    "description": "(1100) Levadura Prensada Orali x 500g",
    "label": "Orali",
    "barcode": "7791218123706"
  },
  {
    "code": "134",
    "name": "(111) Queso de Cerdo Redondo Fox x Kg",
    "description": "(111) Queso de Cerdo Redondo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7791218000137",
    "name": "(112) Ñoquis de Semola Orali x 500g",
    "description": "(112) Ñoquis de Semola Orali x 500g",
    "label": "Orali",
    "barcode": "7791218000137"
  },
  {
    "code": "7798411850330",
    "name": "(1123)Sal c / Pim N  limon ajo Art. Gourmet x 120g",
    "description": "(1123)Sal c / Pim N  limon ajo Art. Gourmet x 120g",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850255",
    "name": "(1124) Sal con 5 pimientas Art. Gourmet x 120gr",
    "description": "(1124) Sal con 5 pimientas Art. Gourmet x 120gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850217",
    "name": "(1127) Provenzal Art. Gourmet x 45gr",
    "description": "(1127) Provenzal Art. Gourmet x 45gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850248",
    "name": "(1128) Mediterraneo (Ajo y Piment) Gourmet x 50 g",
    "description": "(1128) Mediterraneo (Ajo y Piment) Gourmet x 50 g",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850200",
    "name": "(1129) Condimento para Pizzas Art. Gourmet x 45gr",
    "description": "(1129) Condimento para Pizzas Art. Gourmet x 45gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850194",
    "name": "(1130) Condi. para provoleta Art.Gourmet x 45g",
    "description": "(1130) Condi. para provoleta Art.Gourmet x 45g",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850019",
    "name": "(1131) Capresse Art. Gourmet x 45gr",
    "description": "(1131) Capresse Art. Gourmet x 45gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850224",
    "name": "(1133) Hongos al puerro Art. Gourmet x 45gr",
    "description": "(1133) Hongos al puerro Art. Gourmet x 45gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7791218122921",
    "name": "(114) Capellettis Carne y Espinaca Orali x 500g",
    "description": "(114) Capellettis Carne y Espinaca Orali x 500g",
    "label": "Orali",
    "barcode": "7791218122921"
  },
  {
    "code": "136",
    "name": "(115) Mortadela Bocha Fox x Kg",
    "description": "(115) Mortadela Bocha Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7797283001116",
    "name": "(116) Aceitunas Verdes \"00\" Molanes x 2 Kg",
    "description": "(116) Aceitunas Verdes \"00\" Molanes x 2 Kg",
    "label": "Molanes",
    "barcode": "BN"
  },
  {
    "code": "370",
    "name": "(116) Bondiola Don Jose x kg",
    "description": "(116) Bondiola Don Jose x kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "7791218000069",
    "name": "(116) Tapas Empanadas Hojaldre Prem. Orali x 420g",
    "description": "(116) Tapas Empanadas Hojaldre Prem. Orali x 420g",
    "label": "Orali",
    "barcode": "7791218000069"
  },
  {
    "code": "7798013102844",
    "name": "(117) Fuet Serrano Cagnoli (150 grs) x Unid",
    "description": "(117) Fuet Serrano Cagnoli (150 grs) x Unid",
    "label": "Fiambres Cagnoli",
    "barcode": "7798013102844"
  },
  {
    "code": "7795786000117",
    "name": "(117) Saborizado Pimienta x Unid",
    "description": "(117) Saborizado Pimienta x Unid",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7791218000663",
    "name": "(117) Tapas Empanadas Criolla Prem. Orali x 420g",
    "description": "(117) Tapas Empanadas Criolla Prem. Orali x 420g",
    "label": "Orali",
    "barcode": "7791218000663"
  },
  {
    "code": "7791218000892",
    "name": "(118) Tapas Pascualina Criolla Prem. Orali x 500g",
    "description": "(118) Tapas Pascualina Criolla Prem. Orali x 500g",
    "label": "Orali",
    "barcode": "7791218000892"
  },
  {
    "code": "135",
    "name": "(120) Mortadela Bologna Fox x Kg",
    "description": "(120) Mortadela Bologna Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7791218000984",
    "name": "(120) Tapas Tubo XL Rotis Hojaldre Orali x 1.865Kg",
    "description": "(120) Tapas Tubo XL Rotis Hojaldre Orali x 1.865Kg",
    "label": "Orali",
    "barcode": "7791218000984"
  },
  {
    "code": "7791218000977",
    "name": "(121) Tapas Tubo XL Rotis Criolla Orali x 1.865 Kg",
    "description": "(121) Tapas Tubo XL Rotis Criolla Orali x 1.865 Kg",
    "label": "Orali",
    "barcode": "7791218000977"
  },
  {
    "code": "7797283012211",
    "name": "(1221) Aceitunas Negras 00 Condim En Aceite x 2 kg",
    "description": "(1221) Aceitunas Negras 00 Condim En Aceite x 2 kg",
    "label": "Molanes"
  },
  {
    "code": "7798411850279",
    "name": "(1249) Aji dulce ahumado Art. Gourmet x 50gr",
    "description": "(1249) Aji dulce ahumado Art. Gourmet x 50gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850187",
    "name": "(1250) Albahaca Art. Gourmet x 13gr",
    "description": "(1250) Albahaca Art. Gourmet x 13gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850170",
    "name": "(1251) Romero Hoja Art. Gourmet x 17gr",
    "description": "(1251) Romero Hoja Art. Gourmet x 17gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850347",
    "name": "(1252) Tomillo Art. Gourmet x 15gr",
    "description": "(1252) Tomillo Art. Gourmet x 15gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850149",
    "name": "(1254) Perejil Art. Gourmet x 15gr",
    "description": "(1254) Perejil Art. Gourmet x 15gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850132",
    "name": "(1255) Laurel Art. Gourmet x 10gr",
    "description": "(1255) Laurel Art. Gourmet x 10gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850378",
    "name": "(1258) Pimentón dulce Art. Gourmet x 25gr",
    "description": "(1258) Pimentón dulce Art. Gourmet x 25gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850095",
    "name": "(1259) Aji dulce Art. Gourmet x 25gr",
    "description": "(1259) Aji dulce Art. Gourmet x 25gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7791218124239",
    "name": "(126) Ravioles Cuatro Quesos Orali x 500 g",
    "description": "(126) Ravioles Cuatro Quesos Orali x 500 g",
    "label": "Orali"
  },
  {
    "code": "7798411850088",
    "name": "(1260) Ajo g.  Art. Gourmet x 25gr",
    "description": "(1260) Ajo g.  Art. Gourmet x 25gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850408",
    "name": "(1261) Pimienta negra Art. Gourmet x 25gr",
    "description": "(1261) Pimienta negra Art. Gourmet x 25gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7797283001277",
    "name": "(127) Aceitunas Verdes 0 Doy Pack Molanes  x 180gr",
    "description": "(127) Aceitunas Verdes 0 Doy Pack Molanes  x 180gr",
    "label": "Molanes",
    "barcode": "7797283001277"
  },
  {
    "code": "7791218000908",
    "name": "(128) Tapas Pascualina Hojaldre Prem. Orali x 500g",
    "description": "(128) Tapas Pascualina Hojaldre Prem. Orali x 500g",
    "label": "Orali",
    "barcode": "7791218000908"
  },
  {
    "code": "7797283001130",
    "name": "(130) Ac. Verdes Premium \"00\" Molanes x 380  g",
    "description": "(130) Ac. Verdes Premium \"00\" Molanes x 380  g",
    "label": "Molanes"
  },
  {
    "code": "7791218000861",
    "name": "(130) Ravioles Calabaza Premium Orali x 454g",
    "description": "(130) Ravioles Calabaza Premium Orali x 454g",
    "label": "Orali",
    "barcode": "7791218000861"
  },
  {
    "code": "7791218000878",
    "name": "(131) Ravioles Ricota/Espinaca Prem. Orali x 500g",
    "description": "(131) Ravioles Ricota/Espinaca Prem. Orali x 500g",
    "label": "Orali",
    "barcode": "7791218000878"
  },
  {
    "code": "7793913002119",
    "name": "(1319) Leche Chocolatada Tregar x 200 ml.",
    "description": "(1319) Leche Chocolatada Tregar x 200 ml.",
    "label": "Tregar",
    "barcode": "7793913002119"
  },
  {
    "code": "7791218124246",
    "name": "(133) Ravioles Ricota Premium Orali x 500 gr",
    "description": "(133) Ravioles Ricota Premium Orali x 500 gr",
    "label": "Orali",
    "barcode": "7791218124246"
  },
  {
    "code": "158",
    "name": "(135) Salchichon c/Jamon Fox x Kg",
    "description": "(135) Salchichon c/Jamon Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "369",
    "name": "(136) Lomo Ahumado Finas Hierbas Don Jose x kg",
    "description": "(136) Lomo Ahumado Finas Hierbas Don Jose x kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "7798259430138",
    "name": "(138) Jugo Pura Frutta Manzana Roja x 1 L",
    "description": "(138) Jugo Pura Frutta Manzana Roja x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "7791218123010",
    "name": "(140) Tapa Rotisera Hojaldre Alta Cocina x 625g",
    "description": "(140) Tapa Rotisera Hojaldre Alta Cocina x 625g",
    "label": "Orali"
  },
  {
    "code": "7797283003141",
    "name": "(141) Corazon Alcaucil Aceite Molanes x 220 g",
    "description": "(141) Corazon Alcaucil Aceite Molanes x 220 g",
    "label": "Molanes",
    "barcode": "BP"
  },
  {
    "code": "7791218123003",
    "name": "(141) Tapa Rotisera Criolla Alta Cocina x 625g",
    "description": "(141) Tapa Rotisera Criolla Alta Cocina x 625g",
    "label": "Orali"
  },
  {
    "code": "7797283006142",
    "name": "(142) Alcaparras en Vinagre x 65 grs Molanes",
    "description": "(142) Alcaparras en Vinagre x 65 grs Molanes",
    "label": "Molanes"
  },
  {
    "code": "137",
    "name": "(142) Morcillon con Lengua Fox x Kg",
    "description": "(142) Morcillon con Lengua Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "157",
    "name": "(145) Salchichon Primavera Fox x Kg",
    "description": "(145) Salchichon Primavera Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7795786000148",
    "name": "(148) Saborizado Capresse x Unid",
    "description": "(148) Saborizado Capresse x Unid",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7791218124055",
    "name": "(151) Tortillas Clasicas Luz Azul 12 u. x 440g",
    "description": "(151) Tortillas Clasicas Luz Azul 12 u. x 440g",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "139",
    "name": "(155) Leberwurst Fox x Kg",
    "description": "(155) Leberwurst Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7795786000155",
    "name": "(155) Saborizado Aji x Unid",
    "description": "(155) Saborizado Aji x Unid",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798158630158",
    "name": "(158) Burratas x 200 grs",
    "description": "(158) Burratas x 200 grs",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798013100697",
    "name": "(16) Fuet Cagnoli ATM (150 grs) x Unid",
    "description": "(16) Fuet Cagnoli ATM (150 grs) x Unid",
    "label": "Fiambres Cagnoli",
    "barcode": "7798013100697"
  },
  {
    "code": "7793913013009",
    "name": "(1621) Leche Deslactosada Descr. Tregar x 1 Lt.",
    "description": "(1621) Leche Deslactosada Descr. Tregar x 1 Lt.",
    "label": "Tregar",
    "barcode": "7793913002249"
  },
  {
    "code": "7793913013207",
    "name": "(1627) Queso Crema Clasico Tregar x 190 g",
    "description": "(1627) Queso Crema Clasico Tregar x 190 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013214",
    "name": "(1628) Quesp Crema Light Tregar x 190 g",
    "description": "(1628) Quesp Crema Light Tregar x 190 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013238",
    "name": "(1636)Yogurt Ent. Frutas Frutilla Tregar x 160 grs",
    "description": "(1636)Yogurt Ent. Frutas Frutilla Tregar x 160 grs",
    "label": "Tregar",
    "barcode": "7793913000856"
  },
  {
    "code": "7793913013245",
    "name": "(1637) Yogurt Ent. Frutas Durazno Tregar x 160 grs",
    "description": "(1637) Yogurt Ent. Frutas Durazno Tregar x 160 grs",
    "label": "Tregar",
    "barcode": "7793913013245"
  },
  {
    "code": "7793913013252",
    "name": "(1638)Yogurt Ent Frutas Arandanos Tregar x 160 grs",
    "description": "(1638)Yogurt Ent Frutas Arandanos Tregar x 160 grs",
    "label": "Tregar",
    "barcode": "7793913001815"
  },
  {
    "code": "7793913002423",
    "name": "(1694) Yogurt Natural Tregar x 140 grs.",
    "description": "(1694) Yogurt Natural Tregar x 140 grs.",
    "label": "Tregar",
    "barcode": "7793913002423"
  },
  {
    "code": "7793913013368",
    "name": "(1695) Yogur Bebible Entero Durazno tregar x 900 g",
    "description": "(1695) Yogur Bebible Entero Durazno tregar x 900 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013375",
    "name": "(1696) Yogur Bebible Entero Arandano x 900 g",
    "description": "(1696) Yogur Bebible Entero Arandano x 900 g",
    "label": "Tregar"
  },
  {
    "code": "140",
    "name": "(170) Matambre Vaca Fox x Kg",
    "description": "(170) Matambre Vaca Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7791218124703",
    "name": "(170) Sorrentinos Calabaza y Muzza Orali x 500g",
    "description": "(170) Sorrentinos Calabaza y Muzza Orali x 500g",
    "label": "Orali"
  },
  {
    "code": "7791218124710",
    "name": "(171) Sorrentinos Cuatro Quesos Orali x 500g",
    "description": "(171) Sorrentinos Cuatro Quesos Orali x 500g",
    "label": "Orali"
  },
  {
    "code": "7791218124727",
    "name": "(172) Sorrentinos Ricota y Esp. Orali x 500g",
    "description": "(172) Sorrentinos Ricota y Esp. Orali x 500g",
    "label": "Orali"
  },
  {
    "code": "141",
    "name": "(175) Arroll. Pollo Fox x Kg",
    "description": "(175) Arroll. Pollo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7795786000179",
    "name": "(179) Saborizado Oregano x Unid",
    "description": "(179) Saborizado Oregano x Unid",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7795786000193",
    "name": "(193) Saborizado Finas Hierbas x Unid",
    "description": "(193) Saborizado Finas Hierbas x Unid",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7793913013573",
    "name": "(1993) Yogurt Bebi Ent Frutilla Fort Tregar x 900",
    "description": "(1993) Yogurt Bebi Ent Frutilla Fort Tregar x 900",
    "label": "Tregar",
    "barcode": "7793913013573"
  },
  {
    "code": "7793913013580",
    "name": "(1994)Yogurt Bebibl Ent Vainilla Fort Tregar x 900",
    "description": "(1994)Yogurt Bebibl Ent Vainilla Fort Tregar x 900",
    "label": "Tregar",
    "barcode": "7793913013580"
  },
  {
    "code": "7793913013528",
    "name": "(1995) Yogur Entero Frutilla Tregar x 125 g",
    "description": "(1995) Yogur Entero Frutilla Tregar x 125 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013535",
    "name": "(1997) Yogur  Entero Vainilla  Tregar x 125 g",
    "description": "(1997) Yogur  Entero Vainilla  Tregar x 125 g",
    "label": "Tregar",
    "barcode": "7793913013535"
  },
  {
    "code": "7793913013542",
    "name": "(1998) Yogur Entero Dulce De Leche Tregar x 125 g",
    "description": "(1998) Yogur Entero Dulce De Leche Tregar x 125 g",
    "label": "Tregar"
  },
  {
    "code": "182",
    "name": "(200) Salame Milan Fox x Kg",
    "description": "(200) Salame Milan Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7798013108136",
    "name": "(201) Salamin  Picado fino ATM Cagnoli x 145 gr",
    "description": "(201) Salamin  Picado fino ATM Cagnoli x 145 gr",
    "label": "Fiambres Cagnoli",
    "barcode": "7798013108136"
  },
  {
    "code": "7798013108143",
    "name": "(202) Salamin  Picado  Grueso ATM Cagnoli x 145 GR",
    "description": "(202) Salamin  Picado  Grueso ATM Cagnoli x 145 GR",
    "label": "Fiambres Cagnoli",
    "barcode": "7798013108143"
  },
  {
    "code": "191",
    "name": "(205) Salame Crespon Fox x Kg",
    "description": "(205) Salame Crespon Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7793913013443",
    "name": "(2068) Crema de leche Doble crema x 350 cc",
    "description": "(2068) Crema de leche Doble crema x 350 cc",
    "label": "Tregar"
  },
  {
    "code": "7793913013610",
    "name": "(2078) Neufchatel Clasico Tregar x 180 grs.",
    "description": "(2078) Neufchatel Clasico Tregar x 180 grs.",
    "label": "Tregar",
    "barcode": "7793913013610"
  },
  {
    "code": "7793913013627",
    "name": "(2079) Neufchatel Jamon Tregar x 180 grs.",
    "description": "(2079) Neufchatel Jamon Tregar x 180 grs.",
    "label": "Tregar",
    "barcode": "7793913013627"
  },
  {
    "code": "7798259439209",
    "name": "(209) Jugo Pura Frutta Manzana Organico x 1 L",
    "description": "(209) Jugo Pura Frutta Manzana Organico x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "7795786000209",
    "name": "(209) Saborizado Provenzal x Unid",
    "description": "(209) Saborizado Provenzal x Unid",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7793913013634",
    "name": "(2094) Neufchatel Salame Tregar x 180 grs.",
    "description": "(2094) Neufchatel Salame Tregar x 180 grs.",
    "label": "Tregar",
    "barcode": "7793913013634"
  },
  {
    "code": "143",
    "name": "(210) Cantimpalo Fox x Kg",
    "description": "(210) Cantimpalo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7793913013450",
    "name": "(2109) Arroz con Leche Clasico Tregar x 180 grs",
    "description": "(2109) Arroz con Leche Clasico Tregar x 180 grs",
    "label": "Tregar",
    "barcode": "7793913013450"
  },
  {
    "code": "151",
    "name": "(211) Salame Milan 201 x Kg",
    "description": "(211) Salame Milan 201 x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7793913013467",
    "name": "(2110) Arroz con Dulce de Leche Tregar x 180 grs",
    "description": "(2110) Arroz con Dulce de Leche Tregar x 180 grs",
    "label": "Tregar",
    "barcode": "7793913013467"
  },
  {
    "code": "7793913013474",
    "name": "(2111) Arroz C/Leche Canela x 180 g",
    "description": "(2111) Arroz C/Leche Canela x 180 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013597",
    "name": "(2112)Yogurt Bebible Desc Frutilla Tregar x 900 gr",
    "description": "(2112)Yogurt Bebible Desc Frutilla Tregar x 900 gr",
    "label": "Tregar",
    "barcode": "7793913013597"
  },
  {
    "code": "7793913013603",
    "name": "(2113) Yogur Bebible Descremado Vainilla x 900 g",
    "description": "(2113) Yogur Bebible Descremado Vainilla x 900 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013559",
    "name": "(2114) Yogur Descremado Frutilla Tregar x 125 g",
    "description": "(2114) Yogur Descremado Frutilla Tregar x 125 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013566",
    "name": "(2115) Yogur Descremado Vainilla Tregar x 125 g",
    "description": "(2115) Yogur Descremado Vainilla Tregar x 125 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013641",
    "name": "(2118) Neufchatel Descremado Tregar x 180 grs.",
    "description": "(2118) Neufchatel Descremado Tregar x 180 grs.",
    "label": "Tregar",
    "barcode": "7793913013641"
  },
  {
    "code": "7798013100246",
    "name": "(212) Sopresatta Cagnoli ATM (135 grs) x Unid",
    "description": "(212) Sopresatta Cagnoli ATM (135 grs) x Unid",
    "label": "Fiambres Cagnoli",
    "barcode": "7798013100246"
  },
  {
    "code": "7793913013719",
    "name": "(2144)  Queso Blanco Clasico Tregar x 290 g",
    "description": "(2144)  Queso Blanco Clasico Tregar x 290 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013726",
    "name": "(2145) Queso Blanco Light Tregar x 290 g",
    "description": "(2145) Queso Blanco Light Tregar x 290 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013689",
    "name": "(2149) Yogurt Natural sin azúcar Tregar x 140 grs.",
    "description": "(2149) Yogurt Natural sin azúcar Tregar x 140 grs.",
    "label": "Tregar",
    "barcode": "7793913013689"
  },
  {
    "code": "7797283001215",
    "name": "(215) Aceitunas Verdes \"0\" Molanes x 2 Kg",
    "description": "(215) Aceitunas Verdes \"0\" Molanes x 2 Kg",
    "label": "Molanes",
    "barcode": "BK"
  },
  {
    "code": "7793913013788",
    "name": "(2153) Yogur Entero C/Frutas Anana tregar x 160 g",
    "description": "(2153) Yogur Entero C/Frutas Anana tregar x 160 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013795",
    "name": "(2154) Yogur Entero C/Frutas Mango tregar x 160 g",
    "description": "(2154) Yogur Entero C/Frutas Mango tregar x 160 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013757",
    "name": "(2155) Yogur Desc C/Frutas Frutilla Tregar x 160 g",
    "description": "(2155) Yogur Desc C/Frutas Frutilla Tregar x 160 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013764",
    "name": "(2156) Yogur Desc C/frutas Durazno x 160 g",
    "description": "(2156) Yogur Desc C/frutas Durazno x 160 g",
    "label": "Tregar"
  },
  {
    "code": "7793913013771",
    "name": "(2157) Yogur Desc C/ Frutas Arandano x 160 g",
    "description": "(2157) Yogur Desc C/ Frutas Arandano x 160 g",
    "label": "Tregar",
    "barcode": "7793913013771"
  },
  {
    "code": "7793913013740",
    "name": "(2168) Yogurt Ent con Granola Tregar x 155 grs",
    "description": "(2168) Yogurt Ent con Granola Tregar x 155 grs",
    "label": "Tregar",
    "barcode": "7793913013740"
  },
  {
    "code": "7793913013825",
    "name": "(2169) Neufchatel Ciboulette Tregar x 180 gr",
    "description": "(2169) Neufchatel Ciboulette Tregar x 180 gr",
    "label": "Tregar",
    "barcode": "7793913013825"
  },
  {
    "code": "7793913013986",
    "name": "(2171) Yogur Natural Endulzado Tregar x 280 gr",
    "description": "(2171) Yogur Natural Endulzado Tregar x 280 gr",
    "label": "Tregar",
    "barcode": "7793913013986"
  },
  {
    "code": "7793913013993",
    "name": "(2172) Yogur Natural S/Azucar Tregar x 280",
    "description": "(2172) Yogur Natural S/Azucar Tregar x 280",
    "label": "Tregar",
    "barcode": "7793913013993"
  },
  {
    "code": "7793913013733",
    "name": "(2173) Yogur Desc Anana Tregar x 160 gr",
    "description": "(2173) Yogur Desc Anana Tregar x 160 gr",
    "label": "Tregar"
  },
  {
    "code": "7793913013818",
    "name": "(2174) Yogur Entero Cereza Tregar x 160 gr",
    "description": "(2174) Yogur Entero Cereza Tregar x 160 gr",
    "label": "Tregar",
    "barcode": "7793913013818"
  },
  {
    "code": "7793913014020",
    "name": "(2175) Yogur Batido Con Cafe Tregar x 120 gr",
    "description": "(2175) Yogur Batido Con Cafe Tregar x 120 gr",
    "label": "Tregar"
  },
  {
    "code": "7793913014013",
    "name": "(2176) Yogur Batido Con Coco Rall. Tregar x 120 gr",
    "description": "(2176) Yogur Batido Con Coco Rall. Tregar x 120 gr",
    "label": "Tregar"
  },
  {
    "code": "7793913014006",
    "name": "(2177) Yogur Cascara De Limon Tregar x 120 gr",
    "description": "(2177) Yogur Cascara De Limon Tregar x 120 gr",
    "label": "Tregar"
  },
  {
    "code": "7798259439223",
    "name": "(223) Jugo Pura Frutta Manzana/Kiwi x 1 L",
    "description": "(223) Jugo Pura Frutta Manzana/Kiwi x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "7795165001223",
    "name": "(223) Salchicha Viena Clasica 6u Friolim",
    "description": "(223) Salchicha Viena Clasica 6u Friolim",
    "label": "Productos Propios",
    "barcode": "7795165001223"
  },
  {
    "code": "7793913014075",
    "name": "(2231) Yogur Firme Entero Frutilla Tregar x 170 gr",
    "description": "(2231) Yogur Firme Entero Frutilla Tregar x 170 gr",
    "label": "Tregar"
  },
  {
    "code": "7793913014082",
    "name": "(2232) Yogur Firme Vainilla Tregar x 170 gr",
    "description": "(2232) Yogur Firme Vainilla Tregar x 170 gr",
    "label": "Tregar"
  },
  {
    "code": "7793913014105",
    "name": "(2240) Yogur Firme Descr Frutilla Tregar x 170 gr",
    "description": "(2240) Yogur Firme Descr Frutilla Tregar x 170 gr",
    "label": "Tregar"
  },
  {
    "code": "7793913014112",
    "name": "(2241) Yogur Firme Descre Vainilla Tregar x 170gr",
    "description": "(2241) Yogur Firme Descre Vainilla Tregar x 170gr",
    "label": "Tregar"
  },
  {
    "code": "179",
    "name": "(225) Baston Criollo Fox x Kg",
    "description": "(225) Baston Criollo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7793913001013",
    "name": "(225) Queso Mascarpone tregar  x 200 g",
    "description": "(225) Queso Mascarpone tregar  x 200 g",
    "label": "Tregar"
  },
  {
    "code": "178",
    "name": "(226) Baston Chacarero Fox x Kg",
    "description": "(226) Baston Chacarero Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "180",
    "name": "(230) Salamin Fino Fox x Kg",
    "description": "(230) Salamin Fino Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "181",
    "name": "(235) Salamin Grueso Fox x Kg",
    "description": "(235) Salamin Grueso Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "155",
    "name": "(240) Chorizo Candelario Fox x Kg",
    "description": "(240) Chorizo Candelario Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7797283003240",
    "name": "(240) Pimientos Morron Natural Molanes x 220 g",
    "description": "(240) Pimientos Morron Natural Molanes x 220 g",
    "label": "Molanes",
    "barcode": "BW"
  },
  {
    "code": "156",
    "name": "(241) Baston Candelario Fox x Kg",
    "description": "(241) Baston Candelario Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "353",
    "name": "(245) Salame Tipo Pepperoni Fox x kg",
    "description": "(245) Salame Tipo Pepperoni Fox x kg",
    "label": "Fiambres Fox",
    "barcode": "353"
  },
  {
    "code": "7797283001246",
    "name": "(246) Aceitunas Verdes \"0\" Molanes x 220 grs.",
    "description": "(246) Aceitunas Verdes \"0\" Molanes x 220 grs.",
    "label": "Molanes",
    "barcode": "BS"
  },
  {
    "code": "7791218122914",
    "name": "(250) Tapas Empanadas Mix Semillas Orali x 420g",
    "description": "(250) Tapas Empanadas Mix Semillas Orali x 420g",
    "label": "Orali",
    "barcode": "7791218122914"
  },
  {
    "code": "7791218122907",
    "name": "(251) Tapas Pascualina Mix Semillas Orali x 500g",
    "description": "(251) Tapas Pascualina Mix Semillas Orali x 500g",
    "label": "Orali",
    "barcode": "7791218122907"
  },
  {
    "code": "7791218123829",
    "name": "(256) Ravioles L. Verde Calabaza Tofu Orali x 500g",
    "description": "(256) Ravioles L. Verde Calabaza Tofu Orali x 500g",
    "label": "Orali",
    "barcode": "7791218123829"
  },
  {
    "code": "7791218123836",
    "name": "(257) Ravioles Linea Verde Remolacha Orali x 500g",
    "description": "(257) Ravioles Linea Verde Remolacha Orali x 500g",
    "label": "Orali",
    "barcode": "7791218123836"
  },
  {
    "code": "7797283001260",
    "name": "(260) Aceitunas Verdes \"0\" Molanes Pote x 1 Kg",
    "description": "(260) Aceitunas Verdes \"0\" Molanes Pote x 1 Kg",
    "label": "Molanes"
  },
  {
    "code": "7791218000502",
    "name": "(260) Fettuccine Linea Verde Medianos Orali x 500g",
    "description": "(260) Fettuccine Linea Verde Medianos Orali x 500g",
    "label": "Orali",
    "barcode": "7791218000502"
  },
  {
    "code": "7791218000496",
    "name": "(261) Ñoquis Integral Y Semilla De Chia orali x 50",
    "description": "(261) Ñoquis Integral Y Semilla De Chia orali x 50",
    "label": "Orali"
  },
  {
    "code": "7798077160262",
    "name": "(262) Membrillo Rubio Profecia x 650 g.",
    "description": "(262) Membrillo Rubio Profecia x 650 g.",
    "label": "Productos Propios"
  },
  {
    "code": "7798077160262",
    "name": "(262) Membrillo Rubio Profecia x 650 g.",
    "description": "(262) Membrillo Rubio Profecia x 650 g.",
    "label": "Dulces en lata"
  },
  {
    "code": "7791218124062",
    "name": "(262) Tortillas Light Luz Azul 12 u. x 440g",
    "description": "(262) Tortillas Light Luz Azul 12 u. x 440g",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "130",
    "name": "(265) Longaniza Baston Fox x Kg",
    "description": "(265) Longaniza Baston Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7798134610273",
    "name": "(273) Queso Tipo Capricho x 150 grs",
    "description": "(273) Queso Tipo Capricho x 150 grs",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "183",
    "name": "(280) Panceta Salada Fox x Kg",
    "description": "(280) Panceta Salada Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "184",
    "name": "(295) Panceta Ahum. Fox x Kg",
    "description": "(295) Panceta Ahum. Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7791218124536",
    "name": "(300) Tapas Empanadas Criolla Orali x 330g",
    "description": "(300) Tapas Empanadas Criolla Orali x 330g",
    "label": "Orali",
    "barcode": "7791218124536"
  },
  {
    "code": "7791218000144",
    "name": "(301) Tapas Pascualina Criolla Orali x 380g",
    "description": "(301) Tapas Pascualina Criolla Orali x 380g",
    "label": "Orali",
    "barcode": "7791218000144"
  },
  {
    "code": "7797283001307",
    "name": "(307) Aceitunas Verdes Nro. 5 Balde x 5 Kg.",
    "description": "(307) Aceitunas Verdes Nro. 5 Balde x 5 Kg.",
    "label": "Molanes"
  },
  {
    "code": "7798259439308",
    "name": "(308) Jugo Pura Frutta Detox x 1 L",
    "description": "(308) Jugo Pura Frutta Detox x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "7793913001662",
    "name": "(313) Arroz con Leche Chocolate Tregar x 180 grs",
    "description": "(313) Arroz con Leche Chocolate Tregar x 180 grs",
    "label": "Tregar",
    "barcode": "7793913001662"
  },
  {
    "code": "7795786000315",
    "name": "(315) Crema x 300 pote",
    "description": "(315) Crema x 300 pote",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798134980321",
    "name": "(321) Conito DDL Cielos Pampeanos x 38g",
    "description": "(321) Conito DDL Cielos Pampeanos x 38g",
    "label": "Luz Azul y quesos",
    "barcode": "7798134980321"
  },
  {
    "code": "7797283003332",
    "name": "(332) Cerezas al Marraschino x 135 grs Molanes",
    "description": "(332) Cerezas al Marraschino x 135 grs Molanes",
    "label": "Molanes"
  },
  {
    "code": "153",
    "name": "(333) Natural 12hs Cocc. Lenta Cagnoli xKg",
    "description": "(333) Natural 12hs Cocc. Lenta Cagnoli xKg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7797283012341",
    "name": "(341) Ac. Negras \"0\" Condimentadas Molanes x 220 g",
    "description": "(341) Ac. Negras \"0\" Condimentadas Molanes x 220 g",
    "label": "Molanes",
    "barcode": "BZ"
  },
  {
    "code": "7798259439353",
    "name": "(353) Jugo Pura Frutta Green Detox x 1 L",
    "description": "(353) Jugo Pura Frutta Green Detox x 1 L",
    "label": "Purafrutta",
    "barcode": "7798259439353"
  },
  {
    "code": "169",
    "name": "(361) Chorizo Precocido Vacio Fox x Kg",
    "description": "(361) Chorizo Precocido Vacio Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7793913001990",
    "name": "(363) Leche Chocolatada Tregar x 1 Lt.",
    "description": "(363) Leche Chocolatada Tregar x 1 Lt.",
    "label": "Tregar",
    "barcode": "7793913001990"
  },
  {
    "code": "107",
    "name": "(371) Fiambre p. Emparedado Chacra 43 x Kg",
    "description": "(371) Fiambre p. Emparedado Chacra 43 x Kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "161",
    "name": "(400) Fiambre 201 Pata de Cerdo Fox x Kg",
    "description": "(400) Fiambre 201 Pata de Cerdo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7791218123966",
    "name": "(400) Tapas Empanadas Sin TACC Orali x 330g",
    "description": "(400) Tapas Empanadas Sin TACC Orali x 330g",
    "label": "Orali",
    "barcode": "7791218123966"
  },
  {
    "code": "7791218123980",
    "name": "(401) Tapas Pascualina Sin TACC Orali x 380g",
    "description": "(401) Tapas Pascualina Sin TACC Orali x 380g",
    "label": "Orali",
    "barcode": "7791218123980"
  },
  {
    "code": "7791218123997",
    "name": "(402) Tapa Rotisera sin TACC Orali x 460g",
    "description": "(402) Tapa Rotisera sin TACC Orali x 460g",
    "label": "Orali",
    "barcode": "7791218123997"
  },
  {
    "code": "166",
    "name": "(403) Fiam Pata de Cerdo Fox x Kg",
    "description": "(403) Fiam Pata de Cerdo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "168",
    "name": "(404) Fiambre Fox Oval Pata Cerdo x Kg",
    "description": "(404) Fiambre Fox Oval Pata Cerdo x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "165",
    "name": "(405) Fiambre 201 Pata Cerdo Rect. Fox x Kg",
    "description": "(405) Fiambre 201 Pata Cerdo Rect. Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "194",
    "name": "(406) Fiambre Paleta Fox x Kg",
    "description": "(406) Fiambre Paleta Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "170",
    "name": "(408) Fiam Paleta Oval Fox x Kg",
    "description": "(408) Fiam Paleta Oval Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7797283213410",
    "name": "(410) Ac. Rellenas \"0\" Salmuera Molanes x 2 Kg",
    "description": "(410) Ac. Rellenas \"0\" Salmuera Molanes x 2 Kg",
    "label": "Molanes",
    "barcode": "BM"
  },
  {
    "code": "195",
    "name": "(413) Fiam Cerdo Cocido Fox x Kg",
    "description": "(413) Fiam Cerdo Cocido Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7795786000414",
    "name": "(414) Dulce Familiar x 1 kg Luz Azul",
    "description": "(414) Dulce Familiar x 1 kg Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "148",
    "name": "(417) Fiambre de Pollo y Cerdo Fox x Kg",
    "description": "(417) Fiambre de Pollo y Cerdo Fox x Kg",
    "label": "Fiambres Fox"
  },
  {
    "code": "7791108031418",
    "name": "(418) Queso Reggianito en Hebras x 135 g",
    "description": "(418) Queso Reggianito en Hebras x 135 g",
    "label": "Otros de terceros"
  },
  {
    "code": "7795786000421",
    "name": "(421) Dulce Familiar sin TACC x 400 Luz Azul",
    "description": "(421) Dulce Familiar sin TACC x 400 Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7797283054426",
    "name": "(426) Ac. Verdes Desc. \"00\" Molanes x 320g",
    "description": "(426) Ac. Verdes Desc. \"00\" Molanes x 320g",
    "label": "Molanes"
  },
  {
    "code": "7797283005442",
    "name": "(442) Aceitunas Verdes Desc. Molanes x 1.5 Kg",
    "description": "(442) Aceitunas Verdes Desc. Molanes x 1.5 Kg",
    "label": "Molanes"
  },
  {
    "code": "7795786000445",
    "name": "(445) Dulce Repostero sin TACC x 400 Luz Azul",
    "description": "(445) Dulce Repostero sin TACC x 400 Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7797283002458",
    "name": "(458) Ac. Negras Griega Aceite Molanes x 220 g",
    "description": "(458) Ac. Negras Griega Aceite Molanes x 220 g",
    "label": "Molanes",
    "barcode": "BY"
  },
  {
    "code": "7797283213465",
    "name": "(465) Ac. Verdes Rellenas Molanes Pote x 1 Kg",
    "description": "(465) Ac. Verdes Rellenas Molanes Pote x 1 Kg",
    "label": "Molanes"
  },
  {
    "code": "7797283005466",
    "name": "(466) Aceitunas Verdes Desc. Molanes x 170 g",
    "description": "(466) Aceitunas Verdes Desc. Molanes x 170 g",
    "label": "Molanes"
  },
  {
    "code": "7797283213472",
    "name": "(472) Ac. Rellena \"00\" Salmuera Molanes x 430g",
    "description": "(472) Ac. Rellena \"00\" Salmuera Molanes x 430g",
    "label": "Molanes",
    "barcode": "CA"
  },
  {
    "code": "7797283005473",
    "name": "(473) Ac. Verdes Desc. Molanes Pote x 800 grs",
    "description": "(473) Ac. Verdes Desc. Molanes Pote x 800 grs",
    "label": "Molanes"
  },
  {
    "code": "7797283003479",
    "name": "(479) Ac. Rellenas \"0\" Salmuera Molanes x 220 g",
    "description": "(479) Ac. Rellenas \"0\" Salmuera Molanes x 220 g",
    "label": "Molanes",
    "barcode": "BX"
  },
  {
    "code": "7797283003493",
    "name": "(493) Aceitunas Verdes Rellena Molanes x 100 g",
    "description": "(493) Aceitunas Verdes Rellena Molanes x 100 g",
    "label": "Molanes"
  },
  {
    "code": "7797283005497",
    "name": "(497) Aceitunas Verdes Desc. Molanes x 80 g",
    "description": "(497) Aceitunas Verdes Desc. Molanes x 80 g",
    "label": "Molanes",
    "barcode": "BV"
  },
  {
    "code": "7798013108068",
    "name": "(500) Salamin Tandilero picante ATM x 145 gr",
    "description": "(500) Salamin Tandilero picante ATM x 145 gr",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "501",
    "name": "(501) Paleta Oferta Fox",
    "description": "(501) Paleta Oferta Fox",
    "label": "Fiambres Fox"
  },
  {
    "code": "7798013108082",
    "name": "(501) Salamin Ahumado ATM Cagnoli X 150 GR",
    "description": "(501) Salamin Ahumado ATM Cagnoli X 150 GR",
    "label": "Fiambres Cagnoli",
    "barcode": "7798013108082"
  },
  {
    "code": "7798013108075",
    "name": "(503) Salamin a las F/Hierbas ATM Cagnoli x 145 gr",
    "description": "(503) Salamin a las F/Hierbas ATM Cagnoli x 145 gr",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7798259439506",
    "name": "(506) Jugo Pura Frutta MultiFruta x 1 L",
    "description": "(506) Jugo Pura Frutta MultiFruta x 1 L",
    "label": "Purafrutta"
  },
  {
    "code": "7797283003516",
    "name": "(516) Pepinos Agridulces x 2 Kg Molanes",
    "description": "(516) Pepinos Agridulces x 2 Kg Molanes",
    "label": "Molanes",
    "barcode": "BO"
  },
  {
    "code": "7798411850590",
    "name": "(5200) Chimichurri Ahumado Locos x el Asado 45 gr",
    "description": "(5200) Chimichurri Ahumado Locos x el Asado 45 gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850583",
    "name": "(5201) Chimichurri Gourmet Locos x El Asado x 45gr",
    "description": "(5201) Chimichurri Gourmet Locos x El Asado x 45gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7797283002533",
    "name": "(533) Anchoa en Aceite Molanes x 120 grs",
    "description": "(533) Anchoa en Aceite Molanes x 120 grs",
    "label": "Molanes"
  },
  {
    "code": "7798259439537",
    "name": "(537) Jugo Pura Frutta Naranja Salustiana x 1 lt",
    "description": "(537) Jugo Pura Frutta Naranja Salustiana x 1 lt",
    "label": "Purafrutta"
  },
  {
    "code": "7797283002540",
    "name": "(540) Anchoa en Aceite Molanes x 70 grs",
    "description": "(540) Anchoa en Aceite Molanes x 70 grs",
    "label": "Molanes"
  },
  {
    "code": "7797283005541",
    "name": "(541) Pasta De Ac. Verdes Molanes  x 150 gr",
    "description": "(541) Pasta De Ac. Verdes Molanes  x 150 gr",
    "label": "Molanes"
  },
  {
    "code": "7797283003547",
    "name": "(547) Pepinos Agridulces x 220 grs Molanes",
    "description": "(547) Pepinos Agridulces x 220 grs Molanes",
    "label": "Molanes"
  },
  {
    "code": "7798013107726",
    "name": "(558) Leberwurst Cagnoli (200 grs) x Unid",
    "description": "(558) Leberwurst Cagnoli (200 grs) x Unid",
    "label": "Fiambres Cagnoli",
    "barcode": "7798013107726"
  },
  {
    "code": "7798013108181",
    "name": "(559) Mortadela Con Pistachos Cagnoli x 250 gr",
    "description": "(559) Mortadela Con Pistachos Cagnoli x 250 gr",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7797283002571",
    "name": "(571) Anchoa en Aceite Sobre x 3 Molanes",
    "description": "(571) Anchoa en Aceite Sobre x 3 Molanes",
    "label": "Molanes"
  },
  {
    "code": "7798259439582",
    "name": "(582) Jugo Pura Frutta Naranja x 200 ml",
    "description": "(582) Jugo Pura Frutta Naranja x 200 ml",
    "label": "Purafrutta"
  },
  {
    "code": "7797283005848",
    "name": "(593) Champignones al Natural Molanes x 210 g",
    "description": "(593) Champignones al Natural Molanes x 210 g",
    "label": "Molanes"
  },
  {
    "code": "7797283006043",
    "name": "(604) Aceitunas Verdes Rodajas molanes x 170 gr",
    "description": "(604) Aceitunas Verdes Rodajas molanes x 170 gr",
    "label": "Molanes"
  },
  {
    "code": "7798259439605",
    "name": "(605) Jugo Pura Frutta Manzana  x 250ml",
    "description": "(605) Jugo Pura Frutta Manzana  x 250ml",
    "label": "Purafrutta",
    "barcode": "7798259439605"
  },
  {
    "code": "7798259439612",
    "name": "(612) Jugo Pura Frutta Multifruta  x 250ml",
    "description": "(612) Jugo Pura Frutta Multifruta  x 250ml",
    "label": "Purafrutta",
    "barcode": "7798259439612"
  },
  {
    "code": "7797283002618",
    "name": "(618) Pickles en Vinagre Molanes x 2 Kg",
    "description": "(618) Pickles en Vinagre Molanes x 2 Kg",
    "label": "Molanes"
  },
  {
    "code": "7798259439629",
    "name": "(629) Jugo Pura Frutta Naranja  x 250ml",
    "description": "(629) Jugo Pura Frutta Naranja  x 250ml",
    "label": "Purafrutta",
    "barcode": "7798259439629"
  },
  {
    "code": "7795786000629",
    "name": "(629) Miel x 1 Kg Luz Azul",
    "description": "(629) Miel x 1 Kg Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7795786000636",
    "name": "(636) Alfajor Maicena Luz Azul x 50 grs",
    "description": "(636) Alfajor Maicena Luz Azul x 50 grs",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7797283005640",
    "name": "(640) Pasta De Ac. Negras Molanes x 150 gr",
    "description": "(640) Pasta De Ac. Negras Molanes x 150 gr",
    "label": "Molanes"
  },
  {
    "code": "7795786000643",
    "name": "(643) Alfajor Chocolate Luz Azul x 50 grs",
    "description": "(643) Alfajor Chocolate Luz Azul x 50 grs",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7797283002649",
    "name": "(649) Pickles en Vinagre Molanes x 220 g",
    "description": "(649) Pickles en Vinagre Molanes x 220 g",
    "label": "Molanes",
    "barcode": "BR"
  },
  {
    "code": "7795786000650",
    "name": "(650) Miel x 1/2 Kg Luz Azul",
    "description": "(650) Miel x 1/2 Kg Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7795786000681",
    "name": "(681) Queso Cream Luz Azul x 300 g",
    "description": "(681) Queso Cream Luz Azul x 300 g",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7795786000698",
    "name": "(698) Queso Cream Light Luz Azul x 300 g",
    "description": "(698) Queso Cream Light Luz Azul x 300 g",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7791218123737",
    "name": "(710) Pionono Orali x 180g",
    "description": "(710) Pionono Orali x 180g",
    "label": "Orali",
    "barcode": "7791218123737"
  },
  {
    "code": "7798259439711",
    "name": "(711) Jugo Pura Frutta Pera x 1 L",
    "description": "(711) Jugo Pura Frutta Pera x 1 L",
    "label": "Purafrutta",
    "barcode": "7798259439711"
  },
  {
    "code": "7798411850057",
    "name": "(721) Sal Marina 7 especias Art. Gourmet x 120gr",
    "description": "(721) Sal Marina 7 especias Art. Gourmet x 120gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798259439728",
    "name": "(728) Jugo Pura Frutta Pera x 250ml",
    "description": "(728) Jugo Pura Frutta Pera x 250ml",
    "label": "Purafrutta",
    "barcode": "7798259439728"
  },
  {
    "code": "502",
    "name": "(73) Jamon Cocido Horneado Cagnoli x kg",
    "description": "(73) Jamon Cocido Horneado Cagnoli x kg",
    "label": "Fiambres Cagnoli"
  },
  {
    "code": "7795786000742",
    "name": "(742) Queso Rallado Luz Azul x 100gr",
    "description": "(742) Queso Rallado Luz Azul x 100gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7797283002748",
    "name": "(748) Ajies Despuntado Vinagre Molanes x 125 g",
    "description": "(748) Ajies Despuntado Vinagre Molanes x 125 g",
    "label": "Molanes"
  },
  {
    "code": "7798013106910",
    "name": "(75) Mortadela Tandilera Cagnoli (300 grs) x Unid",
    "description": "(75) Mortadela Tandilera Cagnoli (300 grs) x Unid",
    "label": "Fiambres Cagnoli",
    "barcode": "7798013106910"
  },
  {
    "code": "7795786000759",
    "name": "(759) Muzzarella Luz Azul x 500g",
    "description": "(759) Muzzarella Luz Azul x 500g",
    "label": "Luz Azul y quesos",
    "barcode": "7795786000759"
  },
  {
    "code": "7795786000797",
    "name": "(797) Manteca Luz Azul x 200 gr",
    "description": "(797) Manteca Luz Azul x 200 gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7797283002816",
    "name": "(816) Pepinillos en Vinagre x 2 Kg Molanes",
    "description": "(816) Pepinillos en Vinagre x 2 Kg Molanes",
    "label": "Molanes"
  },
  {
    "code": "7793913000504",
    "name": "(82) Arroz con Leche Light Tregar x 180 grs",
    "description": "(82) Arroz con Leche Light Tregar x 180 grs",
    "label": "Tregar",
    "barcode": "7793913000504"
  },
  {
    "code": "7793913001822",
    "name": "(822) Leche Entera UAT Tregar",
    "description": "(822) Leche Entera UAT Tregar",
    "label": "Tregar",
    "barcode": "7793913001822"
  },
  {
    "code": "7797283002847",
    "name": "(847) Pepinillos en Vinagre x 220 grs Molanes",
    "description": "(847) Pepinillos en Vinagre x 220 grs Molanes",
    "label": "Molanes",
    "barcode": "BT"
  },
  {
    "code": "7797830013906",
    "name": "(906) Aceitunas Verdes Nro. 5 Molanes x 100 g",
    "description": "(906) Aceitunas Verdes Nro. 5 Molanes x 100 g",
    "label": "Molanes",
    "barcode": "BU"
  },
  {
    "code": "7797283005930",
    "name": "(930) Champignones al Natural Molanes x 210 g",
    "description": "(930) Champignones al Natural Molanes x 210 g",
    "label": "Molanes"
  },
  {
    "code": "7797283002946",
    "name": "(946) Cebollitas en Vinagre x 220 grs Molanes",
    "description": "(946) Cebollitas en Vinagre x 220 grs Molanes",
    "label": "Molanes"
  },
  {
    "code": "7797283001949",
    "name": "(949) Aceitunas Negras \"0\" Molanes x 220 grs",
    "description": "(949) Aceitunas Negras \"0\" Molanes x 220 grs",
    "label": "Molanes"
  },
  {
    "code": "346",
    "name": "(95) Fiambrin La Familia x Kg",
    "description": "(95) Fiambrin La Familia x Kg",
    "label": "Otros de terceros"
  },
  {
    "code": "7797283551963",
    "name": "(963) Aceitunas Negras \"0\" Molanes Pote x 1 Kg",
    "description": "(963) Aceitunas Negras \"0\" Molanes Pote x 1 Kg",
    "label": "Molanes"
  },
  {
    "code": "7798411850316",
    "name": "(966) Sal Parrillera Gourmet x 120",
    "description": "(966) Sal Parrillera Gourmet x 120",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850323",
    "name": "(967) Sal Patagonica Gourmet x 120gr",
    "description": "(967) Sal Patagonica Gourmet x 120gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7798411850231",
    "name": "(974) Zanahorias al Curry Art. Gourmet x 45gr",
    "description": "(974) Zanahorias al Curry Art. Gourmet x 45gr",
    "label": "Locos por el Asado"
  },
  {
    "code": "7791218122808",
    "name": "(99) Tapas Copetin Hojaldre Orali x 190g",
    "description": "(99) Tapas Copetin Hojaldre Orali x 190g",
    "label": "Orali",
    "barcode": "7791218122808"
  },
  {
    "code": "7797283001994",
    "name": "(994) Aceitunas Negras \"0\" Molanes x 100 g",
    "description": "(994) Aceitunas Negras \"0\" Molanes x 100 g",
    "label": "Molanes"
  },
  {
    "code": "7793913012996",
    "name": "(996) Leche Descremada UAT tregar",
    "description": "(996) Leche Descremada UAT tregar",
    "label": "Tregar"
  },
  {
    "code": "644",
    "name": "(C144) Mortadela con Pistacho Boccati x Kg",
    "description": "(C144) Mortadela con Pistacho Boccati x Kg",
    "label": "Colitas"
  },
  {
    "code": "650",
    "name": "(C150) Crudo Parma Fox x Kg",
    "description": "(C150) Crudo Parma Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "254",
    "name": "Ac. Verdes Feteadas Molanes x Kg",
    "description": "Ac. Verdes Feteadas Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "251",
    "name": "Aceit. Negras \"0\" Molanes x Kg",
    "description": "Aceit. Negras \"0\" Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "263",
    "name": "Aceit. Negras \"00\" Molanes x Kg",
    "description": "Aceit. Negras \"00\" Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "248",
    "name": "Aceit. Negras 000 Molanes x Kg",
    "description": "Aceit. Negras 000 Molanes x Kg",
    "label": "Molanes",
    "barcode": "248"
  },
  {
    "code": "264",
    "name": "Aceit. Negras Desc  Molanes x Kg",
    "description": "Aceit. Negras Desc  Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "289",
    "name": "Aceit. Negras Feteadas Molanes x Kg",
    "description": "Aceit. Negras Feteadas Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "250",
    "name": "Aceit. Verdes \"0\" Molanes x Kg",
    "description": "Aceit. Verdes \"0\" Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "249",
    "name": "Aceit. Verdes \"00\" Molanes x Kg",
    "description": "Aceit. Verdes \"00\" Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "252",
    "name": "Aceit. Verdes Desc. Molanes x Kg",
    "description": "Aceit. Verdes Desc. Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "253",
    "name": "Aceit. Verdes Rellenas Molanes x Kg",
    "description": "Aceit. Verdes Rellenas Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "351",
    "name": "Aceitunas Negras c/carozo Oferta x kg",
    "description": "Aceitunas Negras c/carozo Oferta x kg",
    "label": "Molanes"
  },
  {
    "code": "7797283031137",
    "name": "Aceitunas Verdes 000 x 380 gr",
    "description": "Aceitunas Verdes 000 x 380 gr",
    "label": "Molanes",
    "barcode": "7797283031137"
  },
  {
    "code": "7797283002755",
    "name": "Ajies condimentados en aceite molanes x 220 gr",
    "description": "Ajies condimentados en aceite molanes x 220 gr",
    "label": "Molanes",
    "barcode": "7797283002755"
  },
  {
    "code": "337",
    "name": "Azul Ahumado x Kg",
    "description": "Azul Ahumado x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "301",
    "name": "Azul Entero x Kg",
    "description": "Azul Entero x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "751",
    "name": "Banana Chips 140gr",
    "description": "Banana Chips 140gr",
    "label": "Productos Propios"
  },
  {
    "code": "321",
    "name": "Barra Ahumada x Kg",
    "description": "Barra Ahumada x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "053",
    "name": "Barra Pategras Ahora! x Kg",
    "description": "Barra Pategras Ahora! x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "009",
    "name": "Barra Pategras Luz Azul x Kg",
    "description": "Barra Pategras Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "731",
    "name": "Benedetto - Pan Arabe x 2",
    "description": "Benedetto - Pan Arabe x 2",
    "label": "Productos Propios"
  },
  {
    "code": "732",
    "name": "Benedetto - Pan Chips x 500 gr",
    "description": "Benedetto - Pan Chips x 500 gr",
    "label": "Productos Propios"
  },
  {
    "code": "733",
    "name": "Benedetto - Pan Ciabatta x 5",
    "description": "Benedetto - Pan Ciabatta x 5",
    "label": "Productos Propios"
  },
  {
    "code": "729",
    "name": "Benedetto - Pan de Campo Grande",
    "description": "Benedetto - Pan de Campo Grande",
    "label": "Productos Propios"
  },
  {
    "code": "736",
    "name": "Benedetto - Pan de masa madre",
    "description": "Benedetto - Pan de masa madre",
    "label": "Productos Propios"
  },
  {
    "code": "735",
    "name": "Benedetto - Pan de Zapallo chico",
    "description": "Benedetto - Pan de Zapallo chico",
    "label": "Productos Propios"
  },
  {
    "code": "730",
    "name": "Benedetto - Pan Integral con Semillas Chico",
    "description": "Benedetto - Pan Integral con Semillas Chico",
    "label": "Productos Propios"
  },
  {
    "code": "734",
    "name": "Benedetto - Pan Integral con Semillas Grande",
    "description": "Benedetto - Pan Integral con Semillas Grande",
    "label": "Productos Propios"
  },
  {
    "code": "268",
    "name": "Boconccino Festa x 1 Kg.",
    "description": "Boconccino Festa x 1 Kg.",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798134610402",
    "name": "Brie Cabra x 250 grs",
    "description": "Brie Cabra x 250 grs",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798158630264",
    "name": "Burratina Capresse x 150 gr",
    "description": "Burratina Capresse x 150 gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798158630271",
    "name": "Burratina Clasica x 150 gr",
    "description": "Burratina Clasica x 150 gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798158630226",
    "name": "Burratina Tartufo x 150 gr",
    "description": "Burratina Tartufo x 150 gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798158630240",
    "name": "Burratina Tartufo x 150 gr",
    "description": "Burratina Tartufo x 150 gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "609",
    "name": "C009 Barra Pategras x Kg",
    "description": "C009 Barra Pategras x Kg",
    "label": "Colitas"
  },
  {
    "code": "614",
    "name": "C014 Parrillero x Kg",
    "description": "C014 Parrillero x Kg",
    "label": "Colitas"
  },
  {
    "code": "615",
    "name": "C015 Cocido Natural Fox x Kg",
    "description": "C015 Cocido Natural Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "616",
    "name": "C016 Cheddar x Kg",
    "description": "C016 Cheddar x Kg",
    "label": "Colitas"
  },
  {
    "code": "630",
    "name": "C030 Muzza Barra x Kg",
    "description": "C030 Muzza Barra x Kg",
    "label": "Colitas"
  },
  {
    "code": "610",
    "name": "C110 Mortadela Bocha Cagnoli x Kg",
    "description": "C110 Mortadela Bocha Cagnoli x Kg",
    "label": "Colitas"
  },
  {
    "code": "611",
    "name": "C111 Crudo Et.Beige Listo x Kg",
    "description": "C111 Crudo Et.Beige Listo x Kg",
    "label": "Colitas"
  },
  {
    "code": "612",
    "name": "C112  Jamon Cocido Cagnoli (P. grande) x Kg",
    "description": "C112  Jamon Cocido Cagnoli (P. grande) x Kg",
    "label": "Colitas"
  },
  {
    "code": "613",
    "name": "C113 Pernil de Cerdo Cagnoli Pieza Grande x Kg",
    "description": "C113 Pernil de Cerdo Cagnoli Pieza Grande x Kg",
    "label": "Colitas"
  },
  {
    "code": "618",
    "name": "C118 Jamon Crudo Cagnoli x Kg",
    "description": "C118 Jamon Crudo Cagnoli x Kg",
    "label": "Colitas"
  },
  {
    "code": "619",
    "name": "C119 Panceta Ahumada Cagnoli x Kg",
    "description": "C119 Panceta Ahumada Cagnoli x Kg",
    "label": "Colitas"
  },
  {
    "code": "622",
    "name": "C122 Cocido Et Negra Fox x Kg",
    "description": "C122 Cocido Et Negra Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "628",
    "name": "C128 Lomo Ahumado Fox x Kg",
    "description": "C128 Lomo Ahumado Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "634",
    "name": "C134 Queso de Cerdo Redondo Fox x Kg",
    "description": "C134 Queso de Cerdo Redondo Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "635",
    "name": "C135 Mortadela Bologna Fox x Kg",
    "description": "C135 Mortadela Bologna Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "636",
    "name": "C136 Mortadela Bocha Fox x Kg",
    "description": "C136 Mortadela Bocha Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "637",
    "name": "C137 Morcillon con Lengua Fox x Kg",
    "description": "C137 Morcillon con Lengua Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "638",
    "name": "C138 Jamon Crudo 1/2 Listo Don Jose",
    "description": "C138 Jamon Crudo 1/2 Listo Don Jose",
    "label": "Colitas"
  },
  {
    "code": "640",
    "name": "C140 Matambre Vaca Fox x Kg",
    "description": "C140 Matambre Vaca Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "641",
    "name": "C141 Arroll Pollo Fox x Kg",
    "description": "C141 Arroll Pollo Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "642",
    "name": "C142 Lomo Ahumado Rogigiano Tapalque x Kg",
    "description": "C142 Lomo Ahumado Rogigiano Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "643",
    "name": "C143 Cantimpalo Fox x Kg",
    "description": "C143 Cantimpalo Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "645",
    "name": "C145 Jamon Crudo Fox x Kg",
    "description": "C145 Jamon Crudo Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "647",
    "name": "C147 Cocido Et. Negra Rectangular Fox x Kg",
    "description": "C147 Cocido Et. Negra Rectangular Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "648",
    "name": "C148 Fiam Pollo/Cerdo Fox x Kg",
    "description": "C148 Fiam Pollo/Cerdo Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "651",
    "name": "C151 Salame Milan 201 x Kg",
    "description": "C151 Salame Milan 201 x Kg",
    "label": "Colitas"
  },
  {
    "code": "652",
    "name": "C152 Jamon Cocido Linea Oro x Kg",
    "description": "C152 Jamon Cocido Linea Oro x Kg",
    "label": "Colitas"
  },
  {
    "code": "653",
    "name": "C153 Natural 12hs Coccion Lenta Cagnoli x Kg",
    "description": "C153 Natural 12hs Coccion Lenta Cagnoli x Kg",
    "label": "Colitas"
  },
  {
    "code": "629",
    "name": "C153 Natural Cagnoli Cocción Lenta",
    "description": "C153 Natural Cagnoli Cocción Lenta",
    "label": "Colitas"
  },
  {
    "code": "654",
    "name": "C154 Cocido Roggiano Tapalque x Kg",
    "description": "C154 Cocido Roggiano Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "657",
    "name": "C157 Salch Primavera Fox x Kg",
    "description": "C157 Salch Primavera Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "658",
    "name": "C158 Salch c/Jamon Fox x Kg",
    "description": "C158 Salch c/Jamon Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "659",
    "name": "C159 Cocido Ahumado Roggiano Tapalque x Kg",
    "description": "C159 Cocido Ahumado Roggiano Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "660",
    "name": "C160 Bondiola Fox x Kg",
    "description": "C160 Bondiola Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "662",
    "name": "C161 Pata de Cerdo 201 x Kg",
    "description": "C161 Pata de Cerdo 201 x Kg",
    "label": "Colitas"
  },
  {
    "code": "601",
    "name": "C162 Fiambre Paleta Cerdo Tapalque x Kg",
    "description": "C162 Fiambre Paleta Cerdo Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "665",
    "name": "C165 Fiambre 201 Rectangular Fox x Kg",
    "description": "C165 Fiambre 201 Rectangular Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "666",
    "name": "C166 Pata Cerdo Fox x Kg",
    "description": "C166 Pata Cerdo Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "671",
    "name": "C171 Fiam Coc Oval Cerdo Fox x Kg",
    "description": "C171 Fiam Coc Oval Cerdo Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "675",
    "name": "C175 Fiambrin La Serenisima x Kg",
    "description": "C175 Fiambrin La Serenisima x Kg",
    "label": "Colitas"
  },
  {
    "code": "676",
    "name": "C176 Matambre Vaca Dragone x Kg",
    "description": "C176 Matambre Vaca Dragone x Kg",
    "label": "Colitas"
  },
  {
    "code": "677",
    "name": "C177 Arroll Pollo Dragone x Kg",
    "description": "C177 Arroll Pollo Dragone x Kg",
    "label": "Colitas"
  },
  {
    "code": "682",
    "name": "C182 Salame Milan Fox x Kg",
    "description": "C182 Salame Milan Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "683",
    "name": "C183 Panceta Salada Fox x Kg",
    "description": "C183 Panceta Salada Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "684",
    "name": "C184 Panceta Ahum Fox x Kg",
    "description": "C184 Panceta Ahum Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "691",
    "name": "C191 Salam Crespon Fox x Kg",
    "description": "C191 Salam Crespon Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "694",
    "name": "C194 Fiambre Paleta Fox x Kg",
    "description": "C194 Fiambre Paleta Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "695",
    "name": "C195 Fiambre Cocido Cerdo Fox x Kg",
    "description": "C195 Fiambre Cocido Cerdo Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "699",
    "name": "C199 Lomo F/Hierbas Cagnoli x Kg",
    "description": "C199 Lomo F/Hierbas Cagnoli x Kg",
    "label": "Colitas"
  },
  {
    "code": "620",
    "name": "C216 Pastron Ahumado x Kg",
    "description": "C216 Pastron Ahumado x Kg",
    "label": "Colitas"
  },
  {
    "code": "602",
    "name": "C220 Bondiola Tapalque x Kg",
    "description": "C220 Bondiola Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "661",
    "name": "C221 Lomo Suizo Tapalque",
    "description": "C221 Lomo Suizo Tapalque",
    "label": "Colitas"
  },
  {
    "code": "603",
    "name": "C243 Lomo Serrano Tapalque x Kg",
    "description": "C243 Lomo Serrano Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "633",
    "name": "C244 Panceta Ahumada Tapalque x Kg",
    "description": "C244 Panceta Ahumada Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "687",
    "name": "C287  Jamon F/ Hierbas Roggiano Tapalque x Kg",
    "description": "C287  Jamon F/ Hierbas Roggiano Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "655",
    "name": "C297 Panceta Doble Tiernizada Tapalque x Kg",
    "description": "C297 Panceta Doble Tiernizada Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "632",
    "name": "C298 Panceta Salada Tapalque x Kg",
    "description": "C298 Panceta Salada Tapalque x Kg",
    "label": "Colitas"
  },
  {
    "code": "608",
    "name": "C299 Colita Lomo Finas Hierbas Fox x Kg",
    "description": "C299 Colita Lomo Finas Hierbas Fox x Kg",
    "label": "Colitas"
  },
  {
    "code": "623",
    "name": "C321 Barra Ahumada x Kg",
    "description": "C321 Barra Ahumada x Kg",
    "label": "Colitas"
  },
  {
    "code": "604",
    "name": "C350 (094) Lomo Ahumado Don Jose x Kg",
    "description": "C350 (094) Lomo Ahumado Don Jose x Kg",
    "label": "Colitas"
  },
  {
    "code": "631",
    "name": "C362 Jamon Natural Puente De Ronda kg",
    "description": "C362 Jamon Natural Puente De Ronda kg",
    "label": "Colitas"
  },
  {
    "code": "663",
    "name": "C363 (103) Jamon Cocido Puentes de ronda x kg",
    "description": "C363 (103) Jamon Cocido Puentes de ronda x kg",
    "label": "Colitas"
  },
  {
    "code": "664",
    "name": "C364 (014) Fiambre De Paleta Puentes De Ronda x kg",
    "description": "C364 (014) Fiambre De Paleta Puentes De Ronda x kg",
    "label": "Colitas"
  },
  {
    "code": "605",
    "name": "C369 (136)Lomo Ahumado Finas Hierbas Don Jose x kg",
    "description": "C369 (136)Lomo Ahumado Finas Hierbas Don Jose x kg",
    "label": "Colitas"
  },
  {
    "code": "607",
    "name": "C370 (116) Bondiola Don Jose x kg",
    "description": "C370 (116) Bondiola Don Jose x kg",
    "label": "Colitas"
  },
  {
    "code": "606",
    "name": "C371 (076) Jamon Natural Bajo En Sodio Don Jose",
    "description": "C371 (076) Jamon Natural Bajo En Sodio Don Jose",
    "label": "Colitas"
  },
  {
    "code": "646",
    "name": "C646 Fiambrin La Familia x Kg",
    "description": "C646 Fiambrin La Familia x Kg",
    "label": "Colitas"
  },
  {
    "code": "310",
    "name": "Cacciotita Ahumada x Kg",
    "description": "Cacciotita Ahumada x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "779064500342",
    "name": "CARACAS - Anchoa en aceite x 170 grs",
    "description": "CARACAS - Anchoa en aceite x 170 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7790645003421",
    "name": "CARACAS - Anchoa en aceite x 170 grs",
    "description": "CARACAS - Anchoa en aceite x 170 grs",
    "label": "Productos Propios"
  },
  {
    "code": "061",
    "name": "Caramelo de Dulce de Leche",
    "description": "Caramelo de Dulce de Leche",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "262",
    "name": "Cerezas al Marraschino Molanes x Kg",
    "description": "Cerezas al Marraschino Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "016",
    "name": "Cheddar Luz Azul x Kg",
    "description": "Cheddar Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "208",
    "name": "Chorizo Parrillero 6u Friolim",
    "description": "Chorizo Parrillero 6u Friolim",
    "label": "Productos Propios"
  },
  {
    "code": "649",
    "name": "Colita Jamon Crudo s/Cuero x Kg",
    "description": "Colita Jamon Crudo s/Cuero x Kg",
    "label": "Colitas"
  },
  {
    "code": "627",
    "name": "Colita Salame Milan Tapalque",
    "description": "Colita Salame Milan Tapalque",
    "label": "Colitas"
  },
  {
    "code": "7798060852389",
    "name": "Crema tonadita x 4 lts",
    "description": "Crema tonadita x 4 lts",
    "label": "Otros de terceros"
  },
  {
    "code": "036",
    "name": "Crema x 5 Luz Azul",
    "description": "Crema x 5 Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "051",
    "name": "Cremoso Ahora! x Kg",
    "description": "Cremoso Ahora! x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "001",
    "name": "Cremoso Luz Azul x Kg",
    "description": "Cremoso Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "040",
    "name": "Dulce Familiar x 10 Luz Azul",
    "description": "Dulce Familiar x 10 Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "043",
    "name": "Dulce Repostero x 10 Luz Azul",
    "description": "Dulce Repostero x 10 Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "044",
    "name": "Dulce Repostero x 5 Luz Azul",
    "description": "Dulce Repostero x 5 Luz Azul",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "007",
    "name": "Fontina Luz Azul x Kg",
    "description": "Fontina Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7795165000158",
    "name": "FRIOLIM - Chorizo Alemán x 3 uds (158)",
    "description": "FRIOLIM - Chorizo Alemán x 3 uds (158)",
    "label": "Productos Propios",
    "barcode": "7795165000011"
  },
  {
    "code": "203",
    "name": "FRIOLIM - Leberwurst Cebolla Verdeo  x Kg",
    "description": "FRIOLIM - Leberwurst Cebolla Verdeo  x Kg",
    "label": "Productos Propios"
  },
  {
    "code": "260",
    "name": "FRIOLIM - Leberwurst Clásico x Kg",
    "description": "FRIOLIM - Leberwurst Clásico x Kg",
    "label": "Productos Propios"
  },
  {
    "code": "261",
    "name": "FRIOLIM - Leberwurst con Trufas x Kg",
    "description": "FRIOLIM - Leberwurst con Trufas x Kg",
    "label": "Productos Propios"
  },
  {
    "code": "205",
    "name": "FRIOLIM - Leberwurst Finas Hierbas x Kg",
    "description": "FRIOLIM - Leberwurst Finas Hierbas x Kg",
    "label": "Productos Propios"
  },
  {
    "code": "201",
    "name": "FRIOLIM - Leberwurst Pimienta Verde x Kg",
    "description": "FRIOLIM - Leberwurst Pimienta Verde x Kg",
    "label": "Productos Propios"
  },
  {
    "code": "7795165000141",
    "name": "FRIOLIM - Salchicha Alemana Copetín x 25 uds (141)",
    "description": "FRIOLIM - Salchicha Alemana Copetín x 25 uds (141)",
    "label": "Productos Propios"
  },
  {
    "code": "7795165000165",
    "name": "FRIOLIM - Salchicha Alemana x 4 uds (165)",
    "description": "FRIOLIM - Salchicha Alemana x 4 uds (165)",
    "label": "Productos Propios",
    "barcode": "7795165000165"
  },
  {
    "code": "7795165000172",
    "name": "FRIOLIM - Salchicha Alemana x 5 uds (172)",
    "description": "FRIOLIM - Salchicha Alemana x 5 uds (172)",
    "label": "Productos Propios"
  },
  {
    "code": "7795165000127",
    "name": "FRIOLIM - Salchicha Debreczin x 4 uds (127)",
    "description": "FRIOLIM - Salchicha Debreczin x 4 uds (127)",
    "label": "Productos Propios",
    "barcode": "7795165000080"
  },
  {
    "code": "7795165000097",
    "name": "FRIOLIM - Salchicha Viena Clásica x 6 uds (223)",
    "description": "FRIOLIM - Salchicha Viena Clásica x 6 uds (223)",
    "label": "Productos Propios",
    "barcode": "7795165000097"
  },
  {
    "code": "008",
    "name": "Gouda Luz Azul x Kg",
    "description": "Gouda Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "015",
    "name": "Gouda Sin Sal Agregada Luz Azul x Kg",
    "description": "Gouda Sin Sal Agregada Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "312",
    "name": "Goudita Ahumado x Kg",
    "description": "Goudita Ahumado x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "010",
    "name": "Gruyere Luz Azul x Kg",
    "description": "Gruyere Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7794000006188",
    "name": "HELLMANS - Ketchup x 250 grs",
    "description": "HELLMANS - Ketchup x 250 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7794000006065",
    "name": "HELLMANS - Mayonesa Clásica x 237 grs",
    "description": "HELLMANS - Mayonesa Clásica x 237 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7794000006072",
    "name": "HELLMANS - Mayonesa Clásica x 475 grs",
    "description": "HELLMANS - Mayonesa Clásica x 475 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7794000007093",
    "name": "HELLMANS - Mayonesa liviana x 237 grs",
    "description": "HELLMANS - Mayonesa liviana x 237 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798383010176",
    "name": "Hummus Babaganoush Kamar x 230 grs",
    "description": "Hummus Babaganoush Kamar x 230 grs",
    "label": "Otros de terceros"
  },
  {
    "code": "7798383010121",
    "name": "Hummus Clasico C. Pasta Mani KAMAR x 230grs",
    "description": "Hummus Clasico C. Pasta Mani KAMAR x 230grs",
    "label": "Otros de terceros",
    "barcode": "7798383010121"
  },
  {
    "code": "7798383010183",
    "name": "Hummus Guacamole KAMAR x 230grs",
    "description": "Hummus Guacamole KAMAR x 230grs",
    "label": "Otros de terceros",
    "barcode": "7798383010183"
  },
  {
    "code": "7798383010152",
    "name": "Hummus Olivas Negras y Sesamo KAMAR x 230grs",
    "description": "Hummus Olivas Negras y Sesamo KAMAR x 230grs",
    "label": "Otros de terceros",
    "barcode": "7798383010152"
  },
  {
    "code": "7798383010169",
    "name": "Hummus Pimenton,Ajo y Perejil  KAMAR x 230grs",
    "description": "Hummus Pimenton,Ajo y Perejil  KAMAR x 230grs",
    "label": "Otros de terceros",
    "barcode": "7798383010169"
  },
  {
    "code": "7798383010138",
    "name": "Hummus Sesamo y Ajo  KAMAR x 230grs",
    "description": "Hummus Sesamo y Ajo  KAMAR x 230grs",
    "label": "Otros de terceros",
    "barcode": "7798383010138"
  },
  {
    "code": "138",
    "name": "Jamon Crudo 1/2 Listo Puente de ronda  x Kg",
    "description": "Jamon Crudo 1/2 Listo Puente de ronda  x Kg",
    "label": "Fiambres Don Jose"
  },
  {
    "code": "7798259430282",
    "name": "Jugo Pura Frutta Manzana Kissabel x 1 lt",
    "description": "Jugo Pura Frutta Manzana Kissabel x 1 lt",
    "label": "Purafrutta",
    "barcode": "7798259430282"
  },
  {
    "code": "705",
    "name": "KUIBI - Brownie sin gluten",
    "description": "KUIBI - Brownie sin gluten",
    "label": "Productos Propios"
  },
  {
    "code": "706",
    "name": "KUIBI - Budín Chocolate c/Nuez sin gluten",
    "description": "KUIBI - Budín Chocolate c/Nuez sin gluten",
    "label": "Productos Propios"
  },
  {
    "code": "713",
    "name": "KUIBI - Budín Limón",
    "description": "KUIBI - Budín Limón",
    "label": "Productos Propios"
  },
  {
    "code": "712",
    "name": "KUIBI - Budín Zanahoria",
    "description": "KUIBI - Budín Zanahoria",
    "label": "Productos Propios"
  },
  {
    "code": "707",
    "name": "KUIBI - Chipa Precocido x6",
    "description": "KUIBI - Chipa Precocido x6",
    "label": "Productos Propios"
  },
  {
    "code": "701",
    "name": "KUIBI - Chips x 10",
    "description": "KUIBI - Chips x 10",
    "label": "Productos Propios"
  },
  {
    "code": "716",
    "name": "KUIBI - Empanadas x6",
    "description": "KUIBI - Empanadas x6",
    "label": "Productos Propios"
  },
  {
    "code": "702",
    "name": "KUIBI - Granola x 400 grs",
    "description": "KUIBI - Granola x 400 grs",
    "label": "Productos Propios"
  },
  {
    "code": "703",
    "name": "KUIBI - Pan de molde",
    "description": "KUIBI - Pan de molde",
    "label": "Productos Propios"
  },
  {
    "code": "708",
    "name": "KUIBI - Pan Sandwich x4",
    "description": "KUIBI - Pan Sandwich x4",
    "label": "Productos Propios"
  },
  {
    "code": "710",
    "name": "KUIBI - Prepizzas x2",
    "description": "KUIBI - Prepizzas x2",
    "label": "Productos Propios"
  },
  {
    "code": "709",
    "name": "KUIBI - Sfijas x6",
    "description": "KUIBI - Sfijas x6",
    "label": "Productos Propios"
  },
  {
    "code": "714",
    "name": "KUIBI - Tarta Calabaza, Zanahoria y Queso",
    "description": "KUIBI - Tarta Calabaza, Zanahoria y Queso",
    "label": "Productos Propios"
  },
  {
    "code": "711",
    "name": "KUIBI - Tarta Espinaca y Ricota",
    "description": "KUIBI - Tarta Espinaca y Ricota",
    "label": "Productos Propios"
  },
  {
    "code": "715",
    "name": "KUIBI - Tarta Pollo y Puerro",
    "description": "KUIBI - Tarta Pollo y Puerro",
    "label": "Productos Propios"
  },
  {
    "code": "704",
    "name": "KUIBI- Chipa x 10",
    "description": "KUIBI- Chipa x 10",
    "label": "Productos Propios"
  },
  {
    "code": "7795165000103",
    "name": "Leberwurst Ahumado Friolim x Un",
    "description": "Leberwurst Ahumado Friolim x Un",
    "label": "Productos Propios",
    "barcode": "7795165000103"
  },
  {
    "code": "200",
    "name": "Leberwurst Tripas 2u Friolim x Kg",
    "description": "Leberwurst Tripas 2u Friolim x Kg",
    "label": "Productos Propios"
  },
  {
    "code": "237",
    "name": "Mani Crocant  Jamon x Kg",
    "description": "Mani Crocant  Jamon x Kg",
    "label": "Mani y frutos secos"
  },
  {
    "code": "236",
    "name": "Mani Crocant Pizza x Kg",
    "description": "Mani Crocant Pizza x Kg",
    "label": "Mani y frutos secos"
  },
  {
    "code": "239",
    "name": "Mani Frito Salado sin  Piel x Kg",
    "description": "Mani Frito Salado sin  Piel x Kg",
    "label": "Mani y frutos secos"
  },
  {
    "code": "238",
    "name": "Mani Vaina x Kg",
    "description": "Mani Vaina x Kg",
    "label": "Mani y frutos secos"
  },
  {
    "code": "339",
    "name": "Manteca Pilon x 5 Kg",
    "description": "Manteca Pilon x 5 Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "057",
    "name": "Muzzarella Ahora! x 5 kg",
    "description": "Muzzarella Ahora! x 5 kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "055",
    "name": "Muzzarella Ahora! x Kg",
    "description": "Muzzarella Ahora! x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "030",
    "name": "Muzzarella Barra Luz Azul x Kg",
    "description": "Muzzarella Barra Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "029",
    "name": "Muzzarella Cilindro Luz Azul x Kg",
    "description": "Muzzarella Cilindro Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "725",
    "name": "OCTAVIANO - Almendra non pareil x 100 grs",
    "description": "OCTAVIANO - Almendra non pareil x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "727",
    "name": "OCTAVIANO - Castañas x 100 grs",
    "description": "OCTAVIANO - Castañas x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "724",
    "name": "OCTAVIANO - Datiles x 150 grs",
    "description": "OCTAVIANO - Datiles x 150 grs",
    "label": "Productos Propios"
  },
  {
    "code": "721",
    "name": "OCTAVIANO - Granola frutos rojos x 200 grs",
    "description": "OCTAVIANO - Granola frutos rojos x 200 grs",
    "label": "Productos Propios"
  },
  {
    "code": "723",
    "name": "OCTAVIANO - Granola frutos rojos x 300 grs",
    "description": "OCTAVIANO - Granola frutos rojos x 300 grs",
    "label": "Productos Propios"
  },
  {
    "code": "720",
    "name": "OCTAVIANO - Hongos Chilenos x 100 grs",
    "description": "OCTAVIANO - Hongos Chilenos x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "726",
    "name": "OCTAVIANO - Mix Merken x 150 grs",
    "description": "OCTAVIANO - Mix Merken x 150 grs",
    "label": "Productos Propios"
  },
  {
    "code": "719",
    "name": "OCTAVIANO - Nuez extra light x 150 grs",
    "description": "OCTAVIANO - Nuez extra light x 150 grs",
    "label": "Productos Propios"
  },
  {
    "code": "728",
    "name": "OCTAVIANO - Pistachos x 80 grs",
    "description": "OCTAVIANO - Pistachos x 80 grs",
    "label": "Productos Propios"
  },
  {
    "code": "722",
    "name": "OCTAVIANO - Tomates secos x 100 grs",
    "description": "OCTAVIANO - Tomates secos x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "033",
    "name": "Oferta Pategras",
    "description": "Oferta Pategras",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "741",
    "name": "PANNICO - Baguettin x 5 unidades",
    "description": "PANNICO - Baguettin x 5 unidades",
    "label": "Productos Propios"
  },
  {
    "code": "745",
    "name": "PANNICO - Ciabatta Morada x 5 unidades",
    "description": "PANNICO - Ciabatta Morada x 5 unidades",
    "label": "Productos Propios"
  },
  {
    "code": "744",
    "name": "PANNICO - Ciabatta x 5 unidades",
    "description": "PANNICO - Ciabatta x 5 unidades",
    "label": "Productos Propios"
  },
  {
    "code": "742",
    "name": "PANNICO - Pan Baguettin Semillas x 5 unidades",
    "description": "PANNICO - Pan Baguettin Semillas x 5 unidades",
    "label": "Productos Propios"
  },
  {
    "code": "743",
    "name": "PANNICO - Pan Party x 5 unidades",
    "description": "PANNICO - Pan Party x 5 unidades",
    "label": "Productos Propios"
  },
  {
    "code": "740",
    "name": "PANNICO - Pre-Pizza x 3 unidades",
    "description": "PANNICO - Pre-Pizza x 3 unidades",
    "label": "Productos Propios"
  },
  {
    "code": "004",
    "name": "Parmesano Luz Azul x Kg",
    "description": "Parmesano Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "014",
    "name": "Parrillero Luz Azul x Kg",
    "description": "Parrillero Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798453310014",
    "name": "Pasta De Mani Clasica x 360 gr",
    "description": "Pasta De Mani Clasica x 360 gr",
    "label": "Che Pasta de Mani",
    "barcode": "7798453310014"
  },
  {
    "code": "7798453310021",
    "name": "Pasta De Mani Sin Sal x 360 gr",
    "description": "Pasta De Mani Sin Sal x 360 gr",
    "label": "Che Pasta de Mani",
    "barcode": "7798453310021"
  },
  {
    "code": "216",
    "name": "Pastron Ahumado Signorello x Kg",
    "description": "Pastron Ahumado Signorello x Kg",
    "label": "Otros de terceros"
  },
  {
    "code": "006",
    "name": "Pategras Luz Azul x Kg",
    "description": "Pategras Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "355",
    "name": "Pavita Rellena de pollo x kg",
    "description": "Pavita Rellena de pollo x kg",
    "label": "Fiambres Signorello",
    "barcode": "355"
  },
  {
    "code": "255",
    "name": "Pickles Molanes x Kg",
    "description": "Pickles Molanes x Kg",
    "label": "Molanes"
  },
  {
    "code": "002",
    "name": "Por Salut Luz Azul x Kg",
    "description": "Por Salut Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "003",
    "name": "Por Salut Sin Sal Descrem Luz Azul x Kg",
    "description": "Por Salut Sin Sal Descrem Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7795786000889",
    "name": "Power mix Energia x 100g",
    "description": "Power mix Energia x 100g",
    "label": "Mani y frutos secos"
  },
  {
    "code": "7795786000896",
    "name": "Power mix Fibra x 100g",
    "description": "Power mix Fibra x 100g",
    "label": "Mani y frutos secos"
  },
  {
    "code": "7795786000902",
    "name": "Power mix Natural x 100g",
    "description": "Power mix Natural x 100g",
    "label": "Mani y frutos secos"
  },
  {
    "code": "7795786000919",
    "name": "Power mix Runner x 100g",
    "description": "Power mix Runner x 100g",
    "label": "Mani y frutos secos"
  },
  {
    "code": "752",
    "name": "Pretzel C/miel merken 100gr",
    "description": "Pretzel C/miel merken 100gr",
    "label": "Productos Propios"
  },
  {
    "code": "257",
    "name": "Pretzels Autenta Foods xkg",
    "description": "Pretzels Autenta Foods xkg",
    "label": "Mani y frutos secos",
    "barcode": "257"
  },
  {
    "code": "902",
    "name": "Pretzels Malteados Osem Kg",
    "description": "Pretzels Malteados Osem Kg",
    "label": "Mani y frutos secos"
  },
  {
    "code": "739",
    "name": "PROFECIA - Alcayota x 450grs",
    "description": "PROFECIA - Alcayota x 450grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798077160118",
    "name": "PROFECIA - Batatitas en Almibar x 450grs",
    "description": "PROFECIA - Batatitas en Almibar x 450grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798077160385",
    "name": "PROFECIA - Bocadito de membrillo x und",
    "description": "PROFECIA - Bocadito de membrillo x und",
    "label": "Productos Propios"
  },
  {
    "code": "738",
    "name": "PROFECIA - Higos en Almibar x 450grs",
    "description": "PROFECIA - Higos en Almibar x 450grs",
    "label": "Productos Propios",
    "barcode": "7798077160644"
  },
  {
    "code": "7798077160569",
    "name": "PROFECIA - Jalea de Membrillo x 450 grs",
    "description": "PROFECIA - Jalea de Membrillo x 450 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798185030198",
    "name": "PROFECIA - Membrillo al natural x 450 grs",
    "description": "PROFECIA - Membrillo al natural x 450 grs",
    "label": "Productos Propios"
  },
  {
    "code": "737",
    "name": "PROFECIA - Mermelada de Higos x 450GRS",
    "description": "PROFECIA - Mermelada de Higos x 450GRS",
    "label": "Productos Propios"
  },
  {
    "code": "7798077160149",
    "name": "PROFECIA - Mermelada membrillo x 450 grs",
    "description": "PROFECIA - Mermelada membrillo x 450 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798077160606",
    "name": "PROFECIA - Mermelada Tomate x 450 grs",
    "description": "PROFECIA - Mermelada Tomate x 450 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798077160996",
    "name": "PROFECIA - Quinotos x 450 grs",
    "description": "PROFECIA - Quinotos x 450 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798077160576",
    "name": "PROFECIA - Zapallitos en Almibar 450grs",
    "description": "PROFECIA - Zapallitos en Almibar 450grs",
    "label": "Productos Propios"
  },
  {
    "code": "857",
    "name": "Promo Regreso a clase Pura Frutta",
    "description": "Promo Regreso a clase Pura Frutta",
    "label": "Purafrutta"
  },
  {
    "code": "857",
    "name": "Promo Regreso a clase Pura Frutta",
    "description": "Promo Regreso a clase Pura Frutta",
    "label": "Elaborados"
  },
  {
    "code": "025",
    "name": "Provolone Luz Azul x Kg",
    "description": "Provolone Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "614143679063",
    "name": "QLP - Barra de Avellanas 50 grs",
    "description": "QLP - Barra de Avellanas 50 grs",
    "label": "Productos Propios"
  },
  {
    "code": "614143678981",
    "name": "QLP - Barra de Mani Chocolate Blanco 50 grs",
    "description": "QLP - Barra de Mani Chocolate Blanco 50 grs",
    "label": "Productos Propios",
    "barcode": "7798455340019"
  },
  {
    "code": "614143678998",
    "name": "QLP - Barra de Mani Chocolate Semiamargo 50 grs",
    "description": "QLP - Barra de Mani Chocolate Semiamargo 50 grs",
    "label": "Productos Propios"
  },
  {
    "code": "614143679056",
    "name": "QLP - Barra de Pistachos 50 grs",
    "description": "QLP - Barra de Pistachos 50 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187212370",
    "name": "QUENTO - Batatas Cebolla Caramelizada x 70 grs",
    "description": "QUENTO - Batatas Cebolla Caramelizada x 70 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187212356",
    "name": "QUENTO - Batatas Crema de Roquefort x 70 grs",
    "description": "QUENTO - Batatas Crema de Roquefort x 70 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187212363",
    "name": "QUENTO - Batatas Paprika Ahumada x 70 grs",
    "description": "QUENTO - Batatas Paprika Ahumada x 70 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211403",
    "name": "QUENTO - Batatas x 40 grs",
    "description": "QUENTO - Batatas x 40 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211892",
    "name": "QUENTO - Batatas x 75 grs",
    "description": "QUENTO - Batatas x 75 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187210567",
    "name": "QUENTO - Batatas x 80 grs",
    "description": "QUENTO - Batatas x 80 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187210048",
    "name": "QUENTO - Mega queso x 50 grs",
    "description": "QUENTO - Mega queso x 50 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211939",
    "name": "QUENTO - Nachos picante x 80 grs",
    "description": "QUENTO - Nachos picante x 80 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211953",
    "name": "QUENTO - Nachos sabor guacamole x 90 grs",
    "description": "QUENTO - Nachos sabor guacamole x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211465",
    "name": "QUENTO - Nachos x 90 grs",
    "description": "QUENTO - Nachos x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211229",
    "name": "QUENTO - Palitos sabor cheddar",
    "description": "QUENTO - Palitos sabor cheddar",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211212",
    "name": "QUENTO - Palitos sabor panceta x 90 grs",
    "description": "QUENTO - Palitos sabor panceta x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187210529",
    "name": "QUENTO - Papas cheddar x 40 grs",
    "description": "QUENTO - Papas cheddar x 40 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211311",
    "name": "QUENTO - Papas clasicas x 100 grs",
    "description": "QUENTO - Papas clasicas x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211328",
    "name": "QUENTO - Papas fritas asado criollo x 90 grs",
    "description": "QUENTO - Papas fritas asado criollo x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211786",
    "name": "QUENTO - Papas fritas barbacoa x 90 grs",
    "description": "QUENTO - Papas fritas barbacoa x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211298",
    "name": "QUENTO - Papas fritas cheddar x90 grs",
    "description": "QUENTO - Papas fritas cheddar x90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211649",
    "name": "QUENTO - Papas fritas crema y ciboulette x 45 grs",
    "description": "QUENTO - Papas fritas crema y ciboulette x 45 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211427",
    "name": "QUENTO - Papas Fritas Limón x 90 grs",
    "description": "QUENTO - Papas Fritas Limón x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187212165",
    "name": "QUENTO - Papas fritas mostaza x 82 grs",
    "description": "QUENTO - Papas fritas mostaza x 82 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211564",
    "name": "QUENTO - Papas fritas mostaza x 90 grs",
    "description": "QUENTO - Papas fritas mostaza x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211281",
    "name": "QUENTO - Papas jamon serrano x 90 grs",
    "description": "QUENTO - Papas jamon serrano x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211304",
    "name": "QUENTO - Papas ketchup x 90 grs",
    "description": "QUENTO - Papas ketchup x 90 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798187211946",
    "name": "QUENTO - Papas Picante x 70 grs",
    "description": "QUENTO - Papas Picante x 70 grs",
    "label": "Productos Propios"
  },
  {
    "code": "017",
    "name": "Queso Brie x Kg",
    "description": "Queso Brie x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798134610396",
    "name": "Queso Camembert de Cabra x 100gr",
    "description": "Queso Camembert de Cabra x 100gr",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "013",
    "name": "Queso de Oferta",
    "description": "Queso de Oferta",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "038",
    "name": "Queso Holanda x Kg",
    "description": "Queso Holanda x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "039",
    "name": "Queso logo chico x kg",
    "description": "Queso logo chico x kg",
    "label": "Luz Azul y quesos",
    "barcode": "039"
  },
  {
    "code": "005",
    "name": "Queso Logo Luz Azul x Kg",
    "description": "Queso Logo Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798060854352",
    "name": "Queso Patagonia  Reducido Tonadita  x 180 gr",
    "description": "Queso Patagonia  Reducido Tonadita  x 180 gr",
    "label": "Otros de terceros",
    "barcode": "7798060854352"
  },
  {
    "code": "7798060852426",
    "name": "Queso Patagonia Clasico Tonadita  x 3 kg",
    "description": "Queso Patagonia Clasico Tonadita  x 3 kg",
    "label": "Otros de terceros"
  },
  {
    "code": "7798060854345",
    "name": "Queso Patagonia Clasico Tonadita x 180 gr",
    "description": "Queso Patagonia Clasico Tonadita x 180 gr",
    "label": "Otros de terceros"
  },
  {
    "code": "7798060852679",
    "name": "Queso Patagonia Clasico Tonadita x 20 g",
    "description": "Queso Patagonia Clasico Tonadita x 20 g",
    "label": "Otros de terceros"
  },
  {
    "code": "7798060853409",
    "name": "Queso Patagonia Clasico Tonadita x 200 gr",
    "description": "Queso Patagonia Clasico Tonadita x 200 gr",
    "label": "Otros de terceros"
  },
  {
    "code": "7798060852907",
    "name": "Queso Patagonia Light Tonadita x 20 gr",
    "description": "Queso Patagonia Light Tonadita x 20 gr",
    "label": "Otros de terceros"
  },
  {
    "code": "7798060853379",
    "name": "Queso Patagonia Light Tonadita x 200 gr",
    "description": "Queso Patagonia Light Tonadita x 200 gr",
    "label": "Otros de terceros",
    "barcode": "7798060853379"
  },
  {
    "code": "7798060852730",
    "name": "Queso Patagonia Sushi Tonadita x 3 kg",
    "description": "Queso Patagonia Sushi Tonadita x 3 kg",
    "label": "Otros de terceros"
  },
  {
    "code": "023",
    "name": "Reggianito Luz Azul x Kg",
    "description": "Reggianito Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "012",
    "name": "Ricota Industrial Luz Azul x Kg",
    "description": "Ricota Industrial Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "022",
    "name": "Romanito Luz Azul x Kg",
    "description": "Romanito Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "267",
    "name": "Rosca Polaca Friolim x Kg",
    "description": "Rosca Polaca Friolim x Kg",
    "label": "Productos Propios"
  },
  {
    "code": "266",
    "name": "Salam Cracovia Ahum Friolim x Kg",
    "description": "Salam Cracovia Ahum Friolim x Kg",
    "label": "Productos Propios"
  },
  {
    "code": "272",
    "name": "Salchi Viena L 12u Friolim",
    "description": "Salchi Viena L 12u Friolim",
    "label": "Productos Propios"
  },
  {
    "code": "269",
    "name": "Salchi Viena L 30u Friolim",
    "description": "Salchi Viena L 30u Friolim",
    "label": "Productos Propios"
  },
  {
    "code": "273",
    "name": "Salchicha 6u Larga Viena Friolim",
    "description": "Salchicha 6u Larga Viena Friolim",
    "label": "Productos Propios"
  },
  {
    "code": "7795165001421",
    "name": "Salchicha Copetin con Piel Friolim",
    "description": "Salchicha Copetin con Piel Friolim",
    "label": "Productos Propios"
  },
  {
    "code": "7795165001391",
    "name": "Salchicha Parrillera Friolim",
    "description": "Salchicha Parrillera Friolim",
    "label": "Productos Propios",
    "barcode": "7795165001391"
  },
  {
    "code": "7795786000728",
    "name": "Salsa Cheddar Luz Azul x 3 Kg",
    "description": "Salsa Cheddar Luz Azul x 3 Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "020",
    "name": "Sardo Estacionado Luz Azul x Kg",
    "description": "Sardo Estacionado Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "054",
    "name": "Sardo Fresco Ahora! x Kg",
    "description": "Sardo Fresco Ahora! x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "018",
    "name": "Sardo Fresco Luz Azul x Kg",
    "description": "Sardo Fresco Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "019",
    "name": "Sardo Semi Estacionado Luz Azul x Kg",
    "description": "Sardo Semi Estacionado Luz Azul x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7794000006478",
    "name": "Savora x 250 grs",
    "description": "Savora x 250 grs",
    "label": "Productos Propios"
  },
  {
    "code": "788070700630",
    "name": "TAFI - Papas Barbacoa x 100 grs",
    "description": "TAFI - Papas Barbacoa x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "661094233950",
    "name": "TAFI - Papas Crema Acida y Cebolla x 100 grs",
    "description": "TAFI - Papas Crema Acida y Cebolla x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "661094233936",
    "name": "TAFI - Papas fritas jamón x 100 grs",
    "description": "TAFI - Papas fritas jamón x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "788070700647",
    "name": "TAFI - Papas fritas Pollo al limón x 100 grs",
    "description": "TAFI - Papas fritas Pollo al limón x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "661094233882",
    "name": "TAFI - Papas fritas x 100 grs",
    "description": "TAFI - Papas fritas x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "661094233899",
    "name": "TAFI - Papas fritas x 210 grs",
    "description": "TAFI - Papas fritas x 210 grs",
    "label": "Productos Propios"
  },
  {
    "code": "661094233905",
    "name": "TAFI - Papas fritas x 310 grs",
    "description": "TAFI - Papas fritas x 310 grs",
    "label": "Productos Propios"
  },
  {
    "code": "661094233943",
    "name": "TAFI - Papas Jalapeño x 100 grs",
    "description": "TAFI - Papas Jalapeño x 100 grs",
    "label": "Productos Propios"
  },
  {
    "code": "677144255889",
    "name": "TAFI - Terapia Picante Jalapeño y Lime x 60 grs",
    "description": "TAFI - Terapia Picante Jalapeño y Lime x 60 grs",
    "label": "Productos Propios"
  },
  {
    "code": "7798125810767",
    "name": "TOSTEX - Cintita Cheddar",
    "description": "TOSTEX - Cintita Cheddar",
    "label": "Productos Propios"
  },
  {
    "code": "7798125811436",
    "name": "TOSTEX - Cintitas Anchas Oliva",
    "description": "TOSTEX - Cintitas Anchas Oliva",
    "label": "Productos Propios"
  },
  {
    "code": "7798125810361",
    "name": "TOSTEX - Cintitas Cebolla",
    "description": "TOSTEX - Cintitas Cebolla",
    "label": "Productos Propios"
  },
  {
    "code": "7798125810521",
    "name": "TOSTEX - Cintitas Jamón",
    "description": "TOSTEX - Cintitas Jamón",
    "label": "Productos Propios"
  },
  {
    "code": "7798125811405",
    "name": "TOSTEX - Cintitas Pancho",
    "description": "TOSTEX - Cintitas Pancho",
    "label": "Productos Propios"
  },
  {
    "code": "7798125811214",
    "name": "TOSTEX - Cintitas Picante",
    "description": "TOSTEX - Cintitas Picante",
    "label": "Productos Propios"
  },
  {
    "code": "7798125810958",
    "name": "TOSTEX - Cintitas Provoleta",
    "description": "TOSTEX - Cintitas Provoleta",
    "label": "Productos Propios"
  },
  {
    "code": "7798125810965",
    "name": "TOSTEX - Cintitas Salame",
    "description": "TOSTEX - Cintitas Salame",
    "label": "Productos Propios"
  },
  {
    "code": "7793313013672",
    "name": "TREGAR - Ricotta Light x 290 grs",
    "description": "TREGAR - Ricotta Light x 290 grs",
    "label": "Productos Propios"
  },
  {
    "code": "311",
    "name": "Trenza con Semillas x Kg",
    "description": "Trenza con Semillas x Kg",
    "label": "Luz Azul y quesos"
  },
  {
    "code": "7798060853010",
    "name": "Untable Azul Tonadita x 180 gr",
    "description": "Untable Azul Tonadita x 180 gr",
    "label": "Otros de terceros"
  },
  {
    "code": "7798060853119",
    "name": "Untable Cheddar Tonadita x 180 gr",
    "description": "Untable Cheddar Tonadita x 180 gr",
    "label": "Otros de terceros",
    "barcode": "7798060853119"
  },
  {
    "code": "7798060853003",
    "name": "Untable Clasico Tonadita x 180 gr",
    "description": "Untable Clasico Tonadita x 180 gr",
    "label": "Otros de terceros"
  },
  {
    "code": "7798060854017",
    "name": "Untable Cuatro Quesos Tonadita x 180 gr",
    "description": "Untable Cuatro Quesos Tonadita x 180 gr",
    "label": "Tonadita",
    "barcode": "7798060854017"
  },
  {
    "code": "7798060853034",
    "name": "Untable Gruyere Tonadita x180 gr",
    "description": "Untable Gruyere Tonadita x180 gr",
    "label": "Otros de terceros"
  },
  {
    "code": "7798060852990",
    "name": "Untable Jamon Tonadita x 180 gr",
    "description": "Untable Jamon Tonadita x 180 gr",
    "label": "Otros de terceros"
  },
  {
    "code": "714604177456",
    "name": "Vermouth Rosado Federal x 750 cc",
    "description": "Vermouth Rosado Federal x 750 cc",
    "label": "Otros de terceros",
    "barcode": "714604177456"
  },
  {
    "code": "763571871126",
    "name": "Vermouth Rosso Tipo Torino Federal x 750ml",
    "description": "Vermouth Rosso Tipo Torino Federal x 750ml",
    "label": "Otros de terceros",
    "barcode": "763571871126"
  },
  {
    "code": "748",
    "name": "VIAMONTE - Chips Brioche",
    "description": "VIAMONTE - Chips Brioche",
    "label": "Productos Propios"
  },
  {
    "code": "750",
    "name": "VIAMONTE - Crackers x 500 grs",
    "description": "VIAMONTE - Crackers x 500 grs",
    "label": "Productos Propios"
  },
  {
    "code": "749",
    "name": "VIAMONTE - Hamburguesa Brioche",
    "description": "VIAMONTE - Hamburguesa Brioche",
    "label": "Productos Propios"
  },
  {
    "code": "747",
    "name": "VIAMONTE - Pebete x 6 unidades",
    "description": "VIAMONTE - Pebete x 6 unidades",
    "label": "Productos Propios"
  },
  {
    "code": "781",
    "name": "VIAMONTE - Pebete x 6 unidades",
    "description": "VIAMONTE - Pebete x 6 unidades",
    "label": "Productos Propios"
  },
  {
    "code": "789",
    "name": "Viamonte - tostadas Integrales",
    "description": "Viamonte - tostadas Integrales",
    "label": "Productos Propios"
  },
  {
    "code": "782",
    "name": "VIAMONTE - Viena Brioche x6",
    "description": "VIAMONTE - Viena Brioche x6",
    "label": "Productos Propios"
  },
  {
    "code": "790",
    "name": "Viamonte Salvado doble",
    "description": "Viamonte Salvado doble",
    "label": "Productos Propios"
  },
  {
    "code": "718",
    "name": "Yogurt Griego Greetha x 500 grs",
    "description": "Yogurt Griego Greetha x 500 grs",
    "label": "Productos Propios"
  },
  {
    "code": "717",
    "name": "Yogurt Griego Greetha x 700 grs",
    "description": "Yogurt Griego Greetha x 700 grs",
    "label": "Productos Propios"
  }
]

  for (const productData of products) {
    await prisma.product.upsert({
      where: { code: productData.code },
      update: { description: productData.description, label: productData.label, barcode: productData.barcode },
      create: { ...productData, isActive: true },
    });
  }
  console.log(`✅ ${products.length} productos creados`);

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("📧 Login Super Admin: ruben@luzazul.com / LuzAzul2026!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error en seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
