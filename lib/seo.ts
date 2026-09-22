import type { Metadata } from 'next';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { type: 'website', siteName: 'EndpointLog', title, description, url: path, images: [{ url: '/endpointlog-wordmark-color.png', alt: 'EndpointLog' }] },
    twitter: { card: 'summary', title, description, images: ['/endpointlog-wordmark-color.png'] },
  };
}

export const websiteSchema = {
  '@context': 'https://schema.org', '@type': 'WebSite',
  '@id': 'https://endpointlog.com/#website', name: 'EndpointLog', url: 'https://endpointlog.com/',
  inLanguage: 'en', description: 'Practical Microsoft workplace guides, builds and insights by Jewelry Kenepa.',
};

export const authorSchema = {
  '@context': 'https://schema.org', '@type': 'ProfilePage', url: 'https://endpointlog.com/about/',
  mainEntity: {
    '@type': 'Person', '@id': 'https://endpointlog.com/about/#person', name: 'Jewelry Kenepa',
    url: 'https://endpointlog.com/about/', image: 'https://endpointlog.com/assets/jewelry.jpg',
    jobTitle: 'Senior Technical Consultant', sameAs: ['https://www.linkedin.com/in/jewelrykenepa/'],
  },
};
