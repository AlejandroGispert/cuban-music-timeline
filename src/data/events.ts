
import { TimelineEvent } from "../types";

export const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "Birth of the Danzón",
    date: "January 1, 1879",
    year: 1879,
    location: {
      city: "Matanzas",
      province: "Matanzas"
    },
    style: ["Danzón"],
    description: "Miguel Faílde composed and performed the first Danzón, 'Las Alturas de Simpson,' which became Cuba's national dance. The Danzón evolved from the contradanza and habanera, featuring a slower tempo and refined structure.",
    videoUrl: "https://www.youtube.com/watch?v=rts3G8gX8Jg"
  },
  {
    id: "2",
    title: "Son Cubano Emerges",
    date: "c. 1890s",
    year: 1890,
    location: {
      city: "Santiago de Cuba",
      province: "Santiago de Cuba"
    },
    style: ["Son Cubano"],
    description: "Son Cubano emerged in eastern Cuba, blending Spanish guitar with African percussion. It would later become one of the most influential genres in Latin American music, with characteristic elements like the clave rhythm and call-and-response vocals.",
    videoUrl: "https://www.youtube.com/watch?v=HaAPjQJyBdE"
  },
  {
    id: "3",
    title: "Sexteto Habanero Founded",
    date: "March 12, 1920",
    year: 1920,
    location: {
      city: "Havana",
      province: "La Habana"
    },
    style: ["Son Cubano"],
    description: "The famous Sexteto Habanero was founded, popularizing Son Cubano in western Cuba and helping spread the genre internationally. The group added the trumpet to the traditional Son ensemble, creating a more dynamic sound.",
    videoUrl: "https://www.youtube.com/watch?v=PV1StETDdQc"
  },
  {
    id: "4",
    title: "Mambo Revolution by Dámaso Pérez Prado",
    date: "September 3, 1949",
    year: 1949,
    location: {
      city: "Havana",
      province: "La Habana"
    },
    style: ["Mambo"],
    description: "Dámaso Pérez Prado transforms the Danzón into the energetic Mambo, creating an international dance sensation. His orchestration featured powerful brass sections and sophisticated arrangements that captivated audiences around the world.",
    videoUrl: "https://www.youtube.com/watch?v=s0yr1mXwWTU"
  },
  {
    id: "5",
    title: "Birth of the Cha-Cha-Chá",
    date: "July 15, 1953",
    year: 1953,
    location: {
      city: "Havana",
      province: "La Habana"
    },
    style: ["Cha-Cha-Chá"],
    description: "Composer and violinist Enrique Jorrín creates the Cha-Cha-Chá while playing with Orquesta América. The name derives from the shuffling sound dancers' feet made when performing the double step. The style quickly gained popularity throughout Cuba and beyond.",
    videoUrl: "https://www.youtube.com/watch?v=CgDCeQHjdxo"
  },
  {
    id: "6",
    title: "Buena Vista Social Club Formation",
    date: "March 26, 1996",
    year: 1996,
    location: {
      city: "Havana",
      province: "La Habana"
    },
    style: ["Son Cubano", "Bolero"],
    description: "Ry Cooder assembles legendary Cuban musicians to record the Grammy-winning Buena Vista Social Club album, reviving traditional Cuban music globally. The project brought international recognition to artists like Compay Segundo, Ibrahim Ferrer, and Omara Portuondo.",
    videoUrl: "https://www.youtube.com/watch?v=JNYOVEXJBBM"
  },
  {
    id: "7",
    title: "Timba Explosion with Los Van Van",
    date: "October 4, 1969",
    year: 1969,
    location: {
      city: "Havana",
      province: "La Habana"
    },
    style: ["Timba", "Songo"],
    description: "Juan Formell forms Los Van Van, pioneering the Songo rhythm and later contributing to Timba, Cuban dance music that fuses Son, Salsa, and Funk. The band became known as 'El Tren' (The Train) for their unstoppable rhythm and continued popularity.",
    videoUrl: "https://www.youtube.com/watch?v=GczKTmiDvxs"
  },
  {
    id: "8",
    title: "Celia Cruz: The Queen of Salsa",
    date: "June 10, 1950",
    year: 1950,
    location: {
      city: "Havana",
      province: "La Habana"
    },
    style: ["Guaracha", "Salsa"],
    description: "Celia Cruz joins La Sonora Matancera, launching her legendary career as the undisputed Queen of Salsa. Her powerful voice and charismatic stage presence would make her one of the most recognized Latin artists in history.",
    videoUrl: "https://www.youtube.com/watch?v=Ns9YYSqLxyI"
  }
];

export const allMusicStyles = Array.from(
  new Set(timelineEvents.flatMap(event => event.style))
).sort();

export const allProvinces = Array.from(
  new Set(timelineEvents.map(event => event.location.province))
).sort();

export const allCities = Array.from(
  new Set(timelineEvents.map(event => event.location.city))
).sort();

export const yearRange: [number, number] = [
  Math.min(...timelineEvents.map(event => event.year)),
  Math.max(...timelineEvents.map(event => event.year))
];
