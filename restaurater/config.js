const CONFIG = {
  restaurant: {
    name: "Restaurant",
    icon: "🍽️",
    categories: [
      {
        id: "essen",
        name: "Essen",
        items: [
          {
            id: "geschmack",
            label: "Geschmack",
            question: "Wie hat dir das Essen geschmeckt?",
            weight: 2,
          },
          {
            id: "anrichtung",
            label: "Anrichtung",
            question: "Wie ansprechend war die Anrichtung der Speisen?",
            weight: 1,
          },
          {
            id: "vielfalt",
            label: "Vielfältigkeit",
            question: "Wie vielfältig war das Angebot auf der Karte?",
            weight: 1,
          },
          {
            id: "kontrastreichtum",
            label: "Kontrastreichtum",
            question:
              "War das Essen kontrastreich (farblich abwechslungsreich) angerichtet?",
            weight: 1,
          },
          {
            id: "essbarkeit",
            label: "Essbarkeit",
            question: "Wie gut war die Zubereitung / Essbarkeit?",
            weight: 1,
          },
          {
            id: "frische",
            label: "Frische",
            question: "Wie frisch wirkten die Zutaten?",
            weight: 2,
          },
          {
            id: "sauberkeit_besteck",
            label: "Sauberkeit Besteck/Tisch",
            question: "Wie sauber waren Besteck und Tisch?",
            weight: 2,
          },
        ],
        sperrklauseln: [],
      },
      {
        id: "service",
        name: "Service",
        items: [
          {
            id: "freundlichkeit",
            label: "Freundlichkeit",
            question: "Wie freundlich war das Personal?",
            weight: 2,
          },
          {
            id: "hygiene",
            label: "Hygiene",
            question: "Wie war die Hygiene des Personals/Service?",
            weight: 2,
          },
          {
            id: "wartezeit",
            label: "Wartezeit",
            question: "Wie war die Wartezeit?",
            weight: 1,
          },
          {
            id: "variabilitaet",
            label: "Variabilität",
            question: "Wie flexibel ist der Service auf Wünsche eingegangen?",
            weight: 1,
          },
        ],
        sperrklauseln: [
          {
            id: "besteck_gebracht",
            question: "Wurde von sich aus Besteck gebracht?",
            scope: "item",
            target: "hygiene",
            maxIfNo: 9,
          },
          {
            id: "speisekarte_zustand",
            question:
              "War die Speisekarte physisch in gutem Zustand vorhanden?",
            scope: "category",
            maxIfNo: 9,
          },
        ],
      },
      {
        id: "ambiente",
        name: "Ambiente",
        items: [
          {
            id: "sauberkeit_ambiente",
            label: "Sauberkeit",
            question: "Wie sauber war das Ambiente / die Räumlichkeiten?",
            weight: 2,
          },
          {
            id: "design",
            label: "Design",
            question: "Wie gefiel dir das Design/die Einrichtung?",
            weight: 1,
          },
          {
            id: "toilette",
            label: "Toilette",
            question: "Wie war der Zustand der Toilette?",
            weight: 1,
          },
        ],
        sperrklauseln: [
          {
            id: "toilette_kabine",
            question: "Gab es eine eigene, geschlossene Toilettenkabine?",
            scope: "item",
            target: "toilette",
            maxIfNo: 9,
          },
          {
            id: "handtuecher",
            question:
              "Waren Stoffhandtücher statt eines Lufttrockners vorhanden?",
            scope: "item",
            target: "toilette",
            maxIfNo: 6,
          },
        ],
      },
    ],
  },
};

const REVIEW_OPENERS = {
  5: [
    "Absolut ein Volltreffer, ich komme auf jeden Fall wieder.",
    "Ein rundum gelungener Besuch, den ich gerne weiterempfehle.",
    "Von Anfang bis Ende überzeugend.",
  ],
  4: [
    "Ein sehr guter Besuch, insgesamt bin ich richtig zufrieden.",
    "Rundherum ein starker Eindruck.",
    "Ein schöner Besuch auf hohem Niveau.",
  ],
  3: [
    "Ein solider Besuch, insgesamt auf ordentlichem Niveau.",
    "Ein akzeptabler Besuch mit ordentlichem Gesamteindruck.",
    "Insgesamt ein durchschnittlicher, aber in Ordnung gehender Besuch.",
  ],
  2: [
    "Ein eher durchwachsener Besuch.",
    "Insgesamt eher schwach, mit Luft nach oben.",
    "Leider nicht so überzeugend, wie ich gehofft hatte.",
  ],
  1: [
    "Leider ein sehr enttäuschender Besuch.",
    "Das war leider nichts, deutlich unter Erwartung.",
    "Ein Besuch, den ich so nicht wiederholen werde.",
  ],
};

const REVIEW_POSITIVE_CLAUSES = [
  "Besonders {top} hat mich begeistert.",
  "Vor allem {top} war wirklich herausragend.",
  "{top} war dabei ein echtes Highlight.",
];

const REVIEW_NEGATIVE_CLAUSES = [
  "Bei {low} ist allerdings noch deutlich Luft nach oben.",
  "{low} hat den Gesamteindruck aber spürbar getrübt.",
  "Nachholbedarf gibt es klar bei {low}.",
];
