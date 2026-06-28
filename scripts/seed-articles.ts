import { db } from "../db";
import { articles, users } from "../db/schema";
import { eq } from "drizzle-orm";

const data = [
  {
    titre: "Insécurité alimentaire au Mali : le Plan national de réponse 2026 face à une crise persistante",
    slug: "insecurite-alimentaire-mali-plan-national-reponse-2026",
    contenu: `Alors que la saison soudure s'installe au Mali, la question de la sécurité alimentaire reste au cœur des préoccupations humanitaires. Selon le Plan de Réponse Humanitaire 2026 présenté par OCHA le 5 février 2026 à Bamako, 5,1 millions de personnes ont besoin d'aide humanitaire au Mali, dont une part importante concerne l'insécurité alimentaire.

Le 25 mars 2026, le ministre des Affaires étrangères et de la Coopération internationale, Abdoulaye Diop, a présidé une session de partage du Plan National de Réponses (PNR) à l'insécurité alimentaire, en présence du Chef de file des Partenaires techniques et financiers du cluster sécurité alimentaire. Ce plan constitue le référentiel pour la coordination et la mise en œuvre des interventions humanitaires à l'échelle nationale.

Dans les régions de Mopti, Gao et Ménaka, les partenaires du secteur de la sécurité alimentaire ont rapporté des augmentations de 25 à 71 % du prix des denrées alimentaires essentielles – riz importé, farine de blé, huile végétale, maïs et mil – selon le rapport de situation d'OCHA publié le 12 mai 2026. Une hausse de 10 à 20 % des prix des aliments pour le bétail a également été observée dans le cercle de Gao.

Sur le terrain, des actions concrètes sont menées. Depuis le 29 avril 2026, le Programme Alimentaire Mondial (PAM) et l'ONG internationale WHH ont fourni une assistance alimentaire et nutritionnelle d'urgence à plus de 15 600 réfugiés de Koro et à plus de 21 000 personnes dans les régions de Mopti et Tombouctou. À Bandiagara, 618 personnes déplacées ont reçu de l'aide, ainsi que 1 110 réfugiés à Ouenkoro en collaboration avec l'ONG CARE.

La FAO, de son côté, a lancé son Plan d'urgence et de résilience 2026-2028, visant à fournir une réponse multidimensionnelle pour répondre aux besoins humanitaires tout en transformant durablement les systèmes alimentaires.

Malgré ces efforts, la situation reste préoccupante. Les attaques du 25 avril 2026 contre plusieurs localités dont Kati, Sévaré, Gao, Mopti et Kidal ont encore compliqué l'accès humanitaire et la distribution de l'aide, selon le même rapport OCHA. Les programmes d'alimentation scolaire ont pu reprendre dans les régions de Mopti, Koulikoro, Ségou et Ménaka depuis le 4 mai, mais restent suspendus dans 16 écoles de la région de Kidal, affectant 2 913 élèves.`,
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80",
    categorie: "Humanitaire",
  },
  {
    titre: "Santé au Mali : vaccination et santé maternelle, des progrès fragiles dans les régions du Nord",
    slug: "sante-mali-vaccination-sante-maternelle-nord",
    contenu: `La santé maternelle et infantile demeure un défi majeur au Mali. Selon le rapport Countdown 2030 publié en janvier 2026, les taux de mortalité maternelle les plus élevés sont observés dans les régions de Ménaka, Kidal, Tombouctou et Kayes, tandis que les plus bas sont enregistrés à Koulikoro.

Côté vaccination, des avancées significatives sont à noter. Le Centre pour le Développement des Vaccins – Mali (CVD-Mali) a distribué 7,47 millions de doses d'azithromycine à l'échelle nationale au 31 janvier 2026, couvrant désormais toutes les régions du pays, y compris le nord (Gao, Kidal, Ménaka, Taoudénit, Tombouctou). Dans le nord, 450 000 enfants ont été traités grâce à un modèle de mise en œuvre adapté aux contraintes sécuritaires.

Le pays reste toutefois exposé à des résurgences épidémiques. La flambée de diphtérie survenue en 2025 a illustré cette fragilité : au 11 novembre 2025, 429 cas suspects et 29 décès avaient été recensés, principalement dans les régions de Mopti, Ségou et Koulikoro. Les enfants de 5 à 14 ans constituaient la tranche d'âge la plus touchée (57 % des cas). La confirmation du premier cas de Mpox en novembre 2025, suivi de 10 cas communautaires, ajoute une menace supplémentaire.

Le bulletin de surveillance du Mali (BSP Mali, avril 2026) confirme que la mortalité maternelle et néonatale reste un défi majeur, avec une concentration des décès à Bamako et dans les principales régions du sud, malgré une amélioration de la couverture vaccinale dans les zones accessibles.

Des initiatives prometteuses émergent, comme le « Kit Naissance à Domicile » porté par le CVD-Mali, qui apporte directement aux communautés des interventions destinées aux mères et aux nouveau-nés, ou encore l'administration de masse de médicaments qui couvre désormais l'ensemble du territoire national.`,
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
    categorie: "Santé",
  },
  {
    titre: "Eau et assainissement au Mali : des progrès réels mais des disparités qui persistent",
    slug: "eau-assainissement-mali-progres-disparites",
    contenu: `L'accès à l'eau potable et à l'assainissement reste un enjeu crucial pour le développement du Mali. Selon le rapport du Programme Conjoint de Surveillance (JMP) de l'OMS et de l'UNICEF pour 2024, des progrès ont été réalisés, mais les disparités entre zones urbaines et rurales demeurent importantes.

Le CICR a réalisé ou réhabilité 44 ouvrages hydrauliques en 2025 au Mali, au bénéfice de plus de 160 000 personnes, en partenariat avec les services hydrauliques et la Somagep. La qualité de l'eau et la continuité du service ont été placées au cœur des priorités techniques, avec un effort particulier sur la solarisation des infrastructures pour réduire les pannes dans un contexte énergétique fragile.

Sur le plan politique, l'année 2025 a été marquée par l'élaboration et le suivi des documents de la Politique nationale d'Assainissement ainsi que de son plan d'actions 2026-2030, selon le bilan publié en février 2026 par les autorités maliennes. Ces textes visent à structurer l'action du gouvernement et de ses partenaires pour les années à venir.

La situation sécuritaire complique toutefois les efforts. Les attaques du 25 avril 2026 ont endommagé des infrastructures hydrauliques dans cinq établissements éducatifs de la région de Mopti, et des infrastructures de communication essentielles à Rhaous (Tombouctou), Tessit (Gao), Ménaka et Kidal, rendant difficile le suivi de la situation humanitaire dans ces zones.

Malgré une décrue récente des cas, la dynamique régionale du choléra demeure préoccupante, nourrie par les déplacements de populations, les inondations et la faiblesse des infrastructures. Un redémarrage des campagnes préventives de vaccination anticholérique a été annoncé pour endiguer les flambées dans les zones à haut risque.

Le Mali a révisé ses politiques nationales de l'eau et de l'assainissement pour s'aligner sur les Objectifs de développement durable à l'horizon 2030. L'effort doit désormais conjuguer grands travaux et solutions décentralisées, en s'appuyant sur des normes techniques adaptées et des schémas tarifaires qui protègent les ménages les plus vulnérables.`,
    imageUrl: "https://images.unsplash.com/photo-1534912316311-2dbafe70b50e?w=800&q=80",
    categorie: "Développement",
  },
  {
    titre: "Femmes rurales au Mali : les coopératives agricoles comme moteur d'autonomisation",
    slug: "femmes-rurales-mali-cooperatives-agricoles-autonomisation",
    contenu: `Au Mali, plus de 70 % de la production alimentaire est assurée par les femmes, qui pratiquent l'agriculture, l'élevage et la pêche, selon la FAO. Pourtant, leur accès à la terre, au crédit et aux marchés reste limité. Face à ces obstacles, les coopératives agricoles féminines se révèlent être de véritables moteurs de changement social et économique.

Le projet Dou Touloma, financé par Affaires mondiales Canada et mis en œuvre par un consortium d'organisations canadiennes (Socodevi, CECI, UPA-DI), illustre cette dynamique. Depuis 2021, il a accompagné 84 coopératives dans les régions de Koulikoro, Ségou, Sikasso, Dioïla et San, touchant 10 107 agricultrices. L'accompagnement porte sur la professionnalisation, la gouvernance inclusive et l'adaptation aux défis environnementaux.

Deux exemples concrets montrent l'impact de cette approche. La coopérative Benkadi à Dioïla, créée en 2000 par un groupe de femmes, compte aujourd'hui 63 membres actifs et a considérablement renforcé sa structuration et sa crédibilité auprès des autorités locales. La SCOOPS Tièssiri de Kolobo, qui regroupe 55 membres dont 35 femmes, a vu ses volumes de sésame agroécologique commercialisés passer de 15 à plus de 60 tonnes en trois ans, avec un chiffre d'affaires de 36,48 millions FCFA pour la période 2023-2024.

Le programme AgriFeD d'ONUFEMMES, quant à lui, facilite l'accès des femmes aux moyens de production agricole en mettant le renforcement des capacités de résilience au centre de ses interventions, avec l'objectif d'atteindre 25 000 femmes urbaines et rurales.

Malgré ces avancées, des défis persistent. L'insécurité dans le centre et le nord du pays limite l'accès aux champs et aux marchés. Les violences basées sur le genre, les déplacements forcés et les chocs climatiques fragilisent les progrès accomplis. Les coopératives féminines, longtemps perçues comme de simples groupements d'entraide, deviennent néanmoins des acteurs économiques solides, capables de contribuer au développement local et à la durabilité environnementale.`,
    imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80",
    categorie: "Société",
  },
  {
    titre: "Éducation en crise au Mali : 2 314 écoles fermées, 694 200 enfants privés de classe",
    slug: "education-crise-mali-ecoles-fermees-enfants-prives-classe",
    contenu: `Le dernier bulletin du Cluster Éducation Mali, publié le 27 janvier 2026, dresse un constat alarmant : en novembre 2025, 2 314 écoles étaient non fonctionnelles à travers le pays, privant 694 200 enfants de leur droit à l'éducation et affectant 13 884 enseignants.

L'insécurité demeure la principale cause de ces fermetures, représentant 74 % des cas recensés. Les régions les plus touchées sont Bandiagara, Kidal, Taoudénit, Douentza et Ménaka. À l'inverse, Sikasso et Koutiala enregistrent les taux les plus faibles, avec respectivement 31 et 24 écoles fermées.

Les attaques coordonnées du 25 avril 2026 ont encore aggravé la situation. Dans la région de Mopti, les locaux et infrastructures hydrauliques de cinq établissements éducatifs ont été endommagés, entraînant une suspension des cours jusqu'au 4 mai 2026. Depuis, les programmes d'alimentation scolaire ont pu reprendre dans plusieurs régions, mais restent suspendus dans 16 écoles de Kidal, affectant 2 913 élèves dont au moins 50 % de filles.

Le rapport d'OCHA de février 2026 souligne que la proportion d'enfants déscolarisés est particulièrement élevée dans les zones rurales et les régions du nord, où l'accès à l'éducation est entravé par l'insécurité, le manque d'infrastructures et la pauvreté. À la fin de 2025, près de 415 000 personnes étaient déplacées à l'intérieur du pays, dont 58 % d'enfants.

Malgré ce contexte difficile, des lueurs d'espoir existent. Les investissements dans le secteur de l'éducation ont connu une croissance significative, passant de 233 milliards FCFA en 2010 à 558 milliards FCFA en 2025, soit une augmentation de 105 %, selon l'UNICEF. Des améliorations ont été enregistrées à Gao, Nara, Sikasso et Tombouctou, grâce à l'intervention des forces armées et à l'implication des autorités locales et des leaders religieux.

Lors de la rentrée scolaire 2025-2026, Pierre Ngom, Représentant de l'UNICEF au Mali, a réaffirmé l'engagement de l'organisation : « Rouvrir les écoles, c'est redonner espoir et un avenir aux enfants. Aucun enfant ne doit être laissé pour compte. » L'UNICEF appelle notamment à maintenir le financement de l'éducation en situation de crise humanitaire et à prioriser les apprentissages fondamentaux.`,
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    categorie: "Éducation",
  },
];

async function seedArticles() {
  const admin = await db.select().from(users).where(eq(users.role, "ADMIN")).limit(1);
  if (!admin[0]) { console.error("Aucun admin trouvé"); process.exit(1); }

  const dates = [
    "2026-06-10 08:00:00+00",
    "2026-05-25 08:00:00+00",
    "2026-05-08 08:00:00+00",
    "2026-04-20 08:00:00+00",
    "2026-04-15 08:00:00+00",
  ];

  for (let i = 0; i < data.length; i++) {
    const a = data[i];
    const exists = await db.select().from(articles).where(eq(articles.slug, a.slug)).limit(1);
    if (exists[0]) { console.log(`Existe déjà : ${a.slug}`); continue; }
    await db.insert(articles).values({
      titre: a.titre,
      slug: a.slug,
      contenu: a.contenu,
      imageUrl: a.imageUrl,
      categorie: a.categorie,
      statut: "publie",
      auteurId: admin[0].id,
      createdAt: new Date(dates[i]),
      updatedAt: new Date(dates[i]),
    });
    console.log(`✓ Article créé : ${a.titre}`);
  }

  console.log("Terminé !");
  process.exit(0);
}

seedArticles().catch((e) => { console.error(e); process.exit(1); });
