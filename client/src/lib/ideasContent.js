import brandStudy from '../assets/redesign/rokit-brand-identity.jpg';

export const ideaArticles = [
  {
    slug: 'nobody-cares-about-your-logo',
    title: 'Nobody Cares About Your Logo.',
    deck: 'They care about what they came for.',
    publicationStatus: 'public',
    topic: 'Brand & Communication',
    format: 'Practical answer',
    featured: true,
    answer: 'A logo can help someone recognise a brand. It cannot, on its own, answer what that brand does for them.',
    cover: {
      src: brandStudy,
      alt: 'Editorial study of large letterforms',
      caption: 'Editorial study · Not project documentation',
    },
    body: [
      {
        type: 'section',
        heading: 'Explanation',
        paragraphs: [
          'Identity matters most when it helps people find, understand and remember something useful. A recognisable mark is part of that work, not the whole of it. The words, the experience and the way the brand shows up all have to carry the same direction.',
        ],
      },
      {
        type: 'section',
        heading: 'Practical application',
        paragraphs: [
          'Start with the person meeting the brand. What are they here to do? What should they understand? Then decide what the identity needs to make clearer or easier to remember.',
        ],
      },
    ],
    relatedService: 'Brand & Identity',
  },
];

export function findIdea(slug) {
  return ideaArticles.find((article) => article.slug === slug);
}
